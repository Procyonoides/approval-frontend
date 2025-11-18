import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router, private toastr: ToastrService) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.toastr.warning('Masukkan username dan password!');
      return;
    }

    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        this.toastr.success('Login berhasil!');
        const role = res.role;
        if (res.role === 'admin') this.router.navigate(['/admin']);
        else this.router.navigate(['/user']);
      },
      error: (err: any) => {
        console.error('Login error:', err);
        this.error = err.error?.message || 'Username atau password salah.';
        this.toastr.error(this.error);
      }
    });
  }
}
