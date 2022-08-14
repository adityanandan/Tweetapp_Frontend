import { Component, OnInit } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { User } from '../model/user';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
    ) { }
    
  loginForm: FormGroup;
  resetPasswordForm: FormGroup;
  submitted: boolean = false;
  resetSubmitted: boolean = false;
  loading: boolean = false;
  currentUser: User;
  invalid = false;
  resetPasswordValue: string;
  passwordResetComplete: boolean = false;
  showError:boolean=false;


  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl('home');
    }

    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.resetPasswordForm = this.formBuilder.group({
      username: ['', Validators.required],
    });
  }
  onSubmit() {
    console.log('Submitted');
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService
      .login(this.getUsername(), this.getPassword())
      .subscribe((data: any) => {
        if (data.loginStatus == 'success') {
          this.currentUser = data.user;
          this.authenticationService.setCurrentUser(this.currentUser);
          this.submitted = false;
          this.router.navigateByUrl('home');
        } else {
          this.invalid = true;
          this.loading = false;
        }
      });
  }
  getUsername() {
    return this.loginForm.get('userName').value;
  }

  getPassword() {
    return this.loginForm.get('password').value;
  }
  resetPasswordSubmit() {
    this.resetSubmitted = true;
    this.authenticationService
      .forgotPassword(this.resetPasswordForm.controls.username.value)
      .subscribe((data: any) => {
        if (
          (data.resetStatus !== undefined || data.resetStatus !== null) &&
          data.resetStatus == 'success'
        ) {
          this.resetPasswordValue = data.newPassword;
        }
        this.passwordResetComplete = true;
      },
      error=>{
        this.showError=true;
      });
  }
  showResetPasswordModal() {
    this.resetSubmitted = false;
    $('#resetPasswordModal').modal('show');
  }

  hideResetPasswordModal() {
    this.resetSubmitted = false;
    $('#resetPasswordModal').modal('hide');
  }
  get f() {
    return this.loginForm.controls;
  }
}
