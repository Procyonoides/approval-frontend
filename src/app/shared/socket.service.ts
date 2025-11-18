import { Injectable } from '@angular/core';
import * as socketIO from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any = null;  // 👈 Gunakan any sementara
  private serverUrl = 'http://localhost:4000';

  constructor() {}

  connect(userId: string, role: string): void {
    if (this.socket?.connected) {
      console.log('✅ Socket already connected');
      return;
    }

    this.socket = (socketIO as any).io(this.serverUrl, {
      transports: ['websocket'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.socket?.emit('join', { userId, role });
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('❌ Socket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Socket disconnected manually');
    }
  }

  onNewRequest(): Observable<any> {
    return new Observable((observer) => {
      if (!this.socket) {
        observer.error('Socket not connected');
        return;
      }

      this.socket.on('newRequest', (data: any) => {
        console.log('🔔 New request received:', data);
        observer.next(data);
      });

      return () => {
        this.socket?.off('newRequest');
      };
    });
  }

  onRequestApproved(): Observable<any> {
    return new Observable((observer) => {
      if (!this.socket) {
        observer.error('Socket not connected');
        return;
      }

      this.socket.on('requestApproved', (data: any) => {
        console.log('🔔 Request approved:', data);
        observer.next(data);
      });

      return () => {
        this.socket?.off('requestApproved');
      };
    });
  }

  onRequestRejected(): Observable<any> {
    return new Observable((observer) => {
      if (!this.socket) {
        observer.error('Socket not connected');
        return;
      }

      this.socket.on('requestRejected', (data: any) => {
        console.log('🔔 Request rejected:', data);
        observer.next(data);
      });

      return () => {
        this.socket?.off('requestRejected');
      };
    });
  }
}