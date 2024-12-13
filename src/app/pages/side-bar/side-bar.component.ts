import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  items = [
    {
      routeLink: 'dashboard',
      icon: 'fa-solid fa-house',
      label: 'Dashboard',
    },
    {
      routeLink: '/product/category',
      icon: 'fa-solid fa-gift',
      label: 'Products',
    },
    {
      routeLink: 'pages',
      icon: 'a-solid fa-file-lines',
      label: 'Pages',
    },
    {
      routeLink: 'settings',
      icon: 'fa-solid fa-gear',
      label: 'Settings',
    },
  ];

  isLeftSidebarCollapsed: boolean = false;
  toggleCollapse(): void {
    // this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
    this.isLeftSidebarCollapsed = !this.isLeftSidebarCollapsed;
  }

  closeSidenav(): void {
    this.isLeftSidebarCollapsed = !this.isLeftSidebarCollapsed;
  }
}
