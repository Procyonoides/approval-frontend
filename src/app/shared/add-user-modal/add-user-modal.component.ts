import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.scss'
})
export class AddUserModalComponent {

  @Output() userAdded = new EventEmitter<void>();

  username: string = '';
  nama: string = '';
  bagian: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'user';
  isSubmitting: boolean = false;
  private modalInstance: any;

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  openModal() {
    console.log('📝 Opening add user modal');
    const modalElement = document.getElementById('addUserModal');
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
    // Validasi
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

    if (!this.password.trim()) {
      this.toastr.warning('Password harus diisi!');
      return;
    }

    if (this.password.length < 6) {
      this.toastr.warning('Password minimal 6 karakter!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.warning('Password tidak cocok!');
      return;
    }

    this.isSubmitting = true;

    const userData = {
      username: this.username,
      nama: this.nama,
      bagian: this.bagian,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.userService.createUser(userData).subscribe({
      next: (response) => {
        console.log('✅ User created:', response);
        this.toastr.success('User berhasil ditambahkan!');
        this.isSubmitting = false;
        this.closeModal();
        this.userAdded.emit();
      },
      error: (error) => {
        console.error('❌ Error creating user:', error);
        this.toastr.error(error.error?.message || 'Gagal menambahkan user.');
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    this.username = '';
    this.nama = '';
    this.bagian = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.role = 'user';
    this.isSubmitting = false;
  }

}
