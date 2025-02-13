import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-orders',
  imports: [CommonModule], // ✅ Removed imports
  templateUrl: './product-orders.component.html',
  styleUrls: ['./product-orders.component.css'] // ✅ Fixed styleUrls
})
export class ProductOrdersComponent implements OnInit {

  orders$: Observable<any> | undefined;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.orders$ = this.getOrder();
  }

  getOrder(): Observable<any> {
    return this.cartService.getOrder();
  }


  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'ordered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  }

}
