import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  template: `
    <div class="upload-container">
      <h1>Upload Tournament Documents</h1>
      <p>Drag and drop Word, Excel, CSV, or PDF files to extract participant data</p>

      <div class="drop-zone">Drag files here or click to select</div>

      @if (uploadedFiles().length > 0) {
        <div class="file-list">
          <h3>Uploaded Files</h3>
          <ul>
            @for (file of uploadedFiles(); track file.name) {
              <li>{{ file.name }} ({{ file.type }})</li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .upload-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
      h1 {
        text-align: center;
        margin-bottom: 0.5rem;
      }
      p {
        text-align: center;
        color: var(--gray-700);
        margin-bottom: 2rem;
      }
      .drop-zone {
        border: 2px dashed var(--gray-400);
        border-radius: 8px;
        padding: 3rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 2rem;
      }
      .drop-zone:hover {
        border-color: var(--primary-color);
        background-color: rgba(0, 0, 0, 0.05);
      }
      .file-list ul {
        list-style: none;
        padding: 0;
      }
      .file-list li {
        padding: 0.75rem;
        margin: 0.5rem 0;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      }
    `,
  ],
})
export class UploadComponent {
  uploadedFiles = signal<{ name: string; type: string }[]>([]);
}
