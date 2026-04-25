import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordModel } from '../../models/word.model';

@Component({
  selector: 'app-word',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word.html',
  styleUrl: './word.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordComponent {
  word = input.required<WordModel>();
  state = input<'none' | 'buffer' | 'selected'>('none');
  color = input<string | null>(null);

  wordClicked = output<string>();
  wordRightClicked = output<string>();

  onLeftClick() {
    if (this.word().isWhitespace) return;
    this.wordClicked.emit(this.word().text);
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    if (this.word().isWhitespace) return;
    this.wordRightClicked.emit(this.word().text);
  }
}
