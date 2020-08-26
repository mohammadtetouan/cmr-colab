import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectLayerPage } from './select-layer.page';

const routes: Routes = [
  {
    path: '',
    component: SelectLayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectLayerPageRoutingModule {}
