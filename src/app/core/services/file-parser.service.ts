import { Injectable } from '@angular/core';
import * as mammoth from 'mammoth';
import { DocumentNode } from '../models/document-node.model';
import { WordModel } from '../models/word.model';

@Injectable({
  providedIn: 'root'
})
export class FileParserService {
  /**
   * Converts a .docx file to a structured DocumentNode tree.
   * Parses the document and wraps each word for interactive selection.
   */
  async convertDocxToStructure(file: File): Promise<DocumentNode> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      return this.parseHtmlToStructure(result.value);
    } catch (error) {
      console.error('Error parsing docx:', error);
      throw new Error('Failed to parse Word document.');
    }
  }

  /**
   * Parses HTML string into a DocumentNode tree structure.
   * Each word becomes a separate node for click handling.
   */
  private parseHtmlToStructure(html: string): DocumentNode {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Wrap the body content in a root container
    const rootNode: DocumentNode = {
      type: 'container',
      tagName: 'div',
      children: []
    };

    // Parse all children of the body
    doc.body.childNodes.forEach(node => {
      const parsed = this.parseNode(node);
      if (parsed) {
        rootNode.children!.push(parsed);
      }
    });

    return rootNode;
  }

  /**
   * Recursively parses a DOM node into a DocumentNode.
   */
  private parseNode(node: Node): DocumentNode | null {
    // Text nodes - split into words
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      return this.parseTextIntoWords(text);
    }

    // Element nodes - create containers
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      // Skip script and style tags
      if (tagName === 'script' || tagName === 'style') {
        return null;
      }

      const containerNode: DocumentNode = {
        type: 'container',
        tagName,
        children: [],
        classes: element.className ? element.className.split(' ').filter(c => c) : undefined,
        styles: this.extractStyles(element)
      };

      // Parse all child nodes
      element.childNodes.forEach(child => {
        const parsed = this.parseNode(child);
        if (parsed) {
          containerNode.children!.push(parsed);
        }
      });

      return containerNode;
    }

    return null;
  }

  /**
   * Splits text into word nodes, preserving whitespace as separate nodes.
   */
  private parseTextIntoWords(text: string): DocumentNode {
    const container: DocumentNode = {
      type: 'container',
      tagName: 'span',
      children: []
    };

    // Split on whitespace boundaries while preserving the whitespace
    const tokens = text.split(/(\s+)/);

    tokens.forEach(token => {
      if (token.length === 0) return;

      const isWhitespace = /^\s+$/.test(token);
      const wordNode: DocumentNode = {
        type: 'word',
        word: {
          id: crypto.randomUUID(),
          text: token,
          isWhitespace
        }
      };

      container.children!.push(wordNode);
    });

    return container;
  }

  /**
   * Extracts inline styles from an element.
   */
  private extractStyles(element: Element): Record<string, string> | undefined {
    const htmlElement = element as HTMLElement;
    if (!htmlElement.style || htmlElement.style.length === 0) {
      return undefined;
    }

    const styles: Record<string, string> = {};
    for (let i = 0; i < htmlElement.style.length; i++) {
      const prop = htmlElement.style[i];
      styles[prop] = htmlElement.style.getPropertyValue(prop);
    }

    return Object.keys(styles).length > 0 ? styles : undefined;
  }
}
