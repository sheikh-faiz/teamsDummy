import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'image',
  //   loadChildren: () => import('./image-grid/image-grid.module').then(m => m.ImageGridModule)
  // },
  {
    path: 'image',
    loadChildren: () =>
      import('./test-list/test-list.module').then(
        (m) => m.TestListModule
      ),
  },
  {
    path: '',
    redirectTo: 'image',
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
