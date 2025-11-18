import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = 'http://localhost:4000/api/requests';

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

  // Untuk Admin - melihat semua request
  getAllRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, this.getHeaders());
  }

  // Untuk User - melihat request miliknya sendiri
  getUserRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`, this.getHeaders());
  }

  // Menambahkan request baru
  createRequest(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data, this.getHeaders());
  }

  // Admin menyetujui request
  approveRequest(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/approve`, {}, this.getHeaders());
  }

  // Admin menolak request
  rejectRequest(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/reject`, {}, this.getHeaders());
  }

  // 🆕 User update request (hanya pending)
  updateRequest(id: string, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`, 
      data, 
      this.getHeaders()
    );
  }

  // 🆕 User delete request (hanya pending)
  deleteRequest(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`, 
      this.getHeaders()
    );
  }
}
