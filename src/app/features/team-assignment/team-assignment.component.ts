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
  templateUrl: './team-assignment.component.html',
  styleUrl: './team-assignment.component.css',
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
