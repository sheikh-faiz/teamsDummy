import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestListPublicComponent } from '../test-list/test-list-public/test-list-public.component';
import { TestListComponent } from './test-list/test-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: TestListComponent },
    ]
  },
  {
    path: ':id/public',
    component: TestListPublicComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestListRoutingModule { }
