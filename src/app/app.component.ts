import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Platform } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Map',
      url: '/app/tabs/map',
      icon: 'map'
    },
    {
      title: 'Liste des couches',
      url: '/app/tabs/layers',
      icon: 'list'
    },
    {
      title: 'Sync',
      url: '/app/tabs/sync',
      icon: 'sync'
    },
    {
      title: 'Outils',
      url: '/app/tabs/outils',
      icon: 'settings'
    },

  ];
  loggedIn = false;
  dark = false;

  constructor(

    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
    private androidPermissions: AndroidPermissions
  ) {
    this.initializeApp();
  }

  async ngOnInit() {

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => console.log('Has permission?', result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      );
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION]);
    });
  }
  isLoggedIn() {
    this.loggedIn = this.authService.isLoggedIn;
  }

  
}
