import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { environment } from '../../../../eviroments/enviroment';
import { ProductServiceService } from '../../services/product.service.service';
import Swal from 'sweetalert2';
import { RefreshService } from '../../services/refresh-service.service';
import { Router, RouterLink, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent implements OnInit {
  @Input() data: any;
  fileUrl: any = environment.fileUrl;
  products = inject(ProductServiceService);
  refreshService = inject(RefreshService);
  @Output() dataEmitter = new EventEmitter<string>();
  ngOnInit() {}

  deleteProduct(data: any) {
    this.dataEmitter.emit(data);
  }
  EditProduct(data: any) {
    this.refreshService.triggerRefresh(data);
  }
}
