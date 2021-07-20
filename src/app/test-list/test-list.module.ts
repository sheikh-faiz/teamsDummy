import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TestListComponent } from './test-list/test-list.component';
import { TestListPublicComponent } from './test-list-public/test-list-public.component';

import { TestListRoutingModule } from './test-list-routing.module';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ImageGridService } from '../image-grid/services/image-grid.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [TestListComponent],
  imports: [
    TestListRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    TabMenuModule,
    TabViewModule,
    PaginatorModule,
    RatingModule,
    TableModule,
    ButtonModule,
    TranslateModule
  ],
  exports: [
    DialogModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        TabMenuModule,
        TabViewModule,
        PaginatorModule,
        RatingModule,
        TableModule,
        ButtonModule
  ],
  providers: [
    ImageGridService,
  ],
})
export class TestListModule { }
