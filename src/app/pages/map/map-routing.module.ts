import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapPage } from './map';

const routes: Routes = [
  {
    path: '',
    component: MapPage
  },
  {
    path: 'tools',
    loadChildren: () => import('./tools/tools.module').then( m => m.ToolsPageModule)
  },
  {
    path: 'select-layer',
    loadChildren: () => import('./select-layer/select-layer.module').then( m => m.SelectLayerPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapPageRoutingModule { }
