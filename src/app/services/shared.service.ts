import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

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
