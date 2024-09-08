import { Component } from '@angular/core';
import { ModalComponent } from '../../components/modal/modal.component';
import Swal from 'sweetalert2';
import jsonarray from '../../../../dummy.json';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ModalComponent, FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }
  data: any[] = jsonarray;
  list: string = '';

  ngOnInit(): void {}
}
