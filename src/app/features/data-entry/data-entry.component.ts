import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-entry',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="data-entry-container">
      <h1>Participant Data</h1>
      <p>Enter first and last names for each participant</p>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Raw Text</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            @for (participant of participants(); track $index) {
              <tr>
                <td class="raw-cell">{{ participant.rawText }}</td>
                <td>
                  <input type="text" [(ngModel)]="participant.firstName" placeholder="First Name" />
                </td>
                <td>
                  <input type="text" [(ngModel)]="participant.lastName" placeholder="Last Name" />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (validationErrors().length > 0) {
        <div class="validation-errors">
          <h3>Validation Errors</h3>
          <ul>
            @for (error of validationErrors(); track $index) {
              <li>{{ error.message }}</li>
            }
          </ul>
        </div>
      }

      <div class="actions">
        <button (click)="goToTeamAssignment()">Next: Team Assignment</button>
      </div>
    </div>
  `,
  styles: [
    `
      .data-entry-container {
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
      .table-container {
        overflow-x: auto;
        margin-bottom: 2rem;
      }
      .data-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }
      .data-table th,
      .data-table td {
        padding: 0.75rem;
        border: 1px solid var(--gray-300);
        text-align: left;
      }
      .data-table th {
        background-color: var(--gray-200);
        font-weight: 600;
      }
      .data-table td.raw-cell {
        max-width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .data-table input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--gray-300);
        border-radius: 4px;
        font-size: 1rem;
      }
      .data-table input:focus {
        outline: none;
        border-color: var(--primary-color);
      }
      .validation-errors {
        background-color: rgba(220, 53, 69, 0.1);
        border: 1px solid rgba(220, 53, 69, 0.3);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
      }
      .validation-errors h3 {
        margin-top: 0;
        color: #dc3545;
      }
      .validation-errors ul {
        margin: 0;
        padding-left: 1.5rem;
      }
      .validation-errors li {
        color: #dc3545;
      }
      .actions {
        text-align: center;
        margin-top: 2rem;
      }
      .actions button {
        padding: 0.75rem 2rem;
        font-size: 1rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .actions button:hover {
        background-color: var(--primary-color-dark);
      }
    `,
  ],
})
export class DataEntryComponent {
  participants = signal([
    { rawText: 'John Smith', firstName: '', lastName: '' },
    { rawText: 'Mary Johnson', firstName: '', lastName: '' },
    { rawText: 'Bob Williams', firstName: '', lastName: '' },
  ]);

  validationErrors = signal<{ message: string }[]>([]);

  goToTeamAssignment() {
    console.log('Navigate to team assignment');
  }
}
