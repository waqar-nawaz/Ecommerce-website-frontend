import { Component, inject, OnInit } from '@angular/core';
import { CardsComponent } from '../../components/cards/cards.component';
import { ProductServiceService } from '../../services/product.service.service';
import { ModalComponent } from '../../components/modal/modal.component';
import Swal from 'sweetalert2';
import { RefreshService } from '../../services/refresh-service.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, iif, of, switchMap } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import socketClient from 'socket.io-client';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CardsComponent,
    ModalComponent,
    CommonModule,
    LoaderComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit {
  data: any[] = [];
  products = inject(ProductServiceService);
  refreshService = inject(RefreshService);
  authService = inject(AuthService);
  sharedService = inject(SharedService);
  loader: boolean = false;
  search: FormControl = new FormControl();

  ngOnInit() {
    this.refreshService.getRefreshObservable().subscribe(() => {
      // this.getProduct();
    });
    this.getProduct();
    // socketClient('http://localhost:8080');

    this.search.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query) => {
          return this.products.searchProducts(query);
        })
      )
      .subscribe((data: any) => {
        this.data = data?.result;
      });
  }

  totalpages: any;
  getProduct() {
    this.loader = true;
    this.products.getProduct(1).subscribe(
      (data: any) => {
        this.data = data?.result;
        this.totalpages = data.totalPages;

        this.loader = false;
      },
      (err) => {
        this.loader = false;

        if (err.error.error == 'jwt expired') {
          this.authService.logout();
        }
      }
    );
  }

  receiveData(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.products.deleteProduct(data._id).subscribe(
          (res: any) => {
            console.log('delet images', res?.message);
            // this.maketoster();
            this.sharedService.maketoster({
              success: 'success',
              message: res?.message,
            });

            this.getProduct();
          },
          (err) => {
            console.log('error', err);
          }
        );
      }
    });
  }

  loading = false;
  onScroll(event: any) {
    console.log(event.target);
    const element = event.target;
    if (
      element.scrollHeight - element.scrollTop === element.clientHeight &&
      !this.loading
    ) {
      if (this.page <= this.totalpages) {
        this.loadMoreItems();
      }
    }
  }
  page: number = 2;

  loadMoreItems() {
    // this.loader = true;
    this.products.getProduct(this.page).subscribe(
      (data: any) => {
        setTimeout(() => {
          this.data = [...this.data, ...data?.result];
          // this.data = data?.result;
          this.loader = false;
          this.page++;
        }, 1000);
      },
      (err) => {
        // this.loader = false;

        if (err.error.error == 'jwt expired') {
          this.authService.logout();
        }
      }
    );
  }
}
