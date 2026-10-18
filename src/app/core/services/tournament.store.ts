import { Injectable, computed, signal } from '@angular/core';
import { Participant, SelectionEntry, Team } from '../models/participant.model';

/** Immutable snapshot of the Finalize-editable state (participants + teams). */
interface FinalizeSnapshot {
  participants: Participant[];
  teams: Team[];
}

@Injectable({
  providedIn: 'root',
})
export class TournamentStore {
  // Parsed HTML content from the uploaded document
  readonly documentHtml = signal<string>('');

  // Committed participants (survives navigation to preview/finalize)
  readonly participants = signal<Participant[]>([]);

  // Optional teams that participants can be assigned to
  readonly teams = signal<Team[]>([]);

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

  // --- Undo / reset machinery (Finalize edits) ---
  // LIFO stack of immutable snapshots taken before each mutation.
  private undoStack: FinalizeSnapshot[] = [];
  // State as it was when the user first landed on Finalize.
  private initialSnapshot: FinalizeSnapshot | null = null;

  readonly canUndo = computed(() => this.undoStack.length > 0);
  readonly hasEdits = computed(() => this.initialSnapshot !== null);

  // Set the parsed document HTML
  setDocumentContent(html: string) {
    this.documentHtml.set(html);
  }

  /**
   * Begins a Finalize session: captures the current participants + teams as the
   * baseline for hard reset, and clears any prior undo history. Call when the
   * user first lands on the Finalize screen.
   */
  beginFinalizeSession() {
    this.initialSnapshot = this.snapshot();
    this.undoStack = [];
  }

  /** Pushes the current state onto the undo stack (call before each mutation). */
  private snapshotBeforeMutation() {
    this.undoStack.push(this.snapshot());
  }

  /** Restores the most recent snapshot (undo). No-op when the stack is empty. */
  undo() {
    const previous = this.undoStack.pop();
    if (!previous) return;
    this.restore(previous);
  }

  /** Hard-resets to the state captured when the Finalize session began. */
  resetEdits() {
    if (!this.initialSnapshot) return;
    this.restore(this.initialSnapshot);
    this.undoStack = [];
  }

  private snapshot(): FinalizeSnapshot {
    return {
      participants: this.participants().map((p) => ({ ...p })),
      teams: this.teams().map((t) => ({ ...t })),
    };
  }

  private restore(snapshot: FinalizeSnapshot) {
    this.participants.set(snapshot.participants.map((p) => ({ ...p })));
    this.teams.set(snapshot.teams.map((t) => ({ ...t })));
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
    this.snapshotBeforeMutation();
    this.participants.update((current) => current.filter((p) => p.id !== id));
  }

  // --- Finalize mutations (each snapshots before mutating) ---

  /** Updates editable fields (e.g. first/last name) of a participant. */
  updateParticipant(id: string, fields: Partial<Pick<Participant, 'firstName' | 'lastName'>>) {
    this.snapshotBeforeMutation();
    this.participants.update((current) =>
      current.map((p) => (p.id === id ? { ...p, ...fields } : p)),
    );
  }

  /** Moves a participant from one index to another (row reorder). */
  reorderParticipants(fromIndex: number, toIndex: number) {
    this.snapshotBeforeMutation();
    this.participants.update((current) => {
      if (fromIndex < 0 || fromIndex >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      const clamped = Math.max(0, Math.min(toIndex, next.length));
      next.splice(clamped, 0, moved);
      return next;
    });
  }

  /** Assigns a participant to a team (or unassigns when teamId is null). */
  assignToTeam(participantId: string, teamId: string | null) {
    this.snapshotBeforeMutation();
    this.participants.update((current) =>
      current.map((p) => (p.id === participantId ? { ...p, teamId: teamId ?? undefined } : p)),
    );
  }

  /** Creates a new team and returns its id. */
  createTeam(name: string): string {
    this.snapshotBeforeMutation();
    const team: Team = { id: crypto.randomUUID(), name };
    this.teams.update((current) => [...current, team]);
    return team.id;
  }

  /** Renames a team. */
  renameTeam(id: string, name: string) {
    this.snapshotBeforeMutation();
    this.teams.update((current) => current.map((t) => (t.id === id ? { ...t, name } : t)));
  }

  /** Removes a team and unassigns its members. */
  removeTeam(id: string) {
    this.snapshotBeforeMutation();
    this.teams.update((current) => current.filter((t) => t.id !== id));
    this.participants.update((current) =>
      current.map((p) => (p.teamId === id ? { ...p, teamId: undefined } : p)),
    );
  }

  // Reset the entire store
  reset() {
    this.participants.set([]);
    this.teams.set([]);
    this.activeSelection.set([]);
    this.documentHtml.set('');
    this.undoStack = [];
    this.initialSnapshot = null;
  }
}
