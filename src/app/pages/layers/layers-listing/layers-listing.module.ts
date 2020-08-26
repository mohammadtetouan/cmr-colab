import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LayersListingPageRoutingModule } from './layers-listing-routing.module';

import { LayersListingPage } from './layers-listing.page';
import { AddOnePage } from '../add-one/add-one.page';
import { EditPage } from '../edit/edit.page';
import { FilterPipe } from '../../../filter.pipe';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  entryComponents: [
    AddOnePage,
    EditPage
   ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LayersListingPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [
    LayersListingPage,
    AddOnePage,
    EditPage,
    FilterPipe

  ]
})
export class LayersListingPageModule {}
