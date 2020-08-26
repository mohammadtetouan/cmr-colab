import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-actions',
  templateUrl: './auth-actions.page.html',
  styleUrls: ['./auth-actions.page.scss'],
})
export class AuthActionsPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public authService: AuthService,

  ) { }

  ngOnInit() {
    this.actionRoute();

  }
  actionRoute() {
    const code = this.route.snapshot.queryParams.oobCode;
    const mode = this.route.snapshot.queryParams.mode;
    const continueUrl = this.route.snapshot.queryParams.continueUrl;
    const lang = this.route.snapshot.queryParams.lang || 'ar';
    console.log('mode , code ', mode, code);

    // Handle the user management action.
    switch (mode) {
      case 'resetPassword':
        // Display reset password handler and UI.
        // handleResetPassword(auth, actionCode, continueUrl, lang);
        this.router.navigate(['password-reset', code]);

        break;
      case 'recoverEmail':
        // Display email recovery handler and UI.
        this.router.navigate(['app', 'tabs', 'map']);

        break;
      case 'verifyEmail':
        // Display email verification handler and UI.
        this.handleVerifyEmail(code);
        break;
      default:
        // Error: invalid mode.
    }
  }
  handleVerifyEmail(actionCode) {
    this.authService.handleVerifyEmail(actionCode);
  }
}
