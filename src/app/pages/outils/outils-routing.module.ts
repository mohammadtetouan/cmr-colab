import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutilsPage } from './outils.page';

const routes: Routes = [
  {
    path: '',
    component: OutilsPage,
  },
  {
    path: 'profile',
    loadChildren: () => import('../../auth/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutilsPageRoutingModule {}
