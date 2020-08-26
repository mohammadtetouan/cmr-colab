import { Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, of } from 'rxjs';
import { UserOptions } from '../interfaces/user-options';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Router } from '@angular/router';
import { ToolsService } from '../generic/tools.service';
import { DataBaseService } from '../dataBase/data-base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // HAS_LOGGED_IN = 'hasLoggedIn';

  // constructor(
  //   public storage: Storage

  // ) { }
  // login(username: string, password: string): Observable<boolean>  {
  //   console.log('login service ...');

  //   if (username === 'admin' && password === username) {
  //     const un = username;
  //     const psw = password;
  //     const user = ({
  //       id: 1,
  //       username: un,
  //       password: psw
  //     } as UserOptions);
  //     console.log('login true ...');
  //     this.storage.set('User', user);
  //     // await this.storage.set(this.HAS_LOGGED_IN, true).then(async () => {
  //     //   window.dispatchEvent(new CustomEvent('user:login'));
  //     //   await this.setUsername(username);
  //     // });
  //     return of(true);
  //   } else {
  //     console.log('login false ...');

  //     return of(false);


  //   }
  // }
  // setUsername(username: string): Promise<any> {
  //   return this.storage.set('username', username);
  // }
  // isLoggedIn(): Promise<boolean> {
  //   return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
  //     return value === true;
  //   });
  // }




  userData: any;

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public tools: ToolsService,
    private db: DataBaseService,

  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        console.log('user => ', user);

        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Login in with email/password
  SignIn(email, password) {
    console.log(email, password);
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  // Register user with email/password
  RegisterUser(email, password) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }
  setUserdeisplayName(username) {
    console.log('username ', username);

    this.ngFireAuth.currentUser.then((user) => {
      user.updateProfile({
        displayName: username,
      }).then((u) => {
        console.log('u', u);
        // Update successful.
      }).catch((error) => {
        // An error happened.
      });
    });

  }

  // Email verification when new user register
  SendVerificationMail() {
    return this.ngFireAuth.currentUser
    .then((u) => {
      u.sendEmailVerification()
      .then(() => {
        // this.tools.presentAlertLinked(
        //   'Succès',
        //   'nous envoyons un e-mail de vérification à votre adresse e-mail veuillez vérifier votre boîte de réception et vérifier le lien',
        //   'Ok', 'login');
      });
    })
    .catch((err) => {
      this.tools.presentAlertLinked(
        'Error',
        "essayez de vous connecter avant d'effectuer cette opération",
        'Ok', 'login');
    });
  }

  // Recover password
  PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      this.tools.presentAlertLinked(
        'Succès',
        'Un e-mail de réinitialisation du mot de passe a été envoyé, veuillez vérifier votre boîte de réception.',
        'Ok', 'login');
      // window.alert('Un e-mail de réinitialisation du mot de passe a été envoyé, veuillez vérifier votre boîte de réception.');
    }).catch((error) => {
      this.tools.presentAlertLinked(
        'Error',
        error,
        'Ok', 'login');
      // window.alert(error);
    });
  }
  // CONFIRM PASS WORD RECOVERY
  confirmNewPassword(code, newPassword) {
    this.ngFireAuth.confirmPasswordReset(code, newPassword)
    .then(() => {
      // Success
      // this.SendVerificationMail();
      this.tools.presentAlertLinked(
        'Succès',
        'nouveau mot de passe défini avec succès',
        'Ok', 'login');
    })
    .catch((error) => {
      this.tools.presentAlertLinked(
        'Error',
        error,
        'Ok', 'login');
      // Invalid code
    });
  }
  handleVerifyEmail(actionCode) {
    this.ngFireAuth.applyActionCode(actionCode).then((resp) => {
      // Email address has been verified.
      this.tools.presentAlertLinked(
        'Succès',
        "L'adresse e-mail a été vérifiée avec succès",
        'Ok', 'login');
    }).catch((error) => {
      // Code is invalid or expired. Ask the user to verify their email address
      this.tools.presentAlertLinked(
        'Error',
        "Le code n'est pas valide ou a expiré. Demandez à l'utilisateur de vérifier son adresse e-mail",
        "renvoyer l'e-mail de vérification", 'verify-email');
    });
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // get isLoggedIn(): boolean {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   return (user !== null) ? true : false;
  // }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  // Sign-out
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

}
