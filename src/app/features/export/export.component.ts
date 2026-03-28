import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-export',
  imports: [CommonModule],
  template: `
    <div class="export-container">
      <h1>Export</h1>
      <p>Export your team assignments to CSV</p>

      <div class="preview-container">
        <h3>CSV Preview</h3>
        <table class="preview-table">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            @for (row of exportData(); track $index) {
              <tr>
                <td>{{ row.teamName }}</td>
                <td>{{ row.firstName }}</td>
                <td>{{ row.lastName }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="actions">
        <button (click)="exportCSV()">Download CSV</button>
        <button (click)="goToUpload()">Back to Upload</button>
      </div>
    </div>
  `,
  styles: [
    `
      .export-container {
        max-width: 1000px;
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
      .preview-container {
        background-color: var(--white);
        border: 1px solid var(--gray-300);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 2rem;
      }
      .preview-container h3 {
        margin-top: 0;
        margin-bottom: 1rem;
      }
      .preview-table {
        width: 100%;
        border-collapse: collapse;
      }
      .preview-table th,
      .preview-table td {
        padding: 0.75rem;
        border: 1px solid var(--gray-300);
        text-align: left;
      }
      .preview-table th {
        background-color: var(--gray-200);
        font-weight: 600;
      }
      .actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
      }
      .actions button {
        padding: 0.75rem 2rem;
        font-size: 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .actions button:first-child {
        background-color: var(--primary-color);
        color: white;
      }
      .actions button:last-child {
        background-color: var(--gray-400);
        color: white;
      }
      .actions button:hover {
        opacity: 0.9;
      }
    `,
  ],
})
export class ExportComponent {
  exportData = signal([
    { teamName: 'Team 1', firstName: 'John', lastName: 'Smith' },
    { teamName: 'Team 1', firstName: 'Mary', lastName: 'Johnson' },
    { teamName: 'Team 2', firstName: 'Bob', lastName: 'Williams' },
  ]);

  exportCSV() {
    console.log('Export CSV');
  }

  goToUpload() {
    console.log('Navigate to upload');
  }
}
