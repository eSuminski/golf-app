import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';

/** A collapsible instructions block shown below the phase header. */
@Component({
  selector: 'app-instructions-panel',
  standalone: true,
  imports: [],
  templateUrl: './instructions-panel.html',
  styleUrl: './instructions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionsPanel {
  title = input('How to use this page');
  protected readonly show = signal(false);

  protected toggle() {
    this.show.update((v) => !v);
  }
}
