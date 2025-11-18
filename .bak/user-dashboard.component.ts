import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestFormComponent } from '../../shared/request-form/request-form.component';
import { RequestListComponent } from '../../shared/request-list/request-list.component';
import { EditRequestModalComponent } from '../../shared/edit-request-modal/edit-request-modal.component';
import { AuthService } from '../../auth/auth.service';
import { RequestService } from '../../shared/request.service';
import { ToastrService } from 'ngx-toastr';
import { UserProfileComponent } from '../user-profile/user-profile.component';


@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RequestFormComponent, RequestListComponent, EditRequestModalComponent, UserProfileComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  @ViewChild(EditRequestModalComponent) editModal!: EditRequestModalComponent;
  requests: any[] = [];
  error= '';
  username: string | null = '';
  sidebarCollapsed: boolean = false;
  activeMenu: string = 'dashboard';

  constructor(private auth: AuthService, private requestService: RequestService, private toastr: ToastrService) {}

  ngOnInit() {
    this.username = this.auth.getUsername();
    this.loadUserRequests();
  }

  loadUserRequests() {
    this.requestService.getUserRequests().subscribe({
      next: (data) => {
        this.requests = data;
        console.log('✅ User requests loaded:', data);
      },
      error: (err) => {
        console.error('❌ Gagal memuat pengajuan:', err);
        this.toastr.error('Gagal memuat pengajuan.');
      }
    });
  }

  // Method yang dipanggil setelah user buat request baru
  onRequestCreated() {
    console.log('✅ Request created/updated! Refreshing list...');
    this.loadUserRequests();
    this.setActiveMenu('my-requests');
  }

  // Handle edit request - OPEN MODAL (bukan pindah halaman)
onRequestEdit(request: any) {
  console.log('✏️ Opening modal for request:', request);
  if (this.editModal) {
    this.editModal.openModal(request);
  } else {
    console.error('❌ Edit modal not found!');
    this.toastr.error('Modal tidak tersedia. Silakan refresh halaman.');
  }
}

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // Dipanggil setelah update dari modal
  onModalRequestUpdated() {
    console.log('✅ Request updated from modal! Refreshing list...');
    this.loadUserRequests();
  }

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
    // Auto-load data saat klik menu tertentu
    if (menu === 'my-requests' || menu === 'dashboard') {
      this.loadUserRequests();
    }
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

  getTotalCount(): number {
    return this.requests.length;
  }

  logout() {
    this.auth.logout();
  }
}
