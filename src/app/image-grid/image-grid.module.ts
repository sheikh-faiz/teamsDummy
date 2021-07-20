import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { ImageGridComponent } from './image-grid/image-grid.component';
import { ImageGridRoutingModule } from './image-grid-routing.module';
import { ImageGridService } from './services/image-grid.service';
import { SharedDirectivesModule } from '../directives/shared-directives.module';

@NgModule({
    declarations : [
        ImageGridComponent
    ],
    imports : [
        CommonModule,
        ImageGridRoutingModule,
        SharedDirectivesModule,

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
    exports: [DialogModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        TabMenuModule,
        TabViewModule,
        PaginatorModule,
        RatingModule,
        TableModule,
        ButtonModule],
    providers: [
        ImageGridService,
      ],
})
export class ImageGridModule{
    
}