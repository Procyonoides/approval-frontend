import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from '../request.service';
import { ToastrService } from 'ngx-toastr';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, DataTablesModule],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent implements OnInit {
  @Input() requests: any[] = [];
  @Input() role: string = '';
  @Output() requestUpdated = new EventEmitter<void>();
  @Output() requestEdit = new EventEmitter<any>();
  dtOptions: any = {};

  constructor(
    private requestService: RequestService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      language: {
        search: 'Cari:',
        lengthMenu: 'Tampilkan _MENU_ data',
        info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data'
      }
    };
  }

  // Method untuk return full class badge (dengan rounded-pill)
  getStatusBadgeClass(status: string): string {
    const baseClass = 'badge rounded-pill';
    switch(status) {
      case 'approved': return `${baseClass} bg-success text-white`;
      case 'rejected': return `${baseClass} bg-danger text-white`;
      case 'pending': return `${baseClass} bg-warning text-dark`;
      default: return `${baseClass} bg-secondary text-white`;
    }
  }

  // Method untuk return icon class
  getStatusIcon(status: string): string {
    switch(status) {
      case 'approved': return 'bi-check2-circle';
      case 'rejected': return 'bi-x-circle';
      case 'pending': return 'bi-hourglass-split';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'approved': return ' Disetujui';
      case 'rejected': return ' Ditolak';
      case 'pending': return ' Menunggu';
      default: return status;
    }
  }

  approveRequest(id: string) {
    if (confirm('Apakah Anda yakin ingin menyetujui pengajuan ini?')) {
      this.requestService.approveRequest(id).subscribe({
        next: () => {
          this.toastr.success('Pengajuan berhasil disetujui!');
          this.requestUpdated.emit();
        },
        error: (error) => {
          console.error('Error approving request:', error);
          this.toastr.error('Gagal menyetujui pengajuan.');
        }
      });
    }
  }

  rejectRequest(id: string) {
    if (confirm('Apakah Anda yakin ingin menolak pengajuan ini?')) {
      this.requestService.rejectRequest(id).subscribe({
        next: () => {
          this.toastr.success('Pengajuan berhasil ditolak!');
          this.requestUpdated.emit();
        },
        error: (error) => {
          console.error('Error rejecting request:', error);
          this.toastr.error('Gagal menolak pengajuan.');
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 🆕 Edit request (untuk user)
  editRequest(request: any) {
    // Emit event dengan data request untuk di-edit
    console.log('✏️ Edit request clicked:', request);
    this.requestEdit.emit(request);
  }

  // 🆕 Delete request (untuk user)
  deleteRequest(id: string) {
    if (confirm('Apakah Anda yakin ingin menghapus pengajuan ini?')) {
      this.requestService.deleteRequest(id).subscribe({
        next: () => {
          console.log('✅ Request deleted:', id);
          this.toastr.success('Pengajuan berhasil dihapus!');
          this.requestUpdated.emit();
        },
        error: (error) => {
          console.error('❌ Error deleting request:', error);
          this.toastr.error(error.error?.message || 'Gagal menghapus pengajuan.');
        }
      });
    }
  }

}
