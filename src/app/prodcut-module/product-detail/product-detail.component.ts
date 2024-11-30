import { Component, Inject, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ProductServiceService } from '../../services/product.service.service';
import { LoaderComponent } from '../../loader/loader.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-product-detail',
  imports: [LoaderComponent, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  productObject: string | null = null;
  product: any;
  route = inject(ActivatedRoute);
  router = inject(Router);
  prodcutService = inject(ProductServiceService);
  shareServie = inject(SharedService);
  cartService = inject(CartService);
  fileUrl: any = environment.fileUrl;
  loader: boolean = false;
  toaster = inject(ToastrService);
  isLoading: boolean = false;
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
  }
  // This method is called when the user clicks the "Add to Cart" button
  addToCart(product: any) {
    this.isLoading = true;
    let data = {
      productId: product?._id,
      userId: this.shareServie.getUserDetail()?._id,
      quantity: 1,
    };
    this.cartService.addToCart(data).subscribe(
      (res: any) => {
        console.log(res);
        this.isLoading = false;
        this.toaster.success(res.message);
        // this.router.navigateByUrl('/product/product-cart');
      },
      (err) => {
        this.isLoading = false;
        this.toaster.error(err.error.message);
      }
    );
  }
}
