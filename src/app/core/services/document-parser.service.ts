import { Injectable } from '@angular/core';
import { WordModel } from '../models/word.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentParserService {
  /**
   * Strips HTML tags from the provided string and converts it into
   * a flat array of WordModel objects.
   */
  parseHtmlToWords(html: string): WordModel[] {
    // 1. Remove all HTML tags using a regex
    const text = html.replace(/<[^>]*>/g, ' ');

    // 2. Split by whitespace but keep the whitespace/newlines as their own "words"
    // This regex captures sequences of non-whitespace OR sequences of whitespace
    const parts = text.split(/(\s+)/);

    return parts
      .filter(part => part.length > 0)
      .map(part => ({
        text: part,
        isWhitespace: /\s/.test(part)
      }));
  }
}
