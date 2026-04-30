import { WordModel } from './word.model';

/**
 * Represents a node in the parsed document structure.
 * Can be either a container (div, p, table, etc.) or a word.
 */
export interface DocumentNode {
  type: 'container' | 'word';
  tagName?: string; // For containers: 'p', 'div', 'table', 'tr', 'td', etc.
  children?: DocumentNode[]; // For containers
  word?: WordModel; // For word nodes
  styles?: Record<string, string>; // Inline styles to preserve
  classes?: string[]; // CSS classes to preserve
}
