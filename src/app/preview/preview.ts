import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TournamentStore } from '../core/services/tournament.store';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.html',
  styleUrl: './preview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Preview {
  protected readonly tournamentStore = inject(TournamentStore);
  private router = inject(Router);

  // Full name being assembled from the current selection (first + last name).
  protected readonly currentName = computed(() => {
    const first = this.tournamentStore.currentFirstName();
    const last = this.tournamentStore.currentLastName();
    return last ? `${first} ${last}`.trim() : first;
  });

  protected readonly committedCount = computed(() => this.tournamentStore.participants().length);

  removeParticipant(id: string) {
    this.tournamentStore.removeParticipant(id);
  }

  goToFinalize() {
    this.router.navigate(['/finalize']);
  }
}
