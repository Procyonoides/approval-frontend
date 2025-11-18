import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.scss'
})
export class AdminProfileComponent implements OnInit {

  user: any = {};
  isSubmitting: boolean = false;
  showPasswordFields: boolean = false;

  // Form fields
  nama: string = '';
  bagian: string = '';
  email: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.nama = data.nama;
        this.bagian = data.bagian;
        this.email = data.email;
        console.log('✅ Admin profile loaded:', data);
      },
      error: (err) => {
        console.error('❌ Error loading profile:', err);
        this.toastr.error('Gagal memuat data profile');
      }
    });
  }

  togglePasswordFields() {
    this.showPasswordFields = !this.showPasswordFields;
    if (!this.showPasswordFields) {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }

  onSubmit() {
    // Validasi
    if (!this.nama.trim()) {
      this.toastr.warning('Nama harus diisi');
      return;
    }

    if (!this.bagian.trim()) {
      this.toastr.warning('Bagian harus diisi');
      return;
    }

    if (!this.email.trim()) {
      this.toastr.warning('Email harus diisi');
      return;
    }

    // Validasi password jika diubah
    if (this.showPasswordFields) {
      if (!this.currentPassword) {
        this.toastr.warning('Password lama harus diisi');
        return;
      }
      if (!this.newPassword) {
        this.toastr.warning('Password baru harus diisi');
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.toastr.warning('Password baru tidak cocok');
        return;
      }
      if (this.newPassword.length < 6) {
        this.toastr.warning('Password minimal 6 karakter');
        return;
      }
    }

    this.isSubmitting = true;

    const updateData: any = {
      nama: this.nama,
      bagian: this.bagian,
      email: this.email
    };

    // Tambah password jika diubah
    if (this.showPasswordFields) {
      updateData.currentPassword = this.currentPassword;
      updateData.password = this.newPassword;
    }

    this.userService.updateProfile(updateData).subscribe({
      next: (response) => {
        console.log('✅ Profile updated:', response);
        this.toastr.success('Profile berhasil diupdate!');
        
        // Update localStorage jika nama berubah
        if (response.user && response.user.nama) {
          localStorage.setItem('nama', response.user.nama);
        }
        
        this.isSubmitting = false;
        this.showPasswordFields = false;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.loadProfile();
      },
      error: (error) => {
        console.error('❌ Error updating profile:', error);
        this.toastr.error(error.error?.message || 'Gagal update profile');
        this.isSubmitting = false;
      }
    });
  }

  onReset() {
    this.loadProfile();
    this.showPasswordFields = false;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

}
