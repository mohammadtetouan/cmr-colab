import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanLoginGuardService implements CanActivate {

  constructor(
    public ngFireAuth: AngularFireAuth,
    public router: Router,

  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
        this.ngFireAuth.authState.subscribe(user => {
          if (user && user.emailVerified) {

            this.router.navigate(['app', 'tabs', 'map']);

            resolve(false);

          } else {
            resolve(true);
          }
        });
    });
  }
}
