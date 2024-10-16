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
import Swal from 'sweetalert2';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { environment } from '../../../../environments/environment';
import { LoaderComponent } from '../../loader/loader.component';
import { ListProductComponent } from '../list-product/list-product.component';
import { ShowIfRoleDirective } from '../../shared/show-if-admin.directive';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    LazyLoadImageModule,
    LoaderComponent,
    ListProductComponent,
    ShowIfRoleDirective,
  ],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css',
})
export class CategoriesListComponent implements OnInit {
  @ViewChild('myDialogRef') dialogRef!: ElementRef<HTMLDialogElement>;
  fb = inject(FormBuilder);
  selectedFile: any;
  imagePreview: string | ArrayBuffer | null = null;
  productService = inject(ProductServiceService);
  categorydata: any[] = [];
  defaultImage: any = environment.defaultImage;
  isLoading: boolean = false;
  loader: boolean = true;
  showProduct: any = false;
  categories = [
    { name: 'Electronics', icon: 'fas fa-laptop' },
    { name: 'Clothing', icon: 'fas fa-tshirt' },
    { name: 'Home Goods', icon: 'fas fa-home' },
    // Add more categories as needed
  ];
  categoryForm!: FormGroup;

  ngOnInit(): void {
    this.myForm();
    this.getCategory();
  }

  onAddCategory() {
    this.isLoading = true;
    if (this.categoryForm.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('name', this.categoryForm.get('name')?.value);
    if (this.selectedFile) {
      formData.append('imageUrl', this.selectedFile);
    }

    this.productService.createCategory(formData).subscribe(
      (res: any) => {
        // console.log('response of the category', res);
        this.categoryForm.reset();
        this.selectedFile = null;
        this.categorydata.push(res.result);
        this.isLoading = false;
        this.imagePreview = '';
        this.maketoster({ success: 'success', message: res?.message });
        this.closeDialog();
      },
      (error) => {
        this.isLoading = false;
        this.closeDialog();
      }
    );
  }

  getCategory() {
    this.loader = true;
    this.productService.getCategory(1).subscribe(
      (res: any) => {
        this.categorydata = res?.result;
        console.log('response of the category', res);
        this.loader = false;
      },
      (error) => {
        this.loader = false;
      }
    );
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
