import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  constructor() {
    this.connect();
  }

  private connect() {
    // initialize connection once when service is created
    this.socket = io(environment.domainPath);
  }

  // Listen for specific socket events
  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });

      // Cleanup when unsubscribed
      return () => {
        this.socket.off(eventName);
      };
    });
  }

  // Emit events if needed
  emit(eventName: string, data?: any) {
    this.socket.emit(eventName, data);
  }

  // Optional: disconnect socket when needed (e.g., on logout)
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
