import { Component, inject, OnInit } from '@angular/core';
import { ProductServiceService } from '../../services/product.service.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { LoaderComponent } from '../../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-product-detail',
    imports: [LoaderComponent, CommonModule],
    templateUrl: './post-detail.component.html',
    styleUrl: './post-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  postId: string | null = null;
  post: any;
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
        this.prodcutService.getPostById(this.postId).subscribe(
          (post: any) => {
            this.post = post?.result;
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
