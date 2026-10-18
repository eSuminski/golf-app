import {
  Component,
  ChangeDetectionStrategy,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TournamentStore } from '../core/services/tournament.store';
import { Participant } from '../core/models/participant.model';

interface NameDraft {
  first: string;
  last: string;
}

/** A display group: either the flat "all players" list or a team + its members. */
interface ViewGroup {
  key: string;
  label: string;
  members: Participant[];
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

  // Id of the row currently being dragged (for drop highlighting).
  protected readonly dragId = signal<string | null>(null);

  // In-progress name edits, keyed by participant id. Seeded from the store in
  // an effect (NOT during template evaluation — writing a signal there throws
  // NG0600 and leaves inputs empty). The store is only mutated on commit.
  protected readonly drafts = signal<Record<string, NameDraft>>({});

  // Team-create input
  protected readonly newTeamName = signal('');
  protected readonly hasTeams = computed(() => this.tournamentStore.teams().length > 0);

  // In-progress team name edits, keyed by team id (seeded like participant drafts).
  protected readonly teamDrafts = signal<Record<string, string>>({});

  constructor() {
    // Capture the baseline for undo/reset when the user first lands here.
    this.tournamentStore.beginFinalizeSession();

    // Seed drafts for participants and teams the first time each appears. Only
    // writes when something new appears — unconditionally setting a new object
    // here would re-trigger the effect (the signal is tracked), loop infinitely.
    effect(() => {
      const participants = this.tournamentStore.participants();
      const teams = this.tournamentStore.teams();

      let changed = false;
      const pd = { ...this.drafts() };
      for (const p of participants) {
        if (!pd[p.id]) {
          pd[p.id] = { first: p.firstName, last: p.lastName ?? '' };
          changed = true;
        }
      }
      if (changed) this.drafts.set(pd);

      let teamChanged = false;
      const td = { ...this.teamDrafts() };
      for (const t of teams) {
        if (td[t.id] === undefined) {
          td[t.id] = t.name;
          teamChanged = true;
        }
      }
      if (teamChanged) this.teamDrafts.set(td);
    });
  }

  /**
   * Builds the display groups. When no teams exist, a single flat "All Players"
   * group. When teams exist, groups by team plus an "Unassigned" section.
   * Reordering always targets the flat participants array (the export order),
   * regardless of which group a row displays in — so dragging works in both.
   */
  protected readonly viewGroups = computed<ViewGroup[]>(() => {
    const participants = this.tournamentStore.participants();
    const teams = this.tournamentStore.teams();

    if (teams.length === 0) {
      return [{ key: 'all', label: 'All Players', members: participants }];
    }

    const groups: ViewGroup[] = teams.map((t) => ({
      key: t.id,
      label: t.name,
      members: participants.filter((p) => p.teamId === t.id),
    }));
    const unassigned = participants.filter((p) => !p.teamId);
    if (unassigned.length > 0) {
      groups.push({ key: 'unassigned', label: 'Unassigned', members: unassigned });
    }
    return groups;
  });

  /** Returns whether a participant is currently being dragged. */
  protected isDragging(id: string): boolean {
    return this.dragId() === id;
  }

  // --- Inline name editing ---
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

  // --- Team name editing ---
  protected onTeamNameInput(id: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.teamDrafts.set({ ...this.teamDrafts(), [id]: value });
  }

  protected commitTeamName(id: string) {
    const name = this.teamDrafts()[id];
    if (name === undefined) return;
    this.tournamentStore.renameTeam(id, name.trim());
  }

  // --- Drag-and-drop reorder (flat export order, works with or without teams) ---
  protected onDragStart(id: string) {
    this.dragId.set(id);
  }

  protected onDragEnd() {
    this.dragId.set(null);
  }

  protected onDrop(targetId: string) {
    const fromId = this.dragId();
    this.dragId.set(null);
    if (!fromId || fromId === targetId) return;

    const flat = this.tournamentStore.participants();
    const from = flat.findIndex((p) => p.id === fromId);
    const to = flat.findIndex((p) => p.id === targetId);
    if (from === -1 || to === -1) return;
    this.tournamentStore.reorderParticipants(from, to);
  }

  // --- Team actions ---
  protected createTeam() {
    const name = this.newTeamName().trim();
    if (!name) return;
    this.tournamentStore.createTeam(name);
    this.newTeamName.set('');
  }

  protected onNewTeamNameInput(event: Event) {
    this.newTeamName.set((event.target as HTMLInputElement).value);
  }

  protected onTeamAssign(participantId: string, event: Event) {
    const teamId = (event.target as HTMLSelectElement).value;
    this.tournamentStore.assignToTeam(participantId, teamId || null);
  }

  protected removeTeam(id: string) {
    this.tournamentStore.removeTeam(id);
  }

  // --- Actions ---
  protected removeParticipant(id: string) {
    this.tournamentStore.removeParticipant(id);
  }

  protected goBackToOrganize() {
    this.router.navigate(['/organize']);
  }
}
