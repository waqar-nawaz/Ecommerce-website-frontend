import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css',
})
export class CategoriesListComponent {
  categories = [
    { name: 'Electronics', icon: 'fas fa-laptop' },
    { name: 'Clothing', icon: 'fas fa-tshirt' },
    { name: 'Home Goods', icon: 'fas fa-home' },
    // Add more categories as needed
  ];
}
