import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { LoaderComponent } from '../../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  sharedService = inject(SharedService);
  fb = inject(FormBuilder);
  router = inject(Router);
  myForm!: FormGroup;
  submitted: boolean = false;
  loader: boolean = false;

  ngOnInit(): void {
    this.myFormFun();
  }

  get formControl() {
    return this.myForm.controls;
  }
  myFormFun() {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],

      // Add more form controls as needed
    });
  }

  login() {
    this.submitted = true;
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.loader = true;
    this.authService.login(this.myForm.value).subscribe(
      (res: any) => {
        this.loader = false;
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.submitted = false;
        this.sharedService.maketoster({
          success: 'success',
          message: res?.message,
        });
        this.router.navigate(['/dashbord']);
      },
      (error: any) => {
        this.loader = false;
        this.sharedService.maketoster({
          success: 'error',
          message: error?.error?.message,
        });
      }
    );
  }
}
