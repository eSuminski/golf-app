import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

export type Phase = 'upload' | 'organize' | 'finalize';

const BACK_LABELS: Record<Phase, string> = {
  upload: 'Back to Upload',
  organize: 'Back to Organize',
  finalize: 'Back to Finalize',
};

@Component({
  selector: 'app-phase-header',
  standalone: true,
  imports: [],
  templateUrl: './phase-header.html',
  styleUrl: './phase-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseHeader {
  title = input.required<string>();
  subtitle = input<string>('');

  // When set, renders a back button whose label is derived from the target phase.
  backTo = input<Phase | null>(null);
  back = output<void>();

  protected readonly backLabel = computed(() =>
    this.backTo() ? BACK_LABELS[this.backTo() as Phase] : '',
  );
}
