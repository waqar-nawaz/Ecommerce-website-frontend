import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { RefreshService } from '../../services/refresh-service.service';
import { ProductServiceService } from '../../services/product.service.service';
import Swal from 'sweetalert2';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { LoaderComponent } from '../../loader/loader.component';
import { ToastrService } from 'ngx-toastr';
import { ShowIfRoleDirective } from '../../shared/show-if-admin.directive';
import { CartService } from '../../services/cart.service';
import { SharedService } from '../../services/shared.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-list-product',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    LazyLoadImageModule,
    LoaderComponent,
    ShowIfRoleDirective,
  ],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css',
})
export class ListProductComponent implements OnInit {
  productForm!: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;
  isUpdate: any;
  isModalOpen = false;
  fileUrl: any = environment.fileUrl;
  imagePreview: string | ArrayBuffer | null = null;
  isLoading: boolean = false;
  defaultImage: any = environment.defaultImage;
  refreshService = inject(RefreshService);
  shareService = inject(SharedService);
  productService = inject(ProductServiceService);
  fb = inject(FormBuilder);
  selectedFile: any;
  updateid: any;
  existingImageUrl: string | null = null;
  submitted: boolean = false;
  data: any[] = [];
  user: any;
  loader: boolean = false;
  categorydata: any;
  cartService = inject(CartService);
  categoryId: string | null = null;
  category: any;
  route = inject(ActivatedRoute);
  toaster = inject(ToastrService);
  @Input() restriction: boolean = true;
  search: FormControl = new FormControl();


  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.categoryId = params.get('category');
      // if (this.categoryId) {
      this.getProduct(this.categoryId);

      // }
    });



    this.myFormFun();
    this.getCategory();

    // Get the query parameter 'post' from the URL      
    this.setupSearchSubscription();

    this.productForm.patchValue({
      category: this.categoryId,
    });

  }

  setupSearchSubscription() {
    this.search.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(query => this.productService.searchProduct(query))
      )
      .subscribe((data: any) => {
        this.data = data?.result;
      });
  }



  myFormFun() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      stock: ['', Validators.required],
      sku: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      image: [null],
    });
  }

  get formControl() {
    return this.productForm.controls;
  }

  getProduct(id: any) {
    this.loader = true;
    this.productService.getProduct(id).subscribe(
      (val: any) => {
        // console.log('Product data', val?.result);
        this.data = val?.result;
        this.loader = false;
      },
      (err) => {
        this.loader = false;
      }
    );
  }

  fileupload(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.previewImage(this.selectedFile);
    }
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isUpdate = false;
    this.productForm.reset();
    this.imagePreview = null;
  }

  EditProduct(arg0: any) { }

  // open the modal and fill the form with the selected product data for updating it
  submit() {
    this.submitted = true;
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    // console.log(this.productForm);

    this.isLoading = true;
    const formData = new FormData();

    formData.append('name', this.productForm.value.name);
    formData.append('price', this.productForm.value.price);
    formData.append('description', this.productForm.value.description);
    formData.append('brand', this.productForm.value.brand);
    formData.append('sku', this.productForm.value.sku);
    formData.append('category', this.productForm.value.category);
    formData.append('stock', this.productForm.value.stock);
    if (this.selectedFile) {
      formData.append('imageUrl', this.selectedFile, this.selectedFile.name);
    } else if (this.existingImageUrl) {
      formData.append('imageUrl', this.existingImageUrl);
    }

    if (this.isUpdate) {
      this.productService.updateProduct(this.updateid, formData).subscribe(
        (res: any) => {
          // this.maketoster({ success: 'success', message: res?.message });
          this.toaster.success(res?.message);

          this.refreshService.triggerRefresh(res);
          this.closeModal();
          this.isLoading = false;

          this.imagePreview = null;
          this.productForm.reset();
          this.selectedFile = null;
        },
        (err) => {
          // this.maketoster({ success: 'error', message: err?.error?.message });
          this.toaster.error(err?.error?.message);

          this.isLoading = false;
        }
      );
    } else {
      this.productService.createProduct(formData).subscribe(
        (res: any) => {
          this.toaster.success(res?.message);

          this.productForm.reset();
          this.selectedFile = null;
          this.imagePreview = null;
          this.isLoading = false;
          this.data.push(res?.result);
          // this.refreshService.triggerRefresh(res);
          this.closeModal();
        },
        (err) => {
          this.toaster.error(err?.error?.message);
          this.isLoading = false;
        }
      );
    }
  }

  getCategory() {
    this.productService.getCategory(1).subscribe(
      (res: any) => {
        this.categorydata = res?.result;
        // console.log('response of the category', res);
      },
      (error) => { }
    );
  }

  deleteProduct(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(data._id).subscribe(
          (res: any) => {
            this.data = this.data.filter((val) => {
              return val._id != data._id;
            });
            this.toaster.success(res?.message);
            console.log('after deletion', this.data);
          },
          (err) => {
            console.log('error', err);
          }
        );
      }
    });
  }

  addToCart(product: any) {
    // this.loadingProductIds.add(product._id);
    product.isloading = true;
    let data = {
      productId: product?._id,
      userId: this.shareService?.getUserDetail()?._id,
      quantity: 1,
    };
    this.cartService.addToCart(data).subscribe(
      (res: any) => {
        console.log(res);
        this.toaster.success(res?.message);
        product.isloading = false;
      },
      (err) => {
        this.toaster.error(err.error.message);
        product.isloading = false;
      }
    );
  }
}
