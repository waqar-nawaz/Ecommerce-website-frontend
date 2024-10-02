import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css',
})
export class ProductCartComponent {
  total: number | undefined;
  subtotal: number | undefined;
  tax: number | undefined;
  grandTotal: number | undefined;
  shareService = inject(SharedService);

  constructor(private toastr: ToastrService) {
    this.calculateTotals();
  }
  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!', {
      closeButton: true,
      // positionClass: 'toast-top-left',
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'decreasing',
      // toastClass: 'bg-gray-500 text-white rounded-lg shadow-md w-full p-2',
    });
  }

  countProduct(event: any, price: number) {
    const quantity = event.target.value;
    const total = price * quantity;
    this.total = total;
  }

  isDisabled: boolean = false;
  incrementQuantity(item: any) {
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
    // item.quantity = 1;
    // item.total = item.price * item.quantity;
    // this.cartItems.push(item);
    // this.calculateTotals();

    this.cartItems.forEach((val: any) => {
      if (item == val.id) {
        this.shareService.maketoster({
          success: 'warning',
          message: 'Alred in Cart',
        });
      }
    });
  }

  clearCart() {
    this.cartItems = [];
    this.calculateTotals();
  }

  cartItems = [
    {
      id: 1,
      name: 'Pi Pizza Oven',
      price: 469.99,
      quantity: 1,
      total: 469.99,
      imageUrl:
        'https://res.cloudinary.com/divsj2d5e/image/upload/v1727542854/Post/product_077ef2cf-1f47-42d7-83cc-f98da300d8c9.jpg',
      shipDate: 'June 6th',
      fuelSource: 'Wood Only',
      stock: 3,
    },
    {
      id: 2,
      name: 'Solo Stove Grill Ultimate Bundle',
      price: 549.99,
      quantity: 1,
      total: 549.99,
      imageUrl:
        'https://res.cloudinary.com/divsj2d5e/image/upload/v1727542854/Post/product_077ef2cf-1f47-42d7-83cc-f98da300d8c9.jpg',
    },
    {
      id: 3,
      name: 'Solo Stove Starters (4 pack)',
      price: 12,
      quantity: 1,
      total: 12,
      imageUrl:
        'https://res.cloudinary.com/divsj2d5e/image/upload/v1727542854/Post/product_077ef2cf-1f47-42d7-83cc-f98da300d8c9.jpg',
    },
    {
      id: 4,
      name: 'Solo Stove Charcoal Grill Pack',
      price: 10,
      quantity: 1,
      total: 10,
      imageUrl:
        'https://res.cloudinary.com/divsj2d5e/image/upload/v1727542854/Post/product_077ef2cf-1f47-42d7-83cc-f98da300d8c9.jpg',
    },
  ];

  removeItem(itemId: number) {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    this.calculateTotals();
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce((acc, item) => acc + item.total, 0);
    this.tax = this.subtotal * 0.1; // Example tax calculation
    this.grandTotal = this.subtotal + this.tax;
  }
}
