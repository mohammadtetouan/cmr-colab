import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SyncPageRoutingModule } from './sync-routing.module';

import { SyncPage } from './sync.page';
import { LayersListingPageModule } from '../layers/layers-listing/layers-listing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SyncPageRoutingModule,
    LayersListingPageModule,

  ],
  declarations: [SyncPage]
})
export class SyncPageModule {}
