import { Component, ChangeDetectionStrategy, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TournamentStore } from '../core/services/tournament.store';

interface NameDraft {
  first: string;
  last: string;
}

@Component({
  selector: 'app-finalize',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finalize.html',
  styleUrl: './finalize.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Finalize {
  protected readonly tournamentStore = inject(TournamentStore);
  private router = inject(Router);

  // Index of the row currently being dragged (for drop highlighting).
  protected readonly dragIndex = signal<number | null>(null);

  // In-progress name edits, keyed by participant id. Seeded from the store in
  // an effect (NOT during template evaluation — writing a signal there throws
  // NG0600 and leaves inputs empty). The store is only mutated on commit.
  protected readonly drafts = signal<Record<string, NameDraft>>({});

  constructor() {
    // Capture the baseline for undo/reset when the user first lands here.
    this.tournamentStore.beginFinalizeSession();

    // Seed a draft for each participant the first time we see it, so the
    // template can bind to drafts() with no side effects. Only writes when a
    // new participant appears — unconditionally setting a new object here would
    // re-trigger the effect (drafts() is tracked), causing an infinite loop.
    effect(() => {
      const participants = this.tournamentStore.participants();
      let changed = false;
      const current = this.drafts();
      const next = { ...current };
      for (const p of participants) {
        if (!next[p.id]) {
          next[p.id] = { first: p.firstName, last: p.lastName ?? '' };
          changed = true;
        }
      }
      if (changed) {
        this.drafts.set(next);
      }
    });
  }

  protected updateDraft(id: string, field: 'first' | 'last', value: string) {
    const current = this.drafts();
    const existing = current[id] ?? { first: '', last: '' };
    this.drafts.set({ ...current, [id]: { ...existing, [field]: value } });
  }

  protected onNameInput(id: string, field: 'first' | 'last', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.updateDraft(id, field, value);
  }

  protected commitName(id: string) {
    const draft = this.drafts()[id];
    if (!draft) return;
    this.tournamentStore.updateParticipant(id, {
      firstName: draft.first.trim(),
      ...(draft.last.trim() ? { lastName: draft.last.trim() } : {}),
    });
  }

  // --- Drag-and-drop reorder ---
  protected onDragStart(index: number) {
    this.dragIndex.set(index);
  }

  protected onDragEnd() {
    this.dragIndex.set(null);
  }

  protected onDrop(targetIndex: number) {
    const from = this.dragIndex();
    this.dragIndex.set(null);
    if (from === null || from === targetIndex) return;
    this.tournamentStore.reorderParticipants(from, targetIndex);
  }

  // --- Actions ---
  protected removeParticipant(id: string) {
    this.tournamentStore.removeParticipant(id);
  }

  protected goBackToOrganize() {
    this.router.navigate(['/organize']);
  }
}
