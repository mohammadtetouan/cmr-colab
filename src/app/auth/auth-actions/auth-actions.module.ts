import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthActionsPageRoutingModule } from './auth-actions-routing.module';

import { AuthActionsPage } from './auth-actions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthActionsPageRoutingModule
  ],
  declarations: [AuthActionsPage]
})
export class AuthActionsPageModule {}
