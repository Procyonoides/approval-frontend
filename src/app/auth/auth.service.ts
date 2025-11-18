import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('username', res.username);
        localStorage.setItem('nama', res.nama);
        localStorage.setItem('userId', res.userId);
      })
    );
  }

  getUserRole() {
    return localStorage.getItem('role');
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  getName(){
    return localStorage.getItem('nama');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
