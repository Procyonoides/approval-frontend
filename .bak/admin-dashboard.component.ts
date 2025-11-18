import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestListComponent } from '../../shared/request-list/request-list.component';
import { AuthService } from '../../auth/auth.service';
import { RequestService } from '../../shared/request.service';
import { ToastrService } from 'ngx-toastr';
import { UserManagementComponent } from '../user-management/user-management.component';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RequestListComponent, UserManagementComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  requests: any[] = [];
  error: string | null = null;
  username: string | null = '';
  name: string | null = '';
  sidebarCollapsed: boolean = false;
  activeMenu: string = 'dashboard';

  constructor(public auth: AuthService, private requestService: RequestService, private toastr: ToastrService) {}

  ngOnInit() {
    this.username = this.auth.getUsername();
    this.name = this.auth.getName();
    this.loadRequests();
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
}
