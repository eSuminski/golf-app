import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  uploadedFiles = signal<{ name: string; type: string }[]>([]);
}
