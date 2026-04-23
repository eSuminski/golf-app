import { Injectable } from '@angular/core';
import * as mammoth from 'mammoth';

@Injectable({
  providedIn: 'root'
})
export class FileParserService {
  /**
   * Converts a .docx file to an HTML string using mammoth.js.
   * This allows us to render the document in a way that preserves 
   * structure (like tables) for interactive word selection.
   */
  async convertDocxToHtml(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      return result.value; // The generated HTML
    } catch (error) {
      console.error('Error parsing docx:', error);
      throw new Error('Failed to parse Word document.');
    }
  }
}
