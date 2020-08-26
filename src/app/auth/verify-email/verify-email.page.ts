import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router

  ) { }

  ngOnInit() {
  }
  register() {
    this.router.navigate(['registration']);
  }
  login() {
    this.router.navigate(['login']);
  }
}
