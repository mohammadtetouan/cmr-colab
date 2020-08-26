import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OutilsPageRoutingModule } from './outils-routing.module';

import { OutilsPage } from './outils.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OutilsPageRoutingModule
  ],
  declarations: [OutilsPage]
})
export class OutilsPageModule {}
