import { Injectable } from '@angular/core';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
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

  /**
   * Converts an Excel (.xls / .xlsx / .csv) file to an HTML string.
   *
   * Each non-empty sheet becomes its own section: a heading with the sheet
   * name followed by one <p> per data row. Cell values within a row are joined
   * with a single space and empty cells are dropped. This removes the comma
   * separators SheetJS uses between columns while preserving genuine commas
   * that appear inside a single cell's content.
   */
  async convertExcelToHtml(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const parts: string[] = [];

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) return;

        // header:1 gives rows as arrays of raw cell values, preserving order
        // and blanks so we can join cells ourselves (per row-based rendering).
        const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1 });

        const rowParagraphs = rows
          .map((row) => this.rowToParagraph(row))
          .filter((p): p is string => p !== null);

        // Skip empty sheets entirely (Decision D1: only non-empty sheets).
        if (rowParagraphs.length === 0) return;

        parts.push(`<h3>${this.escapeHtml(sheetName)}</h3>`);
        parts.push(...rowParagraphs);
      });

      return parts.join('\n');
    } catch (error) {
      console.error('Error parsing Excel document:', error);
      throw new Error('Failed to parse Excel document.');
    }
  }

  /**
   * Converts one worksheet row into a <p> of space-separated, HTML-escaped
   * cell values. Returns null for a fully-empty row (skipped).
   */
  private rowToParagraph(row: unknown[]): string | null {
    const cells = row
      .map((cell) => (cell == null ? '' : String(cell).trim()))
      .filter((text) => text.length > 0);

    if (cells.length === 0) return null;

    return `<p>${this.escapeHtml(cells.join(' '))}</p>`;
  }

  /**
   * Escapes HTML-significant characters so trusted rendering (innerHTML via
   * bypassSecurityTrustHtml downstream) can't be broken or injected by cell data.
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
