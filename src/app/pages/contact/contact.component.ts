import { Component, inject, OnInit } from '@angular/core';
import jsonarray from '../../../../dummy.json';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit {
  data: any[] = jsonarray;
  list: string = '';
  contactForm!: FormGroup;
  successMessage: string | null = null;
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.contactFrom();
  }

  // Initialize the form group
  contactFrom() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      // Perform form submission logic here (e.g., send the contact details to a backend server)
      this.successMessage = 'Thank you! Your message has been sent.';

      // Reset the form after submission
      this.contactForm.reset();
    } else {
      // Handle form errors
      this.successMessage = null;
    }
  }
}
