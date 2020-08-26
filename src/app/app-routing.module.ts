import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanLoginGuardService } from './auth/can-login-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule),
    canActivate: [CanLoginGuardService]
  },
  {
    path: 'auth-actions',
    loadChildren: () => import('./auth/auth-actions/auth-actions.module').then( m => m.AuthActionsPageModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
  {
    path: 'add-one',
    loadChildren: () => import('./pages/layers/add-one/add-one.module').then( m => m.AddOnePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./pages/layers/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'detail',
    loadChildren: () => import('./pages/layers/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./auth/registration/registration.module').then( m => m.RegistrationPageModule),
    canActivate: [CanLoginGuardService]

  },
  {
    path: 'verify-email',
    loadChildren: () => import('./auth/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'password-reset/:code',
    loadChildren: () => import('./auth/password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
  },
  {
    path: '',
    redirectTo: '/app/tabs/map',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '/app/tabs/map' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
