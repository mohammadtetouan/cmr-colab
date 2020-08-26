import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs-page';
import { TabsPageRoutingModule } from './tabs-page-routing.module';

import { MapModule } from '../map/map.module';
import { GenericComponentsModule } from '../../components/generic-components.module';
@NgModule({
  imports: [
    MapModule,
    CommonModule,
    IonicModule,
    TabsPageRoutingModule,
    GenericComponentsModule
  ],
  declarations: [
    TabsPage,
  ]
})
export class TabsModule { }
