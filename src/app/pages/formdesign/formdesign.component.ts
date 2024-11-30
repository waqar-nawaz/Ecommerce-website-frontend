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
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formdesign.component.html',
  styleUrl: './formdesign.component.css',
})
export class FormdesignComponent {}
