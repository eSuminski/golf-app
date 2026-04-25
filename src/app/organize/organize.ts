import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DocumentCanvasComponent } from '../core/components/document-canvas/document-canvas.component';
import { TournamentStore } from '../core/services/tournament.store';

@Component({
  selector: 'app-organize',
  standalone: true,
  imports: [DocumentCanvasComponent],
  templateUrl: './organize.html',
  styleUrl: './organize.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Organize {
  protected readonly tournamentStore = inject(TournamentStore);
}
