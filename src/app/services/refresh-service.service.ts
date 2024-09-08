import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshService {
  private refreshSubject = new Subject<void>();

  getRefreshObservable() {
    return this.refreshSubject.asObservable();
  }

  triggerRefresh(data: any) {
    this.refreshSubject.next(data);
  }
}
