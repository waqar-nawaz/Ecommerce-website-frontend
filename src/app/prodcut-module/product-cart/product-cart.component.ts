import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css',
})
export class ProductCartComponent {
  total: number | undefined;
  subtotal!: number;
  tax: number | undefined;
  grandTotal: number | undefined;
  shareService = inject(SharedService);
  cartService = inject(CartService);
  data: any[] = [];
  loader: boolean = false;
  itemCount!: number;
  userId: any;
  constructor(private toastr: ToastrService) {
    // this.getCart();
  }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('usr id ', this.userId);
    this.calculateTotals();
    this.getCart();
  }

  countProduct(event: any, price: number) {
    const quantity = event.target.value;
    const total = price * quantity;
    this.total = total;
  }

  isDisabled: boolean = false;
  incrementQuantity(item: any) {
    if (item?.quantity >= item?.stock) {
      // this.isDisabled = true;
      this.toastr.warning('Going out of stock', '', {
        closeButton: true,
      });
      return;
    }

    // this.isDisabled = false;
    item.quantity++;
    item.total = item.price * item.quantity;
    this.calculateTotals();
  }

  decrementQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      item.total = item.price * item.quantity;
      this.calculateTotals();
    }
  }

  addItem(item: any) {
    this.data.forEach((val: any) => {
      if (item == val.id) {
        this.toastr.warning('Already In Card', '', {
          closeButton: true,
          positionClass: 'toast-center-center',
        });
      }
    });
  }

  clearCart() {
    this.calculateTotals();
  }

  removeItem(itemId: number) {
    console.log(itemId);
    this.data = this.data.filter((item) => item?.product?._id !== itemId);
    this.calculateTotals();
  }

  calculateTotals() {
    if (this.data) {
      this.subtotal = this.data.reduce((acc, item) => acc + item.total, 0);
      this.tax = this.subtotal * 0.1; // Example tax calculation
      this.grandTotal = this.subtotal + this.tax;
    }
  }

  getCart() {
    this.loader = true;
    this.cartService.getCart(this.userId._id).subscribe(
      (res: any) => {
        this.loader = false;
        this.data = res.cart.items;
        this.itemCount = res.cart.items.length;
        this.calculateTotals();
      },
      (err) => {
        this.loader = false;
        if (err.error.error == 'jwt expired') {
          localStorage.removeItem('token');
        }
      }
    );
  }
}
