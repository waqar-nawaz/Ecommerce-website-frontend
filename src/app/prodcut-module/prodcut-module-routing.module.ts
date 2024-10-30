import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProductComponent } from './create-product/create-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AuthGuard } from '../guards/auth.guard';

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
    canActivate: [AuthGuard],
  },
  {
    path: 'product-detail',
    component: ProductDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdcutModuleRoutingModule {}
