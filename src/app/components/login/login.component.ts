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
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs';

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
  loginForm!: FormGroup;
  submitted: boolean = false;
  loader: boolean = false;
  toaster = inject(ToastrService);

  ngOnInit(): void {
    this.loginFormFun();
  }

  get formControl() {
    return this.loginForm.controls;
  }
  loginFormFun() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

      // Add more form controls as needed
    });
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loader = true;
    this.authService.login(this.loginForm.value).subscribe(
      (res: any) => {
        this.loader = false;
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.submitted = false;

        this.toaster.success(res?.message, '');
        this.router.navigate(['/dashboard']);
      },
      (error: any) => {
        this.loader = false;
        this.toaster.error(error?.error?.message);
      }
    );
  }
}
