import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddOnePageRoutingModule } from './add-one-routing.module';

import { AddOnePage } from './add-one.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddOnePageRoutingModule
  ],
  declarations: [
    // AddOnePage
  ]
})
export class AddOnePageModule {}
