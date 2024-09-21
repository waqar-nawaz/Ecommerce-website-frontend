import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalComponent],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css',
})
export class ListProductComponent {
  EditProduct(arg0: any) {
    throw new Error('Method not implemented.');
  }
  deleteProduct(arg0: any) {
    throw new Error('Method not implemented.');
  }
}
