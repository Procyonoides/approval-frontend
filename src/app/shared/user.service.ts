import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4000/api/users';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // 🔹 Get current user profile
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, this.getHeaders());
  }

  // 🔹 Update user profile
  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, data, this.getHeaders());
  }

  // 🔹 Admin: Get all users
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  // 🔹 Admin: Get user by ID
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  // 🔹 Admin: Update user
  updateUser(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, this.getHeaders());
  }

  // 🔹 Admin: Delete user
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  // 🆕 Admin: Create new user
  createUser(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data, this.getHeaders());
  }
}