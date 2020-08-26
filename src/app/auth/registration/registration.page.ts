import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  mismatch = false;
  registerForm = {
    username: '',
    email: '',
    password: '',
    passwordConfirme: ''
  };
  serverError = false;
  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {}

  signUp(username, email, password, passwordConfirm) {
    if (this.isMatch(password, passwordConfirm)) {
      this.authService.RegisterUser(email.value, password.value)
      .then((res) => {
        // Do something here
        this.authService.SendVerificationMail();
        this.authService.setUserdeisplayName(username.value);
        // this.router.navigate(['verify-email']);
      }).catch((error) => {
        // window.alert(error.message);
        this.serverError = true;
      });
    }
  }
  verify() {
    this.router.navigate(['verify-email']);
  }
  login() {
    this.router.navigate(['login']);
  }
  isMatch(password, passwordConfirm) {
    if (password.value !== passwordConfirm.value) {
      this.mismatch = true;
      return false;
    } else {
      return true;
    }
  }
  inputChanged() {
    this.mismatch = false ;
  }

}
