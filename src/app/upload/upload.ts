import { Component, inject } from '@angular/core';
import { ThemeService } from '../core/services/theme.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload {
  private themeService = inject(ThemeService);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.pdf')) {
        this.themeService.setTheme('pdf');
      } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || fileName.endsWith('.csv')) {
        this.themeService.setTheme('excel');
      } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        this.themeService.setTheme('word');
      } else {
        this.themeService.setTheme('none');
      }
    }
  }
}
