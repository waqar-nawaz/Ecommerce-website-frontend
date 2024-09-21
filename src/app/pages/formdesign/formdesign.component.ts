import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoriesListComponent } from '../../prodcut-module/categories-list/categories-list.component';

@Component({
  selector: 'app-formdesign',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CategoriesListComponent],
  templateUrl: './formdesign.component.html',
  styleUrl: './formdesign.component.css',
})
export class FormdesignComponent {}
