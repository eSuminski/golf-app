import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentNode } from '../../models/document-node.model';
import { WordModel } from '../../models/word.model';
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

  onWordClicked(word: WordModel) {
    this.tournamentStore.toggleWordInSelection(word);
  }

  onWordRightClicked(word: WordModel) {
    this.tournamentStore.addWordToSelection(word);
    this.tournamentStore.commitParticipant();
  }

  /**
   * Determine the state of a word for highlighting
   */
  getWordState(word: WordModel): 'none' | 'buffer' | 'selected' {
    if (this.tournamentStore.isWordInBuffer(word.id)) {
      return 'buffer';
    }
    if (this.tournamentStore.getParticipantForWord(word.id)) {
      return 'selected';
    }
    return 'none';
  }

  /**
   * Get the color for a word if it belongs to a participant
   */
  getWordColor(word: WordModel): string | null {
    const participantId = this.tournamentStore.getParticipantForWord(word.id);
    if (participantId) {
      return this.tournamentStore.participantColors()[participantId] || null;
    }
    return null;
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
