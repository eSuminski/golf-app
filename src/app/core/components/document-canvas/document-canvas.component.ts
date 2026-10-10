import {
  Component,
  ElementRef,
  inject,
  input,
  effect,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TournamentStore } from '../../services/tournament.store';

/** A single word token stripped out of the rendered document. */
interface TokenRecord {
  tokenId: string;
  text: string;
  sourceLine: string;
}

@Component({
  selector: 'app-document-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-canvas.component.html',
  styleUrl: './document-canvas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCanvasComponent {
  private sanitizer = inject(DomSanitizer);
  private tournamentStore = inject(TournamentStore);

  htmlContent = input.required<string>();
  safeHtml = signal<SafeHtml>('');

  // Live rendered document, used to apply/remove selection highlight classes.
  protected readonly documentContent =
    viewChild.required<ElementRef<HTMLElement>>('documentContent');

  // tokenId -> word, built once when the document is tokenized. The click
  // handlers (next phase) resolve a clicked span's token id into this map.
  readonly tokenRegistry = new Map<string, TokenRecord>();

  constructor() {
    // 1. Tokenize the raw HTML: walk every text node, wrap each word in its own
    // span (data-token-id), and record text + source line in the registry.
    // Producing the tokenized HTML as a string avoids racing [innerHTML] with a
    // viewChild read — the binding just renders whatever we set here.
    effect(() => {
      const rawHtml = this.htmlContent();
      if (!rawHtml) return;
      this.safeHtml.set(this.sanitizer.bypassSecurityTrustHtml(this.tokenize(rawHtml)));
    });

    // 2. Derive selection highlight on the live DOM from store selection state.
    // Signal-driven (classList.toggle from an effect) so selection changes are
    // reflected without re-tokenizing or hand-mutating the content string.
    effect(() => {
      const selection = this.tournamentStore.activeSelection();
      const el = this.documentContent()?.nativeElement;
      if (!el) return;

      const firstId = selection.find((e) => e.role === 'first')?.tokenId ?? null;
      const selected = new Set(selection.map((e) => e.tokenId));

      el.querySelectorAll<HTMLElement>('span[data-token-id]').forEach((span) => {
        const id = span.dataset['tokenId'] ?? '';
        span.classList.toggle('selected', selected.has(id));
        span.classList.toggle('is-first', id === firstId);
      });
    });
  }

  /**
   * Wraps every word in the given HTML string inside a selectable span. Returns
   * the modified HTML. Each token gets a stable, incrementing id for this
   * document; words inside headings and tables are tokenized too, so any word
   * is selectable.
   */
  onCanvasClick(event: MouseEvent) {
    // Implemented in the next phase (selection click handling).
    console.log('Canvas clicked', event.target);
  }

  onCanvasRightClick(event: MouseEvent) {
    event.preventDefault();
    // Implemented in the next phase (finalize on right-click).
    console.log('Canvas right-clicked', event.target);
  }

  private tokenize(rawHtml: string): string {
    this.tokenRegistry.clear();
    const container = document.createElement('div');
    container.innerHTML = rawHtml;

    // Collect text nodes first (walking while mutating the tree is unsafe).
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (node.textContent && node.textContent.trim().length > 0) {
        textNodes.push(node);
      }
    }

    let nextId = 0;
    for (const node of textNodes) {
      const parent = node.parentElement;
      if (!parent) continue;

      // Source line for traceability: the enclosing p/h3 text content.
      const sourceLine = (parent.closest('p, h3')?.textContent ?? '').trim();
      const words = (node.textContent ?? '').split(/(\s+)/).filter(Boolean);

      const fragment = document.createDocumentFragment();
      for (const word of words) {
        // Whitespace between words stays as plain text (keeps spacing intact).
        if (/^\s+$/.test(word)) {
          fragment.appendChild(document.createTextNode(word));
          continue;
        }
        const id = String(nextId++);
        const span = document.createElement('span');
        span.className = 'word';
        span.dataset['tokenId'] = id;
        span.textContent = word;
        fragment.appendChild(span);
        this.tokenRegistry.set(id, { tokenId: id, text: word, sourceLine });
      }
      parent.replaceChild(fragment, node);
    }

    return container.innerHTML;
  }
}
