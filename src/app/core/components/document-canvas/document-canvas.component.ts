import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentNode } from '../../models/document-node.model';
import { WordComponent } from '../word/word';
import { TournamentStore } from '../../services/tournament.store';

@Component({
  selector: 'app-document-canvas',
  standalone: true,
  imports: [CommonModule, WordComponent],
  templateUrl: './document-canvas.component.html',
  styleUrl: './document-canvas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCanvasComponent {
  private tournamentStore = inject(TournamentStore);

  documentStructure = input.required<DocumentNode>();

  onWordClicked(word: string) {
    console.log('Word clicked:', word);
    this.tournamentStore.addWordToSelection(word);
  }

  onWordRightClicked(word: string) {
    console.log('Word right-clicked:', word);
    // Could be used for removing from selection or other actions
  }

  /**
   * Helper to get the style object from a DocumentNode for ngStyle binding
   */
  getStyles(node: DocumentNode): Record<string, string> | null {
    return node.styles || null;
  }

  /**
   * Helper to get the class string from a DocumentNode for ngClass binding
   */
  getClasses(node: DocumentNode): string | null {
    return node.classes ? node.classes.join(' ') : null;
  }
}
