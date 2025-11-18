import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.scss'
})
export class EditUserModalComponent {
  @Output() userUpdated = new EventEmitter<void>();

  userId: string = '';
  username: string = '';
  nama: string = '';
  bagian: string = '';
  email: string = '';
  role: string = 'user';
  password: string = '';
  isSubmitting: boolean = false;
  private modalInstance: any;

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  openModal(user: any) {
    console.log('📝 Opening edit user modal for:', user);
    this.userId = user._id;
    this.username = user.username;
    this.nama = user.nama;
    this.bagian = user.bagian;
    this.email = user.email;
    this.role = user.role;
    this.password = ''; // Always empty for security
    
    const modalElement = document.getElementById('editUserModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.resetForm();
  }

  onSubmit() {
    if (!this.username.trim()) {
      this.toastr.warning('Username harus diisi!');
      return;
    }

    if (!this.nama.trim()) {
      this.toastr.warning('Nama harus diisi!');
      return;
    }

    if (!this.bagian.trim()) {
      this.toastr.warning('Bagian harus diisi!');
      return;
    }

    if (!this.email.trim()) {
      this.toastr.warning('Email harus diisi!');
      return;
    }

    this.isSubmitting = true;

    const userData: any = {
      username: this.username,
      nama: this.nama,
      bagian: this.bagian,
      email: this.email,
      role: this.role
    };

    // Hanya kirim password jika diisi
    if (this.password.trim()) {
      if (this.password.length < 6) {
        this.toastr.warning('Password minimal 6 karakter!');
        this.isSubmitting = false;
        return;
      }
      userData.password = this.password;
    }

    this.userService.updateUser(this.userId, userData).subscribe({
      next: (response) => {
        console.log('✅ User updated:', response);
        this.toastr.success('User berhasil diupdate!');
        this.isSubmitting = false;
        this.closeModal();
        this.userUpdated.emit();
      },
      error: (error) => {
        console.error('❌ Error updating user:', error);
        this.toastr.error(error.error?.message || 'Gagal mengupdate user.');
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    this.userId = '';
    this.username = '';
    this.nama = '';
    this.bagian = '';
    this.email = '';
    this.role = 'user';
    this.password = '';
    this.isSubmitting = false;
  }
}
