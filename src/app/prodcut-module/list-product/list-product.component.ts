import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import {
  FormBuilder,
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

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ModalComponent,
    ReactiveFormsModule,
    LazyLoadImageModule,
    LoaderComponent,
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
  prodcutService = inject(ProductServiceService);
  fb = inject(FormBuilder);
  selectedFile: any;
  updateid: any;
  existingImageUrl: string | null = null;
  submitted: boolean = false;
  data: any[] = [];
  user: any;
  loader: boolean = false;
  categorydata: any;

  ngOnInit(): void {
    this.myFormFun();
    this.getProduct();
    this.getCategory();
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
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

  getProduct() {
    this.loader = true;
    this.prodcutService.getProduct(1).subscribe(
      (val: any) => {
        console.log('Product data', val?.result);
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
  EditProduct(arg0: any) {}
  deleteProduct(arg0: any) {}

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
      this.prodcutService.updateProduct(this.updateid, formData).subscribe(
        (res: any) => {
          this.maketoster({ success: 'success', message: res?.message });
          this.refreshService.triggerRefresh(res);
          this.closeModal();
          this.isLoading = false;

          this.imagePreview = null;
          this.productForm.reset();
          this.selectedFile = null;
        },
        (err) => {
          this.maketoster({ success: 'error', message: err?.error?.message });
          this.isLoading = false;
        }
      );
    } else {
      this.prodcutService.createProduct(formData).subscribe(
        (res: any) => {
          this.maketoster({ success: 'success', message: res?.message });
          this.productForm.reset();
          this.selectedFile = null;
          this.imagePreview = null;
          this.isLoading = false;
          this.data.push(res?.result);
          // this.refreshService.triggerRefresh(res);
          this.closeModal();
        },
        (err) => {
          this.maketoster({ success: 'error', message: err?.error?.message });
          this.isLoading = false;
        }
      );
    }
  }

  getCategory() {
    this.prodcutService.getCategory(1).subscribe(
      (res: any) => {
        this.categorydata = res?.result;
        console.log('response of the category', res);
      },
      (error) => {}
    );
  }

  maketoster(...res: any) {
    // debugger;
    Swal.fire({
      position: 'top-end',
      icon: res[0].success,
      title: res[0].message,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
