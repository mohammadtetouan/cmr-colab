import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthActionsPage } from './auth-actions.page';

const routes: Routes = [
  {
    path: '',
    component: AuthActionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthActionsPageRoutingModule {}
