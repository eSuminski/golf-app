# Golf Tournament App - Agent Instructions

## Project Context

This is a golf tournament team assignment tool for tournament organizers. Users upload participant data (from Word, Excel, CSV, or PDF documents), organize names into teams, and export the results to CSV.

## Key Features

1. **Document Upload** - Drag-drop interface for file uploads (Word, Excel, CSV, PDF)
2. **Text Extraction** - Extract text from documents and convert to table structure
3. **Name Entry** - Excel-like grid for manual first/last name grouping
4. **Team Assignment** - Drag-and-drop participants to predefined teams
5. **Export** - Simple 3-column CSV export (Team Name, First Name, Last Name)

## Domain-Specific Patterns

### File Types

- **Word (.doc, .docx)** → Blue theme
- **Excel/CSV (.xlsx, .xls, .csv)** → Green theme
- **PDF (.pdf)** → Red theme

### Name Entry Workflow

- Participants appear in a table with "Raw Text"
- User manually enters First Name and Last Name into separate columns
- Validation prevents empty names
- Excel-like keyboard navigation (Tab, Enter, arrow keys)

### Team Assignment Workflow

- Teams are auto-generated as "Team 1", "Team 2", etc.
- Teams can be renamed by clicking on the team name
- Empty teams can be deleted
- Drag participants from data table to team zones
- Teams with participants have drop zones for drag-and-drop

## Angular Best Practices

### Component Structure

- Use standalone components (imports: [CommonModule, FormsModule, etc.])
- Use signal() for reactive state management
- Use @if, @for control flow instead of *ngIf, *ngFor
- Use inline templates for small components
- Use class bindings instead of ngClass
- Use style bindings instead of ngStyle
- Set changeDetection: ChangeDetectionStrategy.OnPush

### File Upload Component (UploadComponent)

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  template: `...`,
})
export class UploadComponent {
  uploadedFiles = signal<{ name: string; type: string }[]>([]);
}
```

### Data Entry Component (DataEntryComponent)

- Uses mat-table for Excel-like grid
- Uses Angular forms for cell editing
- Validation shows errors inline
- Keyboard navigation (Tab, Enter, arrows)

### Team Assignment Component (TeamAssignmentComponent)

- Uses @for for team rendering
- Drag-and-drop using Angular Drag & Drop CDK
- Auto-generated team names
- Team management (add/delete/rename)

### Export Component (ExportComponent)

- Simple 3-column table preview
- CSV export functionality
- Back navigation to upload

## State Management

### Signal-Based State

```typescript
participants = signal<Participant[]>([]);
validationErrors = signal<ValidationError[]>([]);

teams = signal<Team[]>([{ id: 1, name: 'Team 1', participants: [] }]);
```

### Derived State

Use computed() for derived values:

```typescript
isValid = computed(() => {
  return this.participants().every((p) => p.firstName && p.lastName);
});
```

## UI/UX Guidelines

### File Upload

- Centered drop zone with visual feedback
- File type indicators (blue/green/red icons)
- Multiple file support
- Progress indication
- Error handling for invalid files

### Data Entry

- Excel-like table with cell-based editing
- Horizontal scroll for large datasets
- Validation feedback (red boxes/errors)
- Keyboard navigation support
- Auto-focus on next cell

### Team Assignment

- Grid layout of team zones
- Drag handles for better UX
- Empty team zones have dashed borders
- Team name editable via input field
- Add/Delete team buttons

### Responsive Design

- Desktop: Full 3-column layout
- Tablet: Stacked columns or collapsible panels
- Mobile: Card-based layout

## Build Commands

```bash
npm install        # Install dependencies
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests
```

## Testing Strategy

Unit tests should cover:

- File upload validation
- Name entry validation
- Team assignment logic
- CSV export formatting
- Theme switching

## Accessibility

- Pass all AXE checks
- Follow WCAG AA minimums
- Focus management for form fields
- Keyboard navigation
- ARIA attributes for drag-and-drop

## File Size Support

- Medium files (10-50MB)
- Consider streaming for large files in future
