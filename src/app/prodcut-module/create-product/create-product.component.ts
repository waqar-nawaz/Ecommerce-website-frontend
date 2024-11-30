import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CategoriesListComponent } from '../categories-list/categories-list.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-product',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;
  isUpdate: any;
  isModalOpen = false;
  fileUrl: any = environment.fileUrl;
  imagePreview: string | ArrayBuffer | null = null;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      about: ['', Validators.required],
      sku: ['', Validators.required],
      field1: ['', Validators.required],
      field2: ['', Validators.required],
      field3: ['', Validators.required],
      image: [null],
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
        // console.log(this.imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  Submit(): void {
    this.isLoading = true;
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      console.log(formData);
    }
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
}
