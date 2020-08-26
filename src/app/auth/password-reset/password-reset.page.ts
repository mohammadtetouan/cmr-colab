import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public authService: AuthService,

  ) { }

  ngOnInit() {
  }
  login() {
    this.router.navigate(['login']);
  }
  register() {
    this.router.navigate(['registration']);
  }
  reset(password) {
    // const code = this.route.snapshot.queryParams.code;
    const code = this.route.snapshot.paramMap.get('code');
    console.log('code ', code );
    this.authService.confirmNewPassword(code, password.value);
  }

}
