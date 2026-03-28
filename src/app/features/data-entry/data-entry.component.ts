import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-entry',
  imports: [FormsModule, CommonModule],
  templateUrl: './data-entry.component.html',
  styleUrl: './data-entry.component.css',
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
