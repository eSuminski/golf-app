import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Participant {
  id: number;
  firstName: string;
  lastName: string;
}

interface Team {
  id: number;
  name: string;
  participants: Participant[];
}

@Component({
  selector: 'app-team-assignment',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="team-assignment-container">
      <h1>Team Assignment</h1>
      <p>Drag participants to their teams</p>

      <div class="teams-container">
        @for (team of teams(); track team.id) {
          <div class="team">
            <div class="team-header">
              <input
                type="text"
                [(ngModel)]="team.name"
                placeholder="Team Name"
                class="team-name-input"
              />
              <button (click)="addParticipantToTeam(team.id)" class="add-participant-btn">
                + Add Participant
              </button>
            </div>
            <div class="team-participants">
              @for (p of team.participants; track p.id) {
                <div class="participant">{{ p.firstName }} {{ p.lastName }}</div>
              }
            </div>
          </div>
        }
      </div>

      <div class="actions">
        <button (click)="goToExport()">Next: Export</button>
      </div>
    </div>
  `,
  styles: [
    `
      .team-assignment-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }
      h1 {
        text-align: center;
        margin-bottom: 0.5rem;
      }
      p {
        text-align: center;
        color: var(--gray-700);
        margin-bottom: 2rem;
      }
      .teams-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .team {
        border: 1px solid var(--gray-300);
        border-radius: 8px;
        padding: 1rem;
      }
      .team-header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        gap: 0.5rem;
      }
      .team-name-input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid var(--gray-300);
        border-radius: 4px;
      }
      .add-participant-btn {
        padding: 0.5rem 1rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .team-participants {
        min-height: 100px;
        border: 1px dashed var(--gray-300);
        border-radius: 4px;
        padding: 0.5rem;
      }
      .participant {
        padding: 0.5rem;
        margin: 0.25rem 0;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        cursor: grab;
      }
      .actions {
        text-align: center;
        margin-top: 2rem;
      }
      .actions button {
        padding: 0.75rem 2rem;
        font-size: 1rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .actions button:hover {
        background-color: var(--primary-color-dark);
      }
    `,
  ],
})
export class TeamAssignmentComponent {
  teams = signal<Team[]>([
    { id: 1, name: 'Team 1', participants: [] },
    { id: 2, name: 'Team 2', participants: [] },
    { id: 3, name: 'Team 3', participants: [] },
  ]);

  addParticipantToTeam(teamId: number) {
    console.log('Add participant to team', teamId);
  }

  goToExport() {
    console.log('Navigate to export');
  }
}
