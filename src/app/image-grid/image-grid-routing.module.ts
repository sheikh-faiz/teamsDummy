import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { ImageGridComponent } from "./image-grid/image-grid.component";

const imageGridRoutes : Routes = [
    { path : '' , component : ImageGridComponent},
];

@NgModule({
    imports : [
        RouterModule.forChild(imageGridRoutes)
    ],
    exports : [RouterModule]
})
export class ImageGridRoutingModule{

}