import { Component, Inject, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ProductServiceService } from '../../services/product.service.service';
import { LoaderComponent } from '../../loader/loader.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [LoaderComponent, CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  productObject: string | null = null;
  product: any;
  route = inject(ActivatedRoute);
  router = inject(Router);
  prodcutService = inject(ProductServiceService);
  cartService = inject(CartService);
  fileUrl: any = environment.fileUrl;
  loader: boolean = false;
  toaster = inject(ToastrService);
  userId: any;
  ngOnInit(): void {
    // Get the query parameter 'post'
    this.route.queryParamMap.subscribe((params) => {
      this.productObject = params.get('product');

      if (this.productObject) {
        // Fetch product details using the product ID
        this.loader = true;
        this.prodcutService.getProductById(this.productObject).subscribe(
          (product: any) => {
            this.product = product?.result;
            this.loader = false;
          },
          (err) => {
            console.log(err);
            this.loader = false;
          }
        );
      }
    });

    // Get the user ID from local storage
    this.userId = JSON.parse(localStorage.getItem('user') || '{}');
  }
  // This method is called when the user clicks the "Add to Cart" button
  addToCart(product: any) {
    let data = {
      productId: product?._id,
      userId: this.userId?._id,
      quantity: 1,
    };
    this.cartService.addToCart(data).subscribe(
      (res: any) => {
        console.log(res);
        this.router.navigateByUrl('/product/product-cart');
      },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
  }
}
