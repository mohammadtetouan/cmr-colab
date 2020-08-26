import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  username = '';
  updateUserForm = {
    username: ''
  };
  constructor(
    public authService: AuthService,
    public ngFireAuth: AngularFireAuth,

  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.updateUserForm.username = user.displayName;
        console.log('user => ', user);
      } else {
        this.updateUserForm.username = '';
      }
    });
  }

  ngOnInit() {
  }
  updateUserInfo(username) {
    if (username.value) {
      this.authService.setUserdeisplayName(username.value);
    }
  }

}
