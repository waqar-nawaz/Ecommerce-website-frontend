import { Component, HostListener, inject, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ShowIfRoleDirective } from '../../shared/show-if-admin.directive';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    ShowIfRoleDirective,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  token: any;
  user: object | any;
  authService = inject(AuthService);
  router = inject(Router);
  isDropdownOpen = false;
  isMobileMenuOpen: boolean = false;
  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = document.getElementById('dropdownMenu');
    const trigger = document.getElementById('dropdownTrigger');

    // Check if the click is outside the dropdown and trigger elements
    if (
      this.isDropdownOpen &&
      dropdown &&
      trigger &&
      !dropdown.contains(target) &&
      !trigger.contains(target)
    ) {
      this.isDropdownOpen = false;
    }
  }
}
