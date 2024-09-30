import { Component } from '@angular/core';

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css',
})
export class ProductCartComponent {
  total: number | undefined;
  countProduct(data: any, price: any) {
    this.sumPrice(data.target.value, price);
  }
  sumPrice(count: any, price: any) {
    this.total = count * price;
  }
}
