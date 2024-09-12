import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFilterPipe } from './data-filter.pipe';

@NgModule({
  declarations: [],
  imports: [CommonModule, DataFilterPipe],

  exports: [DataFilterPipe],
})
export class SharedModule {}
