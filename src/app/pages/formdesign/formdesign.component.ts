import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-formdesign',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formdesign.component.html',
  styleUrl: './formdesign.component.css',
})
export class FormdesignComponent {
  productForm: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;

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

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      console.log(formData);
    }
  }
}
