import { Component } from '@angular/core';
import { StepIndicator } from './step-indicator/step-indicator';

@Component({
  selector: 'app-side-nav',
  imports: [StepIndicator],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {
  phases = ['Document Upload', 'Text Organize', 'Text Finalize'];
}
