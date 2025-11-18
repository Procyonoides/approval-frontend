import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../request.service';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any; // Bootstrap 5

@Component({
  selector: 'app-edit-request-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-request-modal.component.html',
  styleUrl: './edit-request-modal.component.scss'
})
export class EditRequestModalComponent {
  @Output() requestUpdated = new EventEmitter<void>();

  requestId: string = '';
  title: string = '';
  description: string = '';
  isSubmitting: boolean = false;
  private modalInstance: any;

  constructor(
    private requestService: RequestService,
    private toastr: ToastrService
  ) {}

  // Method untuk open modal dan populate data
  openModal(request: any) {
    console.log('📝 Opening edit modal for:', request);
    this.requestId = request._id;
    this.title = request.title;
    this.description = request.description;
    
    // Open Bootstrap modal
    const modalElement = document.getElementById('editRequestModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  // Method untuk close modal
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    // Reset form
    this.resetForm();
  }

  onSubmit() {
    if (!this.title.trim()) {
      this.toastr.warning('Judul pengajuan harus diisi!');
      return;
    }

    if (!this.description.trim()) {
      this.toastr.warning('Deskripsi pengajuan harus diisi!');
      return;
    }

    this.isSubmitting = true;

    const requestData = {
      title: this.title,
      description: this.description
    };

    this.requestService.updateRequest(this.requestId, requestData).subscribe({
      next: (response) => {
        console.log('✅ Request updated:', response);
        this.toastr.success('Pengajuan berhasil diupdate!');
        this.isSubmitting = false;
        this.closeModal();
        this.requestUpdated.emit(); // Emit untuk refresh list
      },
      error: (error) => {
        console.error('❌ Error updating request:', error);
        this.toastr.error(error.error?.message || 'Gagal mengupdate pengajuan.');
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    this.requestId = '';
    this.title = '';
    this.description = '';
    this.isSubmitting = false;
  }
}