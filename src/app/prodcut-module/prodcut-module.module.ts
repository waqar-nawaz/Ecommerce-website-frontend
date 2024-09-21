import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdcutModuleRoutingModule } from './prodcut-module-routing.module';
import { CreateProductComponent } from './create-product/create-product.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, ProdcutModuleRoutingModule],
  exports: [],
})
export class ProdcutModuleModule {}
