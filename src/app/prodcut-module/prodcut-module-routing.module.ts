import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProductComponent } from './create-product/create-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { ProductCartComponent } from './product-cart/product-cart.component';

const routes: Routes = [
  {
    path: 'create-product',
    component: CreateProductComponent,
  },
  {
    path: 'list-product',
    component: ListProductComponent,
  },
  {
    path: 'category',
    component: CategoriesListComponent,
  },
  {
    path: 'product-cart',
    component: ProductCartComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdcutModuleRoutingModule {}
