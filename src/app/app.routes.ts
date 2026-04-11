import { Routes } from '@angular/router';
import { Upload } from './upload/upload';
import { Organize } from './organize/organize';
import { Finalize } from './finalize/finalize';

export const routes: Routes = [
  { path: '', redirectTo: '/upload', pathMatch: 'full' },
  { path: 'upload', component: Upload },
  { path: 'organize', component: Organize },
  { path: 'finalize', component: Finalize },
];
