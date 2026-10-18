import { Injectable, computed, signal } from '@angular/core';
import { Participant, SelectionEntry } from '../models/participant.model';

@Injectable({
  providedIn: 'root',
})
export class TournamentStore {
  // Parsed HTML content from the uploaded document
  readonly documentHtml = signal<string>('');

  // Committed participants (survives navigation to preview/finalize)
  readonly participants = signal<Participant[]>([]);

  // Words selected while building a record, in click order. The first entry
  // always carries the `first` role; the rest are `last`. Deselecting the
  // first-name word promotes the earliest remaining selection to `first`.
  readonly activeSelection = signal<SelectionEntry[]>([]);

  // Current first name being built (for preview feedback)
  readonly currentFirstName = computed(
    () => this.activeSelection().find((e) => e.role === 'first')?.text ?? '',
  );

  // Current last name being built, last-name words joined in click order
  readonly currentLastName = computed(() =>
    this.activeSelection()
      .filter((e) => e.role === 'last')
      .map((e) => e.text)
      .join(' '),
  );

  readonly hasSelection = computed(() => this.activeSelection().length > 0);

  // Set of selected token ids, for deriving span highlight classes
  readonly selectedTokenIds = computed(() => new Set(this.activeSelection().map((e) => e.tokenId)));

  // Set the parsed document HTML
  setDocumentContent(html: string) {
    this.documentHtml.set(html);
  }

  /**
   * Toggles a word in/out of the current selection.
   * Selecting: the first word becomes `first`; every subsequent word appends as
   * `last`. Deselecting removes the word; if the removed word was the first
   * name and selections remain, the earliest (click-order) remaining entry is
   * promoted to `first`.
   */
  toggleWord(tokenId: string, text: string) {
    this.activeSelection.update((current) => {
      const existing = current.find((e) => e.tokenId === tokenId);

      // Deselect
      if (existing) {
        let remaining = current.filter((e) => e.tokenId !== tokenId);
        if (existing.role === 'first' && remaining.length > 0) {
          remaining = remaining.map((e, i) => (i === 0 ? { ...e, role: 'first' as const } : e));
        }
        return remaining;
      }

      // Select
      const role = current.length === 0 ? 'first' : 'last';
      return [...current, { tokenId, text, role }];
    });
  }

  // Clear the current selection buffer
  clearSelection() {
    this.activeSelection.set([]);
  }

  /**
   * Commits the current selection as a new participant. First name comes from
   * the `first`-role entry; last name from remaining `last` entries (click
   * order). The source line for the record is recorded if provided. Clears the
   * selection. No-op when nothing is selected.
   */
  commitParticipant(sourceLine?: string) {
    const selection = this.activeSelection();
    if (selection.length === 0) return;

    const first = selection.find((e) => e.role === 'first');
    const last = selection
      .filter((e) => e.role === 'last')
      .map((e) => e.text)
      .join(' ');

    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      firstName: first?.text ?? '',
      ...(last ? { lastName: last } : {}),
      ...(sourceLine ? { sourceLine } : {}),
      isVerified: false,
    };

    this.participants.update((current) => [...current, newParticipant]);
    this.clearSelection();
  }

  // Remove a participant
  removeParticipant(id: string) {
    this.participants.update((current) => current.filter((p) => p.id !== id));
  }

  // Reset the entire store
  reset() {
    this.participants.set([]);
    this.activeSelection.set([]);
    this.documentHtml.set('');
  }
}
