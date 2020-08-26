import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOnePage } from './add-one.page';

const routes: Routes = [
  {
    path: '',
    component: AddOnePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOnePageRoutingModule {}
