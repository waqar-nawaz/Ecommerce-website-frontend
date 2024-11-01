import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  user: any;

  constructor() {
    // Check if window and localStorage are available
    if (typeof window !== 'undefined' && localStorage) {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
    } else {
      this.user = {}; // Default empty user object for server-side rendering
    }
  }

  maketoster(...res: any) {
    // debugger;
    Swal.fire({
      position: 'top-end',
      icon: res[0].success,
      title: res[0].message,
      showConfirmButton: false,
      timer: 2000,
    });
  }
}
