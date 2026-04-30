import { Component, inject, input, signal, computed, ChangeDetectionStrategy, ElementRef } from '@angular/core';
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
  private elementRef = inject(ElementRef);

  documentStructure = input.required<DocumentNode>();

  // Drag selection state
  readonly isDragging = signal(false);
  readonly dragStart = signal<{ x: number; y: number } | null>(null);
  readonly dragCurrent = signal<{ x: number; y: number } | null>(null);
  
  // Computed selection box dimensions
  readonly selectionBox = computed(() => {
    const start = this.dragStart();
    const current = this.dragCurrent();
    
    if (!start || !current) return null;
    
    return {
      left: Math.min(start.x, current.x),
      top: Math.min(start.y, current.y),
      width: Math.abs(current.x - start.x),
      height: Math.abs(current.y - start.y)
    };
  });

  private mouseMoveThrottle: number | null = null;
  private boundMouseMove = this.onMouseMove.bind(this);
  private boundMouseUp = this.onMouseUp.bind(this);

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

  /**
   * Start drag selection on Ctrl+Click
   */
  onCanvasMouseDown(event: MouseEvent) {
    // Only start drag selection if Ctrl key is pressed
    if (!event.ctrlKey) return;
    
    event.preventDefault();
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.isDragging.set(true);
    this.dragStart.set({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top + (event.currentTarget as HTMLElement).scrollTop
    });
    this.dragCurrent.set(this.dragStart());
    
    // Add global listeners
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  /**
   * Update drag selection box (throttled)
   */
  private onMouseMove(event: MouseEvent) {
    if (!this.isDragging()) return;
    
    // Throttle to ~60fps
    if (this.mouseMoveThrottle) return;
    
    this.mouseMoveThrottle = window.setTimeout(() => {
      this.mouseMoveThrottle = null;
      
      const container = this.elementRef.nativeElement.querySelector('.canvas-container');
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      this.dragCurrent.set({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top + container.scrollTop
      });
    }, 16); // ~60fps
  }

  /**
   * Finalize drag selection
   */
  private onMouseUp(event: MouseEvent) {
    if (!this.isDragging()) return;
    
    const box = this.selectionBox();
    if (box) {
      this.selectWordsInBox(box);
    }
    
    // Clean up
    this.isDragging.set(false);
    this.dragStart.set(null);
    this.dragCurrent.set(null);
    
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
    
    if (this.mouseMoveThrottle) {
      clearTimeout(this.mouseMoveThrottle);
      this.mouseMoveThrottle = null;
    }
  }

  /**
   * Select all words that intersect with the selection box, group by row, and create participants
   */
  private selectWordsInBox(box: { left: number; top: number; width: number; height: number }) {
    const container = this.elementRef.nativeElement.querySelector('.canvas-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    
    // Collect all words from document structure with their IDs
    const allWords = this.collectAllWords(this.documentStructure());
    const wordMap = new Map(allWords.map(w => [w.id, w]));
    
    // Find all word elements and their positions
    const wordElements = container.querySelectorAll('[data-word-id]');
    const wordsWithPositions: Array<{ word: WordModel; y: number; x: number }> = [];
    
    wordElements.forEach((element: Element) => {
      const wordId = element.getAttribute('data-word-id');
      if (!wordId) return;
      
      const word = wordMap.get(wordId);
      if (!word || word.isWhitespace) return;
      
      const rect = element.getBoundingClientRect();
      const relativeTop = rect.top - containerRect.top + scrollTop;
      const relativeBottom = rect.bottom - containerRect.top + scrollTop;
      const relativeLeft = rect.left - containerRect.left;
      const relativeRight = rect.right - containerRect.left;
      
      // Check if word intersects with selection box
      const intersects = !(
        relativeRight < box.left ||
        relativeLeft > box.left + box.width ||
        relativeBottom < box.top ||
        relativeTop > box.top + box.height
      );
      
      if (intersects) {
        const wordCenterY = (relativeTop + relativeBottom) / 2;
        wordsWithPositions.push({ 
          word, 
          y: wordCenterY,
          x: relativeLeft
        });
      }
    });
    
    // Group words by row (Y position with threshold)
    const rowThreshold = 10; // pixels tolerance for "same row"
    const rowGroups: WordModel[][] = [];
    
    // Sort by Y position first, then by X position
    wordsWithPositions.sort((a, b) => {
      if (Math.abs(a.y - b.y) <= rowThreshold) {
        return a.x - b.x; // Same row, sort by X (left to right)
      }
      return a.y - b.y; // Different rows, sort by Y (top to bottom)
    });
    
    // Group words that are on the same row
    for (const item of wordsWithPositions) {
      let addedToGroup = false;
      
      for (const group of rowGroups) {
        // Check if this word belongs to an existing row group
        const firstWordInGroup = wordsWithPositions.find(w => w.word.id === group[0].id);
        if (firstWordInGroup && Math.abs(item.y - firstWordInGroup.y) <= rowThreshold) {
          group.push(item.word);
          addedToGroup = true;
          break;
        }
      }
      
      if (!addedToGroup) {
        rowGroups.push([item.word]);
      }
    }
    
    // Create a participant for each row group
    rowGroups.forEach(group => {
      if (group.length > 0) {
        this.tournamentStore.createParticipantFromWords(group);
      }
    });
  }

  /**
   * Recursively collect all words from the document structure
   */
  private collectAllWords(node: DocumentNode): WordModel[] {
    const words: WordModel[] = [];
    
    if (node.type === 'word' && node.word) {
      words.push(node.word);
    } else if (node.type === 'container' && node.children) {
      for (const child of node.children) {
        words.push(...this.collectAllWords(child));
      }
    }
    
    return words;
  }
}
