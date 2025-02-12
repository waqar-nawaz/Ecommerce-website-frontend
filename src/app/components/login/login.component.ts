import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../environments/environment';
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

declare var google: any;

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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
    this.loadGoogleScript();
  }




  get formControl() {
    return this.loginForm.controls;
  }

  loginFormFun() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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


  loadGoogleScript() {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.initGoogleSignIn();  // Initialize Google Sign-In after the script is loaded
      };
      document.body.appendChild(script);
    }
  }

  initGoogleSignIn() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleGoogleLogin(response),
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",      // "outline" | "filled_blue" | "filled_black"
          size: "medium",         // "small" | "medium" | "large"
          shape: "reqtangular",  // "rectangular" | "pill" | "circle" | "square"
          logo_alignment: "left" // "left" | "center"
        }
      );

    }
  }

  handleGoogleLogin(response: any) {
    const idToken = response.credential;
    this.authService.googleLogin(idToken).subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.toaster.success(res?.message, '');
        // this.router.navigate(['/dashboard']);
        window.location.href = '/dashboard';
      },
      (error) => {
        this.toaster.error('Google login failed. Please try again.', error);
      }
    );
  }
}
