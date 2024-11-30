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
import { LoaderComponent } from '../../loader/loader.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
    imports: [RouterLink, ReactiveFormsModule, LoaderComponent, CommonModule]
})
export class SignupComponent implements OnInit {
  authService = inject(AuthService);
  sharedService = inject(SharedService);
  fb = inject(FormBuilder);
  toaster = inject(ToastrService);
  router = inject(Router);
  signUpForm!: FormGroup;
  submitted: boolean = false;
  loader: boolean = false;

  ngOnInit(): void {
    this.signUpFormFun();
  }

  signUpFormFun() {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      // rememberMe: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],

      // Add more form controls as needed
    });
  }

  get formControl() {
    return this.signUpForm.controls;
  }

  signup() {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    this.loader = true;
    this.authService.signup(this.signUpForm.value).subscribe(
      (res: any) => {
        // console.log(res);
        this.loader = false;
        this.toaster.success(res.message);

        this.submitted = false;
        this.router.navigate(['/login']);
      },
      (error) => {
        this.loader = false;
        this.toaster.error(error?.error?.message);
      }
    );
  }
}
