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
  cartItems: any[] = [];
  itemCount!: number;

  constructor(private toastr: ToastrService) {
    // this.getCart();
  }

  ngOnInit(): void {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.itemCount = this.cartItems.length;
    this.calculateTotals();
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
    this.addToLocalStorage(this.cartItems);
    this.calculateTotals();
  }

  decrementQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      item.total = item.price * item.quantity;
      this.addToLocalStorage(this.cartItems);
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
    this.cartItems = [];
    this.calculateTotals();
  }

  removeItem(itemId: number) {
    this.cartItems = this.cartItems.filter((item) => item?.id !== itemId);
    this.addToLocalStorage(this.cartItems);
    this.calculateTotals();
  }

  addToLocalStorage(cart: any) {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  calculateTotals() {
    if (this.cartItems) {
      this.subtotal = this.cartItems.reduce((acc, item) => acc + item.total, 0);
      this.tax = this.subtotal * 0.1; // Example tax calculation
      this.grandTotal = this.subtotal + this.tax;
    }
  }

  getCart() {
    this.loader = true;
    this.cartService.getCart().subscribe(
      (res: any) => {
        this.loader = false;
        this.data = res.result[0].items;
        this.itemCount = res.result[0].items.length;
        console.log('cart data ', this.data);
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
