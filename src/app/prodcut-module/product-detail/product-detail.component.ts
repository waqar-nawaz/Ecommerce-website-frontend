import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ProductServiceService } from '../../services/product.service.service';
import { LoaderComponent } from '../../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [LoaderComponent, CommonModule],
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

  ngOnInit(): void {
    // Get the query parameter 'post'
    this.route.queryParamMap.subscribe((params) => {
      this.productObject = params.get('product');

      if (this.productObject) {
        // Fetch product details using the product ID
        this.loader = true;
        console.log('product object', this.productObject);
        this.prodcutService.getProductById(this.productObject).subscribe(
          (product: any) => {
            this.product = product?.result;
            console.log('get single product', this.product);
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
}
