import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayersListingPage } from './layers-listing.page';

const routes: Routes = [
  {
    path: '',
    component: LayersListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayersListingPageRoutingModule {}
