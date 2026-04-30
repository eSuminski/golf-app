import { Injectable, signal } from '@angular/core';
import { Participant } from '../models/participant.model';
import { DocumentNode } from '../models/document-node.model';

@Injectable({
  providedIn: 'root'
})
export class TournamentStore {
  // Parsed document structure from the uploaded document
  readonly documentStructure = signal<DocumentNode | null>(null);

  // Finalized list of participants
  readonly participants = signal<Participant[]>([]);

  // Track colors for participants (key: participantId, value: color)
  readonly participantColors = signal<Record<string, string>>({});

  // Words currently being selected from the document (the "buffer")
  readonly activeSelection = signal<string[]>([]);

  // Set the parsed document structure
  setDocumentContent(structure: DocumentNode) {
    this.documentStructure.set(structure);
  }

  // Helper to add a word to the current selection
  addWordToSelection(word: string) {
    this.activeSelection.update(current => [...current, word]);
  }

  // Clear the selection buffer
  clearSelection() {
    this.activeSelection.set([]);
  }

  // Commit the current selection as a new participant (single unit)
  commitParticipant(fullName: string) {
    const id = crypto.randomUUID();
    const newParticipant: Participant = {
      id,
      firstName: fullName, // Using fullName as firstName for now to support multi-word units
      lastName: '',
      isVerified: false
    };
    
    // Generate a random non-green/yellow color
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
    
    this.participants.update(current => [...current, newParticipant]);
    this.participantColors.update(current => ({ ...current, [id]: randomColor }));
    this.clearSelection();
  }

  // Remove a participant
  removeParticipant(id: string) {
    this.participants.update(current => current.filter(p => p.id !== id));
    this.participantColors.update(current => {
      const newColors = { ...current };
      delete newColors[id];
      return newColors;
    });
  }

  // Reset the entire store
  reset() {
    this.participants.set([]);
    this.activeSelection.set([]);
    this.documentStructure.set(null);
    this.participantColors.set({});
  }
}
