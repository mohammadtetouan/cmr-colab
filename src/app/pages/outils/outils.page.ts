import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import $ from 'jquery';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outils',
  templateUrl: './outils.page.html',
  styleUrls: ['./outils.page.scss'],
})
export class OutilsPage implements OnInit {
  map: Map;

  constructor(
    public authService: AuthService,
    public router: Router,

  ) { }

  ngOnInit() {
  }
  profile() {
    this.router.navigate(['app', 'tabs', 'outils', 'profile']);
  }
  about() {
    this.router.navigate(['app', 'tabs', 'outils', 'about']);
  }
}
