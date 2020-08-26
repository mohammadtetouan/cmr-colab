import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectLayerPageRoutingModule } from './select-layer-routing.module';

import { SelectLayerPage } from './select-layer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectLayerPageRoutingModule
  ],
  declarations: [SelectLayerPage]
})
export class SelectLayerPageModule {}
