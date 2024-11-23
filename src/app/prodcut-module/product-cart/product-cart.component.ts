import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';
import { LoaderComponent } from '../../loader/loader.component';
import { environment } from '../../../../environments/environment';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [CommonModule, LoaderComponent, LazyLoadImageModule],
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
  defaultImage: any = environment.defaultImage;
  constructor(private toastr: ToastrService) {
    // this.getCart();
  }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user') || '{}');
    // console.log('usr id ', this.userId);
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
    // console.log('item', item);
    if (item?.quantity >= item?.product?.stock) {
      // this.isDisabled = true;
      this.toastr.warning('Going out of stock', '', {
        closeButton: true,
        progressBar: false,
        timeOut: 6000,
      });
      return;
    }

    item.quantity++;
    item.total = item?.product?.price * item.quantity;
    this.calculateTotals();
    this.updateCartItem(item?.product?._id, item?.quantity);
  }

  decrementQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      item.total = item?.product?.price * item.quantity;
      this.calculateTotals();
      this.updateCartItem(item?.product?._id, item?.quantity);
    }
  }

  updateCartItem(productId: any, quantity: number) {
    let data = {
      productId: productId,
      userId: this.userId?._id,
      quantity: quantity,
    };
    this.cartService.updateCart(data).subscribe(
      (res: any) => {
        // console.log(res);
      },
      (err) => {}
    );
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
    this.data = this.data.filter((item) => item?.product?._id !== itemId);
    this.deleteFromTheCart(itemId);
    this.calculateTotals();
    this.itemCount = this.itemCount - 1;
  }

  deleteFromTheCart(productId: any) {
    let data = {
      productId: productId,
      userId: this.userId?._id,
    };
    this.cartService.deleteCartItem(data).subscribe(
      (res: any) => {
        // console.log(res);
        //this.toaster.success(res.message);
      },
      (err) => {
        //this.toaster.error(err.error.message);
      }
    );
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
      }
    );
  }
}
