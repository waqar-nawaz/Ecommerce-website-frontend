import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ProductServiceService } from '../../services/product.service.service';
import { RefreshService } from '../../services/refresh-service.service';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ShowIfRoleDirective } from '../../shared/show-if-admin.directive';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [RouterLink, LazyLoadImageModule, ShowIfRoleDirective],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent implements OnInit {
  @Input() data: any;
  fileUrl: any = environment.fileUrl;
  defaultImage: any = environment.defaultImage;
  products = inject(ProductServiceService);
  refreshService = inject(RefreshService);
  @Output() dataEmitter = new EventEmitter<string>();
  ngOnInit() {}

  deleteProduct(data: any) {
    this.dataEmitter.emit(data);
  }
  EditProduct(data: any) {
    data.status = 'update';
    this.refreshService.triggerRefresh(data);
  }
}
