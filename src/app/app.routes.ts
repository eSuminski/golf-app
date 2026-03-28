import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'upload',
    pathMatch: 'full',
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./features/upload/upload.component').then((m) => m.UploadComponent),
  },
  {
    path: 'data-entry',
    loadComponent: () =>
      import('./features/data-entry/data-entry.component').then((m) => m.DataEntryComponent),
  },
  {
    path: 'team-assignment',
    loadComponent: () =>
      import('./features/team-assignment/team-assignment.component').then(
        (m) => m.TeamAssignmentComponent,
      ),
  },
  {
    path: 'export',
    loadComponent: () =>
      import('./features/export/export.component').then((m) => m.ExportComponent),
  },
];
