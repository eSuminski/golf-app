import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-step-indicator',
  imports: [],
  templateUrl: './step-indicator.html',
  styleUrl: './step-indicator.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepIndicator {
  phaseName = input<string>('');
}
