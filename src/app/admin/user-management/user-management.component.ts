import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { EditUserModalComponent } from '../../shared/edit-user-modal/edit-user-modal.component';
import { AddUserModalComponent } from '../../shared/add-user-modal/add-user-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, DataTablesModule, EditUserModalComponent, AddUserModalComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  @ViewChild(EditUserModalComponent) editModal!: EditUserModalComponent;
  @ViewChild(AddUserModalComponent) addModal!: AddUserModalComponent;
  
  users: any[] = [];
  dtOptions: any = {};

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadUsers();
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        search: 'Cari:',
        lengthMenu: 'Tampilkan _MENU_ data',
        info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data'
      }
    };
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('✅ Users loaded:', data);
      },
      error: (err) => {
        console.error('❌ Error loading users:', err);
        this.toastr.error('Gagal memuat data user');
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    return role === 'admin' ? 'badge bg-danger' : 'badge bg-primary';
  }

  // 🆕 Open add user modal
  addUser() {
    if (this.addModal) {
      this.addModal.openModal();
    } else {
      this.toastr.error('Modal tidak tersedia');
    }
  }

  editUser(user: any) {
    console.log('✏️ Edit user:', user);
    if (this.editModal) {
      this.editModal.openModal(user);
    } else {
      this.toastr.error('Modal tidak tersedia');
    }
  }

  deleteUser(userId: string, username: string) {
    if (confirm(`Apakah Anda yakin ingin menghapus user "${username}"?`)) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          console.log('✅ User deleted:', userId);
          this.toastr.success('User berhasil dihapus!');
          this.loadUsers();
        },
        error: (error) => {
          console.error('❌ Error deleting user:', error);
          this.toastr.error(error.error?.message || 'Gagal menghapus user');
        }
      });
    }
  }

  onUserUpdated() {
    console.log('✅ User updated! Refreshing list...');
    this.loadUsers();
  }

  //Handle user added
  onUserAdded() {
    console.log('✅ User added! Refreshing list...');
    this.loadUsers();
  }

}
