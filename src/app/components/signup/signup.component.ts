import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [RouterLink, ReactiveFormsModule],
})
export class SignupComponent implements OnInit {
  authService = inject(AuthService);
  sharedService = inject(SharedService);
  fb = inject(FormBuilder);
  router = inject(Router);
  myForm!: FormGroup;
  submitted: boolean = false;

  ngOnInit(): void {
    this.myFormFun();
  }

  myFormFun() {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],

      // Add more form controls as needed
    });
  }

  get formControl() {
    return this.myForm.controls;
  }

  signup() {
    this.submitted = true;
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.authService.signup(this.myForm.value).subscribe((res: any) => {
      console.log(res);
      this.sharedService.maketoster({
        success: 'success',
        message: res?.message,
      });
      this.submitted = false;
      this.router.navigate(['/login']);
    });
  }
}
