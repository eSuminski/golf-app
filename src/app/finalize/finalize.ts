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

/** Issues found during pre-export validation. */
interface ExportWarnings {
  blankCount: number;
  duplicates: string[];
}

const SKIP_WARNINGS_KEY = 'golf-app.skip-export-warnings';

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

  // Export warning state
  protected readonly exportWarnings = signal<ExportWarnings | null>(null);
  protected readonly dontShowAgain = signal(false);
  protected readonly skipExportWarnings = signal(localStorage.getItem(SKIP_WARNINGS_KEY) === '1');

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

  protected undo() {
    this.tournamentStore.undo();
    this.resyncDraftsFromStore();
  }

  protected resetEdits() {
    this.tournamentStore.resetEdits();
    this.resyncDraftsFromStore();
  }

  /**
   * After an undo/reset the store state reverts, but the inputs read from the
   * drafts signal (seeded once). Rebuild drafts from the reverted participants
   * so inputs reflect the undone state.
   */
  private resyncDraftsFromStore() {
    const participants = this.tournamentStore.participants();
    const next: Record<string, NameDraft> = {};
    for (const p of participants) {
      next[p.id] = { first: p.firstName, last: p.lastName ?? '' };
    }
    this.drafts.set(next);

    const teams = this.tournamentStore.teams();
    const teamNext: Record<string, string> = {};
    for (const t of teams) {
      teamNext[t.id] = t.name;
    }
    this.teamDrafts.set(teamNext);
  }

  // --- CSV export ---
  protected exportCsv() {
    if (this.skipExportWarnings()) {
      this.doExport();
      return;
    }

    const warnings = this.computeWarnings();
    if (warnings.blankCount === 0 && warnings.duplicates.length === 0) {
      this.doExport();
      return;
    }

    this.exportWarnings.set(warnings);
  }

  protected confirmExport() {
    if (this.dontShowAgain()) {
      localStorage.setItem(SKIP_WARNINGS_KEY, '1');
      this.skipExportWarnings.set(true);
    }
    this.exportWarnings.set(null);
    this.doExport();
  }

  protected cancelExport() {
    this.exportWarnings.set(null);
  }

  protected onDontShowAgainChange(event: Event) {
    this.dontShowAgain.set((event.target as HTMLInputElement).checked);
  }

  /** Finds blank-name and duplicate participants. */
  private computeWarnings(): ExportWarnings {
    const participants = this.tournamentStore.participants();
    let blankCount = 0;
    const seen = new Map<string, number>();
    const duplicates: string[] = [];

    for (const p of participants) {
      const first = p.firstName.trim();
      const last = (p.lastName ?? '').trim();
      const full = `${first} ${last}`.trim();

      if (!first || !last) {
        blankCount++;
      }

      const key = full.toLowerCase();
      const count = seen.get(key) ?? 0;
      if (count > 0) duplicates.push(full);
      seen.set(key, count + 1);
    }

    return { blankCount, duplicates };
  }

  /** Builds the CSV string: flat by default, adds a Team column when teams exist. */
  private buildCsv(): string {
    const participants = this.tournamentStore.participants();
    const teams = this.tournamentStore.teams();
    const teamName = new Map(teams.map((t) => [t.id, t.name]));
    const withTeams = teams.length > 0;

    const header = withTeams ? ['First Name', 'Last Name', 'Team'] : ['First Name', 'Last Name'];

    const rows = participants.map((p) => {
      const row = [p.firstName, p.lastName ?? ''];
      if (withTeams) row.push(p.teamId ? (teamName.get(p.teamId) ?? '') : '');
      return row;
    });

    return [header, ...rows].map((row) => row.map(this.escapeCsvCell).join(',')).join('\r\n');
  }

  private escapeCsvCell(value: string): string {
    if (/[",\r\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private doExport() {
    const csv = this.buildCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'participants.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  protected goBackToOrganize() {
    this.router.navigate(['/organize']);
  }
}
