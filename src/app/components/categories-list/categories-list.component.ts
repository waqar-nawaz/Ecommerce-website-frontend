import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css',
})
export class CategoriesListComponent {
  categories = [
    { name: 'Electronics', icon: 'fa fa-laptop' },
    { name: 'Clothing', icon: 'fa fa-tshirt' },
    { name: 'Home Goods', icon: 'fa fa-home' },
    // Add more categories as needed
  ];
}
