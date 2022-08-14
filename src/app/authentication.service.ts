import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }
  currentUser: User;
  
  forgotPassword(username: string) {
    return this.http.get(environment.ApiUrl + `/${username}/forgot`);
  }
  resetPassword(username: string, password: string){
    return this.http.post(environment.ApiUrl + '/reset', {
      username,
      password,
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  setCurrentUser(user: User) {
    if (user == null) {
      localStorage.removeItem('currentUser');
      return;
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  isLoggedIn() {
    if (localStorage.getItem('currentUser') != null) {
      return true;
    }
    return false;
  }

  login(username: string, password: string) {
    return this.http.post(environment.ApiUrl + '/login', {
      username,
      password,
    });
  }

  register(user: User) {
    return this.http.post(environment.ApiUrl + '/register', user);
  }
}
