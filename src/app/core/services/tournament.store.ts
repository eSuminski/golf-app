import { Injectable, signal } from '@angular/core';
import { Participant } from '../models/participant.model';
import { DocumentNode } from '../models/document-node.model';
import { WordModel } from '../models/word.model';

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

  // Track which word IDs belong to which participant (key: participantId, value: wordIds[])
  readonly participantWordIds = signal<Record<string, string[]>>({});

  // Words currently being selected from the document (the "buffer")
  readonly activeSelection = signal<WordModel[]>([]);

  // Set the parsed document structure
  setDocumentContent(structure: DocumentNode) {
    this.documentStructure.set(structure);
  }

  // Toggle a word in the selection buffer (for left-click)
  toggleWordInSelection(word: WordModel) {
    this.activeSelection.update(current => {
      const index = current.findIndex(w => w.id === word.id);
      if (index >= 0) {
        // Word is in buffer, remove it
        return current.filter(w => w.id !== word.id);
      } else {
        // Word is not in buffer, add it
        return [...current, word];
      }
    });
  }

  // Add a word to the selection if not already present (for right-click)
  addWordToSelection(word: WordModel) {
    this.activeSelection.update(current => {
      const exists = current.some(w => w.id === word.id);
      if (exists) {
        return current;
      }
      return [...current, word];
    });
  }

  // Clear the selection buffer
  clearSelection() {
    this.activeSelection.set([]);
  }

  // Commit the current selection as a new participant
  commitParticipant() {
    const words = this.activeSelection();
    if (words.length === 0) return;

    const id = crypto.randomUUID();
    
    // Extract text from words (skip whitespace)
    const textWords = words.filter(w => !w.isWhitespace).map(w => w.text);
    
    // First word is firstName, rest is lastName
    const firstName = textWords[0] || '';
    const lastName = textWords.slice(1).join(' ');
    
    const newParticipant: Participant = {
      id,
      firstName,
      lastName,
      isVerified: false
    };
    
    // Generate a random non-yellow color (avoid hue ~60 which is yellow)
    let hue = Math.floor(Math.random() * 360);
    if (hue >= 40 && hue <= 80) {
      hue = (hue + 100) % 360; // Shift away from yellow range
    }
    const randomColor = `hsl(${hue}, 70%, 80%)`;
    
    this.participants.update(current => [...current, newParticipant]);
    this.participantColors.update(current => ({ ...current, [id]: randomColor }));
    
    // Track word IDs for this participant
    const wordIds = words.map(w => w.id);
    this.participantWordIds.update(current => ({ ...current, [id]: wordIds }));
    
    this.clearSelection();
  }

  // Create a participant from a specific set of words (used for drag-select)
  createParticipantFromWords(words: WordModel[]) {
    if (words.length === 0) return;

    const id = crypto.randomUUID();
    
    // Extract text from words (skip whitespace)
    const textWords = words.filter(w => !w.isWhitespace).map(w => w.text);
    
    // First word is firstName, rest is lastName
    const firstName = textWords[0] || '';
    const lastName = textWords.slice(1).join(' ');
    
    const newParticipant: Participant = {
      id,
      firstName,
      lastName,
      isVerified: false
    };
    
    // Generate a random non-yellow color (avoid hue ~60 which is yellow)
    let hue = Math.floor(Math.random() * 360);
    if (hue >= 40 && hue <= 80) {
      hue = (hue + 100) % 360; // Shift away from yellow range
    }
    const randomColor = `hsl(${hue}, 70%, 80%)`;
    
    this.participants.update(current => [...current, newParticipant]);
    this.participantColors.update(current => ({ ...current, [id]: randomColor }));
    
    // Track word IDs for this participant
    const wordIds = words.map(w => w.id);
    this.participantWordIds.update(current => ({ ...current, [id]: wordIds }));
  }

  // Remove a participant
  removeParticipant(id: string) {
    this.participants.update(current => current.filter(p => p.id !== id));
    this.participantColors.update(current => {
      const newColors = { ...current };
      delete newColors[id];
      return newColors;
    });
    this.participantWordIds.update(current => {
      const newWordIds = { ...current };
      delete newWordIds[id];
      return newWordIds;
    });
  }

  // Check if a word is in the active selection buffer
  isWordInBuffer(wordId: string): boolean {
    return this.activeSelection().some(w => w.id === wordId);
  }

  // Get the participant ID that owns this word (if any)
  getParticipantForWord(wordId: string): string | null {
    const wordIdsMap = this.participantWordIds();
    for (const [participantId, wordIds] of Object.entries(wordIdsMap)) {
      if (wordIds.includes(wordId)) {
        return participantId;
      }
    }
    return null;
  }

  // Reset the entire store
  reset() {
    this.participants.set([]);
    this.activeSelection.set([]);
    this.documentStructure.set(null);
    this.participantColors.set({});
    this.participantWordIds.set({});
  }
}
