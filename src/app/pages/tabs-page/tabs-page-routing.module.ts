import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: () => import('../map/map.module').then(m => m.MapModule)
          }
        ]
      },
      {
        path: 'layers',
        loadChildren: () => import('../layers/layers-listing/layers-listing.module').then( m => m.LayersListingPageModule)
      },
      {
        path: 'sync',
        loadChildren: () => import('../sync/sync.module').then( m => m.SyncPageModule)
      },
      {
        path: 'outils',
        loadChildren: () => import('../outils/outils.module').then( m => m.OutilsPageModule)
      },
      // { path: '**', redirectTo: '/app/tabs/map' },
      {
        path: 'profile',
        loadChildren: () => import('../../auth/profile/profile.module').then( m => m.ProfilePageModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

