import { Component, inject, OnInit, signal } from '@angular/core';
import jsonarray from '../../../../dummy.json';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { QuizFormComponent } from '../formarray/formarray.component';

interface UserInterface {
  name: string;
  email: string;
}
@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  successMessage: string | null = null;
  fb = inject(FormBuilder);

  title = signal('khan');

  user = signal<UserInterface[]>([{ name: 'asif', email: 'asif@gmail.com' }]);

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
    this.title.set('jamal');
    this.user.update((prevUser) => {
      return [...prevUser, { name: 'waqar', email: 'waqar@gmail.com' }];
    });

    if (this.contactForm.valid) {
      this.successMessage = 'Thank you! Your message has been sent.';

      this.contactForm.reset();
    } else {
      this.successMessage = null;
    }
  }
}
