import { Component, inject, OnInit } from '@angular/core';
import { ProductServiceService } from '../../services/product.service.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  postId: string | null = null;
  product: any;
  route = inject(ActivatedRoute);
  prodcutService = inject(ProductServiceService);
  fileUrl: any = environment.fileUrl;
  loader: boolean = false;

  ngOnInit(): void {
    // Get the query parameter 'post'
    this.route.queryParamMap.subscribe((params) => {
      this.postId = params.get('post');
      console.log(this.postId);
      if (this.postId) {
        // Fetch product details using the product ID
        this.loader = true;
        this.prodcutService.getProductById(this.postId).subscribe(
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
}
