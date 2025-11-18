import { Component, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../request.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './request-form.component.html',
  styleUrl: './request-form.component.scss'
})
export class RequestFormComponent {
  @Output() requestCreated = new EventEmitter<void>();

  title: string = '';
  description: string = '';
  isSubmitting: boolean = false;

  constructor(
    private requestService: RequestService,
    private toastr: ToastrService
  ) {}

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
    this.requestService.createRequest(requestData).subscribe({
      next: (response) => {
        console.log('✅ Request created:', response);
        this.toastr.success('Pengajuan berhasil dibuat!');
        this.title = '';
        this.description = '';
        this.isSubmitting = false;
        this.requestCreated.emit();
      },
      error: (error) => {
        console.error('❌ Error creating request:', error);
        this.toastr.error('Gagal membuat pengajuan. Silakan coba lagi.');
        this.isSubmitting = false;
      }
    });
  }

  onReset() {
    this.title = '';
    this.description = '';
  }

}
