import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { User } from '../model/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  isEmailUnique: boolean = true;
  isUsernameUnique: boolean = true;
  success: boolean = false;
  showError: Boolean;
  error: String;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required,Validators.pattern('[A-ZA-z]{1,}')]],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required,Validators.minLength(6)]],
      email: ['', [Validators.required,Validators.email]],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern('[7-9]{1}[0-9]{9}')],
      ],
    });
  }

  get f() {
    return this.registerForm.controls;
  }
  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    let user: User = {
      id: null,
      username: this.f.username.value,
      password: this.f.password.value,
      email: this.f.email.value,
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      contactNumber: this.f.contactNumber.value,
    };
    this.loading = true;
    this.authService.register(user).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.username !== undefined) {
          this.success = true;
        }
      },
      (err) => {
        this.loading = false;
        this.showError = true;
        this.error = err.error;
        if (
          err.message.includes('duplicate key') &&
          err.message.includes('username')
        ) {
          this.isUsernameUnique = false;
        }
        if (
          err.message.includes('duplicate key') &&
          err.message.includes('email')
        ) {
          this.isEmailUnique = false;
        }
      }
    );
  }
}
