import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-export',
  imports: [CommonModule],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css',
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
