import { Component, Inject, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ProductServiceService } from '../../services/product.service.service';
import { LoaderComponent } from '../../loader/loader.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { timeStamp } from 'console';
import { timeout } from 'rxjs';

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
  prodcutService = inject(ProductServiceService);
  fileUrl: any = environment.fileUrl;
  loader: boolean = false;
  toaster = inject(ToastrService);

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
  productArray: any[] = [];
  addToCart(product: any) {
    const productObject = {
      name: product?.name,
      quantity: 1,
      brand: product?.brand,
      total: product?.price,
      id: product?._id,
      price: product?.price,
      image: product?.imageUrl,
      description: product?.description,
    };

    // Retrieve the cart items from local storage, or initialize with an empty array
    let productArrayFromLocal = JSON.parse(
      localStorage.getItem('cart') || '[]'
    );

    // Check if the product already exists in the cart
    const productExists = productArrayFromLocal.some(
      (val: any) => val.id === productObject.id
    );

    if (productExists) {
      // Show a warning if the product is already in the cart
      this.toaster.warning('Already In The Cart, Update Quantity', '', {
        timeOut: 5000,
        positionClass: 'toast-center-center',
        progressBar: false,
      });
      Inject(Router).navigate(['product', 'product-cart']);
      return; // Exit the function
    }

    // If the product is not in the cart, add it to the array
    productArrayFromLocal.push(productObject);

    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(productArrayFromLocal));

    Inject(Router).navigate(['product', 'product-cart']);
  }
}
