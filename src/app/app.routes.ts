import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/productlist/about.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { SignupComponent } from './components/signup/signup.component';
import { ProductDetailComponent } from './pages/post-detail/post-detail.component';
import { FormdesignComponent } from './pages/formdesign/formdesign.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], // Use HeaderLayoutComponent for these routes
    children: [
      { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
      {
        path: 'contact',
        component: ContactComponent,
        canActivate: [AuthGuard],
      },
      { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },

      {
        path: 'product-detail',
        component: ProductDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'calendar',
        component: FormdesignComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./prodcut-module/prodcut-module.module').then(
            (m) => m.ProdcutModuleModule
          ),
      },
    ],
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
];
