import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestListComponent } from '../../shared/request-list/request-list.component';
import { AuthService } from '../../auth/auth.service';
import { RequestService } from '../../shared/request.service';
import { SocketService } from '../../shared/socket.service';
import { ToastrService } from 'ngx-toastr';
import { UserManagementComponent } from '../user-management/user-management.component';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RequestListComponent, UserManagementComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  requests: any[] = [];
  error: string | null = null;
  username: string | null = '';
  nama: string | null = '';
  sidebarCollapsed: boolean = false;
  activeMenu: string = 'dashboard';

  constructor(public auth: AuthService, private requestService: RequestService, private toastr: ToastrService, private socketService: SocketService) {}

  ngOnInit() {
    this.username = this.auth.getUsername();
    this.nama = this.auth.getName();
    this.loadRequests();

    // 🔌 Connect to socket
    const userId = localStorage.getItem('userId') || '';
    this.socketService.connect(userId, 'admin');

    // 🔔 Listen untuk notifikasi pengajuan baru
    this.socketService.onNewRequest().subscribe({
      next: (data) => {
        console.log('🔔 Admin received new request notification:', data);
        
        // Tampilkan toast notification
        this.toastr.info(data.message, 'Pengajuan Baru!', {
          timeOut: 5000,
          progressBar: true
        });

        // Refresh request list
        this.loadRequests();
        
        // Optional: Play notification sound
        this.playNotificationSound();
      },
      error: (err) => {
        console.error('❌ Error listening to new requests:', err);
      }
    });
  }

  ngOnDestroy() {
    // Disconnect socket saat component destroyed
    this.socketService.disconnect();
  }

  loadRequests() {
    this.requestService.getAllRequests().subscribe({
      next: (data) => {
        this.requests = data;
        console.log('✅ All requests loaded:', data);
      },
      error: (err) => {
        console.error('❌ Gagal memuat data:', err);
        this.toastr.error('Gagal memuat data pengajuan.');
      }
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
    // Auto-load data saat klik menu
    if (menu === 'requests' || menu === 'dashboard') {
      this.loadRequests();
    }
    // Close any open dropdowns (Bootstrap 5)
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('show');
    });
  }

  // Helper methods untuk count status
  getPendingCount(): number {
    return this.requests.filter(r => r.status === 'pending').length;
  }

  getApprovedCount(): number {
    return this.requests.filter(r => r.status === 'approved').length;
  }

  getRejectedCount(): number {
    return this.requests.filter(r => r.status === 'rejected').length;
  }

  logout() {
    this.auth.logout();
  }

  // Optional: Play notification sound
  playNotificationSound() {
    const audio = new Audio('assets/notification.mp3'); // Tambahkan file audio di folder assets
    audio.play().catch(err => console.log('Could not play sound:', err));
  }
}
