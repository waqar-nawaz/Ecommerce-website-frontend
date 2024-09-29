import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductServiceService } from '../../services/product.service.service';
import { RefreshService } from '../../services/refresh-service.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  isModalOpen = false;
  myForm!: FormGroup;
  fb = inject(FormBuilder);
  fileUrl: any = environment.fileUrl;
  imagePreview: string | ArrayBuffer | null = null;

  refreshService = inject(RefreshService);
  prodcutService = inject(ProductServiceService);
  selectedFile: any;
  isUpdate: boolean = false;
  updateid: any;
  existingImageUrl: string | null = null;
  submitted: boolean = false;
  ngOnInit() {
    this.myFormFun();
    this.refreshService.getRefreshObservable().subscribe((res: any) => {
      this.openModal();
      this.updateid = res._id;
      if (this.updateid) {
        this.isUpdate = true;
        this.existingImageUrl = res?.imageUrl;
      }
      this.myForm.patchValue({
        title: res?.title,
        price: res?.price,
        description: res?.description,
      });
    });
  }

  isMobileMenuOpen: boolean = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  myFormFun() {
    this.myForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      price: ['', Validators.required],
      imageUrl: [''],
      description: ['', [Validators.required, Validators.minLength(10)]],
      // Add more form controls as needed
    });
  }
  get formControl() {
    return this.myForm.controls;
  }
  isLoading: boolean = false;
  submit() {
    this.submitted = true;
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log(this.myForm);

    this.isLoading = true;
    const formData = new FormData();

    formData.append('title', this.myForm.value.title);
    formData.append('price', this.myForm.value.price);
    formData.append('description', this.myForm.value.description);
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
          this.myForm.reset();
          this.selectedFile = null;
        },
        (err) => {
          this.maketoster({ success: 'error', message: err?.error?.message });
          this.isLoading = false;
        }
      );
    } else {
      this.prodcutService.createPost(formData).subscribe(
        (res: any) => {
          this.maketoster({ success: 'success', message: res?.message });
          this.myForm.reset();
          this.selectedFile = null;
          this.imagePreview = null;
          this.isLoading = false;
          res.status = 'create';
          this.refreshService.triggerRefresh(res);
          this.closeModal();
        },
        (err) => {
          this.maketoster({ success: 'error', message: err?.error?.message });
          this.isLoading = false;
        }
      );
    }
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
    this.myForm.reset();
    this.imagePreview = null;
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
