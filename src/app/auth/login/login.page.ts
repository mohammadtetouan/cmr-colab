import { Component, OnInit } from '@angular/core';
import { UserOptions } from '../../interfaces/user-options';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToolsService } from '../../generic/tools.service';
import { DataBaseService } from '../../dataBase/data-base.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  login: UserOptions = { id: 1, username: '', password: '' };
  submitted = false;
  incorrect = false;
  verified = true;
  loginForm = {
    email: '',
    password: ''
  };
  serverError = false ;
  error: string;
  constructor(
    public authService: AuthService,
    public router: Router,
    public tools: ToolsService,
    private db: DataBaseService,

  ) { }

  // onLogin(form: NgForm) {
  //   this.submitted = true;

  //   if (form.valid) {
  //     this.authService.SignIn(this.login.username, this.login.password).subscribe((state) => {
  //       console.log('Login...');
  //       if (state) {
  //         console.log('routing...');
  //         this.incorrect = false;
  //         // this.router.navigateByUrl('/app/tabs/layers');
  //         this.router.navigate(['/', 'app', 'tabs', 'map']);
  //       } else {
  //         this.incorrect = true;
  //       }
  //     });
  //   }
  // }
  inputChanged() {
    this.incorrect = false;
  }
  logIn(email, password) {
    console.log(email.value, password.value);

    this.authService.SignIn(email.value, password.value)
      .then((res) => {
        if (res) {
          console.log('credentianls', res.user);
          if (res.user.emailVerified) {
            this.db.setUser(res.user)
            .then((savedUser) => {
              if (savedUser) {
                this.router.navigate(['app', 'tabs', 'map']);
              }
            })
            .catch((err) => {
              this.error = "Une erreur interne s'est produite veuillez essayer de vous connecter plus tard";
              // this.tools.presentAlert('Erreur', "Une erreur interne s'est produite veuillez essayer de vous connecter plus tard");
            });
          } else {
            // window.alert('Email is not verified');
            this.error = "L'adresse e-mail n'est pas vérifiée";

            // this.tools.presentAlert('Erreur', "L'adresse e-mail n'est pas vérifiée");
            this.verified = res.user.emailVerified;
            return false;
          }
        }
      }).catch((error) => {
        // console.log('err', error);
        // this.tools.presentAlert('Erreur', error.message);
        this.serverError = true;
        // window.alert(error.message);
      });
  }
  passwordRecover(email) {
    if (email.value) {
      this.authService.PasswordRecover(email.value);
    } else {
      // this.tools.presentAlert('Attention!', "Tapez d'abord votre e-mail");
      this.error ="Tapez d'abord votre e-mail";

    }
  }
  register() {
    this.router.navigate(['registration']);
  }
  verify() {
    this.router.navigate(['verify-email']);
  }
}
