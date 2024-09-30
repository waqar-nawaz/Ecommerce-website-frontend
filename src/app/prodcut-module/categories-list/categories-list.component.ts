import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductServiceService } from '../../services/product.service.service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css',
})
export class CategoriesListComponent implements OnInit {
  @ViewChild('myDialogRef') dialogRef!: ElementRef<HTMLDialogElement>;
  fb = inject(FormBuilder);
  selectedFile: any;
  imagePreview: string | ArrayBuffer | null = null;
  productService = inject(ProductServiceService);

  categories = [
    { name: 'Electronics', icon: 'fas fa-laptop' },
    { name: 'Clothing', icon: 'fas fa-tshirt' },
    { name: 'Home Goods', icon: 'fas fa-home' },
    // Add more categories as needed
  ];
  categoryForm!: FormGroup;

  ngOnInit(): void {
    this.myForm();
  }

  onAddCategory() {
    if (this.categoryForm.valid) {
      console.log(this.categoryForm.value);
      this.closeDialog();
    }
    const formData = new FormData();
    formData.append('name', this.categoryForm.get('name')?.value);
    if (this.selectedFile) {
      formData.append('imageUrl', this.selectedFile);
    }
  }

  myForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  openDialog() {
    this.dialogRef.nativeElement.showModal(); // To open the dialog
  }

  closeDialog() {
    this.dialogRef.nativeElement.close(); // To close the dialog
    this.selectedFile = null;
  }

  file(event: any): void {
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
}
