import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { ThemeService } from '../core/services/theme.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FileParserService } from '../core/services/file-parser.service';
import { TournamentStore } from '../core/services/tournament.store';
import { Router } from '@angular/router';
import { PhaseHeader } from '../core/components/phase-header/phase-header';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, PhaseHeader],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Upload {
  private themeService = inject(ThemeService);
  private fileParser = inject(FileParserService);
  private tournamentStore = inject(TournamentStore);
  private router = inject(Router);

  isParsing = signal(false);

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.pdf')) {
        this.themeService.setTheme('pdf');
        await this.parseAndNavigate(file, (f) => this.fileParser.convertPdfToHtml(f));
      } else if (
        fileName.endsWith('.xls') ||
        fileName.endsWith('.xlsx') ||
        fileName.endsWith('.csv')
      ) {
        this.themeService.setTheme('excel');
        await this.parseAndNavigate(file, (f) => this.fileParser.convertExcelToHtml(f));
      } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        this.themeService.setTheme('word');
        await this.parseAndNavigate(file, (f) => this.fileParser.convertDocxToHtml(f));
      } else {
        this.themeService.setTheme('none');
      }
    }
  }

  /**
   * Parses a file into HTML, stores it, then routes to the organize view.
   * Shared by the Word and Excel upload branches to avoid duplication.
   */
  private async parseAndNavigate(file: File, parser: (file: File) => Promise<string>) {
    this.isParsing.set(true);
    try {
      const html = await parser(file);
      this.tournamentStore.setDocumentContent(html);
      this.router.navigate(['/organize']);
    } catch (error) {
      console.error('Parsing failed', error);
      // In a real app, we'd show an error message to the user
    } finally {
      this.isParsing.set(false);
    }
  }
}
