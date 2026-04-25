import { Component, inject, input, effect, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TournamentStore } from '../../services/tournament.store';

@Component({
  selector: 'app-document-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-canvas.component.html',
  styleUrl: './document-canvas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCanvasComponent {
  private sanitizer = inject(DomSanitizer);
  private tournamentStore = inject(TournamentStore);

  htmlContent = input.required<string>();
  safeHtml = signal<SafeHtml>('');

  constructor() {
    effect(() => {
      const rawHtml = this.htmlContent();
      this.safeHtml.set(this.sanitizer.bypassSecurityTrustHtml(rawHtml));
    });
  }

  onCanvasClick(event: MouseEvent) {
    console.log('Canvas clicked', event.target);
  }

  onCanvasRightClick(event: MouseEvent) {
    event.preventDefault();
    console.log('Canvas right-clicked', event.target);
  }
}
