import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyLoadDirective } from './lazy-load.directive';

const directives = [
  LazyLoadDirective,
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: directives,
  exports: directives
})
export class SharedDirectivesModule { }
