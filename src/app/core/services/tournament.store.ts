import { Injectable, signal } from '@angular/core';
import { Participant } from '../models/participant.model';

@Injectable({
  providedIn: 'root'
})
export class TournamentStore {
  // Parsed HTML content from the uploaded document
  readonly documentHtml = signal<string>('');

  // Finalized list of participants
  readonly participants = signal<Participant[]>([]);

  // Words currently being selected from the document (the "buffer")
  readonly activeSelection = signal<string[]>([]);

  // Set the parsed document HTML
  setDocumentContent(html: string) {
    this.documentHtml.set(html);
  }

  // Helper to add a word to the current selection
  addWordToSelection(word: string) {
    this.activeSelection.update(current => [...current, word]);
  }

  // Clear the selection buffer
  clearSelection() {
    this.activeSelection.set([]);
  }

  // Commit the current selection as a new participant
  commitParticipant(firstName: string, lastName: string) {
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      isVerified: false
    };
    
    this.participants.update(current => [...current, newParticipant]);
    this.clearSelection();
  }

  // Remove a participant
  removeParticipant(id: string) {
    this.participants.update(current => current.filter(p => p.id !== id));
  }

  // Reset the entire store
  reset() {
    this.participants.set([]);
    this.activeSelection.set([]);
    this.documentHtml.set('');
  }
}
