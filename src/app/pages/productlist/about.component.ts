import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CardsComponent } from '../../components/cards/cards.component';
import { ProductServiceService } from '../../services/product.service.service';
import { ModalComponent } from '../../components/modal/modal.component';
import Swal from 'sweetalert2';
import { RefreshService } from '../../services/refresh-service.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-about',
  imports: [
    CardsComponent,
    ModalComponent,
    CommonModule,
    LoaderComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy {
  data: any[] = [];
  loader = false;
  totalpages: any;
  page = 2;
  loading = false;
  search = new FormControl();

  private products = inject(ProductServiceService);
  private refreshService = inject(RefreshService);
  private authService = inject(AuthService);
  private sharedService = inject(SharedService);
  private socketService = inject(SocketService);

  ngOnInit() {
    // Handle refresh logic
    debugger
    this.refreshService.getRefreshObservable().subscribe((data: any) => {
      if (data?.status !== 'update') {
        this.data = this.data.filter((val: any) => val._id != data.result._id);
        this.data.push(data?.result);
      }
    });

    this.getProduct();

    this.getSocketData();

    // Search handler
    this.search.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query) => this.products.searchPost(query))
      )
      .subscribe((data: any) => {
        this.data = data?.result;
      });
  }

  getSocketData() {
    // 👇 Listen to socket updates
    this.socketService.listen('posts').subscribe((socketData: any) => {
      if (socketData.action === 'create') {
        this.data.push(socketData.result);
      }

      if (socketData.action === 'delete') {
        this.data = this.data.filter(
          (val: any) => val._id !== socketData.result._id
        );
      }

      if (socketData.action === 'update') {
        this.data = this.data.map((val: any) =>
          val._id === socketData.result._id ? socketData.result : val
        );
      }
    });
  }

  getProduct() {
    this.data = [];
    this.loader = true;
    this.products.getPost(1).subscribe(
      (data: any) => {
        this.data = data?.result;
        this.totalpages = data.totalPages;
        this.loader = false;
      },
      () => (this.loader = false)
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
        this.products.deletePost(data._id).subscribe(
          (res: any) => {
            this.data = this.data.filter((val) => val._id != data._id);
            this.sharedService.maketoster({
              success: 'success',
              message: res?.message,
            });
          },
          (err) => console.log('error', err)
        );
      }
    });
  }

  onScroll(event: any) {
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

  loadMoreItems() {
    this.products.getProduct(this.page).subscribe(
      (data: any) => {
        setTimeout(() => {
          this.data = [...this.data, ...data?.result];
          this.page++;
        }, 1000);
      },
      (err) => console.error(err)
    );
  }

  ngOnDestroy() {
    // Optionally disconnect socket when leaving component
    this.socketService.disconnect();
  }
}
