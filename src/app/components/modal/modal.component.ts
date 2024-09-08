import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductServiceService } from '../../services/product.service.service';
import { RefreshService } from '../../services/refresh-service.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../eviroments/enviroment';
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
  selectedFile: File | null = null;
  isUpdate: boolean = false;
  updateid: any;
  existingImageUrl: string | null = null;
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

  myFormFun() {
    this.myForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.email]],
      imageUrl: ['', [Validators.required]],
      description: ['', [Validators.required]],

      // Add more form controls as needed
    });
  }

  isLoading: boolean = false;
  submit() {
    // debugger;
    this.isLoading = true;
    const formData = new FormData();
    if (this.myForm.invalid) {
      formData.append('title', this.myForm.value.title);
      formData.append('price', this.myForm.value.price);
      formData.append('description', this.myForm.value.description);
      if (this.selectedFile) {
        formData.append('imageUrl', this.selectedFile, this.selectedFile.name);
      } else if (this.existingImageUrl) {
        formData.append('imageUrl', this.existingImageUrl);
      }
    }

    if (this.isUpdate) {
      this.prodcutService
        .updateProduct(this.updateid, formData)
        .subscribe((res: any) => {
          this.maketoster({ success: 'success', message: res?.message });
          this.refreshService.triggerRefresh(res);
          this.closeModal();
          this.isLoading = false;

          this.imagePreview = null;
          this.myForm.reset();
          // this.selectedFile = null;
        });
    } else {
      this.prodcutService.createProduct(formData).subscribe((res: any) => {
        this.maketoster({ success: 'success', message: res?.message });
        this.myForm.reset();
        this.selectedFile = null;
        this.imagePreview = null;
        this.isLoading = false;

        this.refreshService.triggerRefresh(res);
        this.closeModal();
      });
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
