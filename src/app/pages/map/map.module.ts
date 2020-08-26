import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MapPage } from './map';
import { MapPageRoutingModule } from './map-routing.module';
import { ToolsPage } from './tools/tools.page';
import { FormsModule } from '@angular/forms';
import { LayersListingPageModule } from '../layers/layers-listing/layers-listing.module';
import { DetailPageModule } from '../layers/detail/detail.module';
import { ToolsPageModule } from './tools/tools.module';
import { SelectLayerPage } from './select-layer/select-layer.page';
import { SelectLayerPageModule } from './select-layer/select-layer.module';
import { GenericComponentsModule } from '../../components/generic-components.module';

@NgModule({
  entryComponents: [
    ToolsPage,
   ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    LayersListingPageModule,
    DetailPageModule,
    SelectLayerPageModule,
    GenericComponentsModule
  ],
  declarations: [
    MapPage,
    ToolsPage
  ]
})
export class MapModule { }
