# Golf Tournament App - Architecture Documentation

## Overview

This document describes the architecture of the golf tournament team assignment application.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                Angular Application                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │ Upload       │  │ Data Entry   │  │ Team     │ │
│  │ Component    │  │ Component    │  │ Assign   │ │
│  │              │  │              │  │ Component│ │
│  │ - File upload│  │ - Table view │  │ - Teams  │ │
│  │ - Drag-drop  │  │ - Validation │  │ - Drag   │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│  ┌──────────────┐                                 │
│  │ Export       │                                 │
│  │ Component    │                                 │
│  │ - CSV output │                                 │
│  └──────────────┘                                 │
└─────────────────────────────────────────────────────┘
```

## Component Structure

### 1. Upload Component (`app-upload`)

**Location:** `src/app/features/upload/upload.component.ts`

**Responsibilities:**

- Handle file uploads via drag-and-drop
- Validate file types and sizes
- Display uploaded file list
- Navigate to data entry after upload

**State:**

- `uploadedFiles`: Array of { name, type } objects

**Features:**

- Centered drop zone
- File type detection (blue/green/red theme)
- Multiple file support
- Error handling

### 2. Data Entry Component (`app-data-entry`)

**Location:** `src/app/features/data-entry/data-entry.component.ts`

**Responsibilities:**

- Display extracted participant data
- Enable manual name entry (First/Last)
- Validate name entries
- Navigate to team assignment

**State:**

- `participants`: Array of { rawText, firstName, lastName }
- `validationErrors`: Array of { message }

**Features:**

- Excel-like table with cell editing
- Keyboard navigation (Tab, Enter, arrows)
- Validation feedback
- Empty name detection

**Data Model:**

```typescript
interface Participant {
  rawText: string;
  firstName: string;
  lastName: string;
}
```

### 3. Team Assignment Component (`app-team-assignment`)

**Location:** `src/app/features/team-assignment/team-assignment.component.ts`

**Responsibilities:**

- Display team zones
- Handle drag-and-drop of participants
- Manage team names (add/delete/rename)
- Navigate to export

**State:**

- `teams`: Array of Team objects with participants

**Features:**

- Grid layout of team zones
- Drag-and-drop using Angular CDK
- Auto-generated team names ("Team 1", "Team 2", etc.)
- Team management (add/delete/rename)
- Visual drag feedback

**Data Models:**

```typescript
interface Participant {
  id: number;
  firstName: string;
  lastName: string;
}

interface Team {
  id: number;
  name: string;
  participants: Participant[];
}
```

### 4. Export Component (`app-export`)

**Location:** `src/app/features/export/export.component.ts`

**Responsibilities:**

- Display CSV preview
- Generate CSV file
- Navigate back to upload

**State:**

- `exportData`: Array of { teamName, firstName, lastName }

**Features:**

- Preview table with 3 columns
- Download CSV functionality
- Back navigation

## Routing

**Routes:**

- `/upload` - File upload page
- `/data-entry` - Data entry page
- `/team-assignment` - Team assignment page
- `/export` - Export page

**Navigation Flow:**

```
Upload → Data Entry → Team Assignment → Export
```

## Theme System

### Dynamic Theming

Themes are applied based on file type:

- **Blue** - Word documents
- **Green** - Excel/CSV files
- **Red** - PDF files

### CSS Variables

```css
[data-theme='blue'] {
  --primary-color: #1976d2;
  --primary-color-dark: #1565c0;
}

[data-theme='green'] {
  --primary-color: #388e3c;
  --primary-color-dark: #2e7d32;
}

[data-theme='red'] {
  --primary-color: #d32f2f;
  --primary-color-dark: #c62828;
}
```

## File Upload Flow

```
1. User drags file → UploadedFile object created
2. File type detected (Word/Excel/PDF)
3. Theme automatically set based on file type
4. File parsed → Text extracted
5. Text stored in table structure
6. User navigates to data entry
```

## Data Entry Flow

```
1. Raw text displayed in first column
2. User enters First Name in second column
3. User enters Last Name in third column
4. Validation checks for empty names
5. Error feedback shown if needed
6. User navigates to team assignment
```

## Team Assignment Flow

```
1. Teams are auto-created (Team 1, Team 2, etc.)
2. User can rename teams via input field
3. User can delete empty teams
4. User drags participants to team zones
5. Teams store assigned participants
6. User navigates to export
```

## Export Flow

```
1. CSV preview displayed
2. User verifies data
3. Export generates CSV file
4. Download triggers
5. User can return to upload
```

## Data Models

### Upload

```typescript
interface UploadedFile {
  name: string;
  type: string; // 'word' | 'excel' | 'pdf' | 'csv'
}
```

### Data Entry

```typescript
interface Participant {
  rawText: string;
  firstName: string;
  lastName: string;
}

interface ValidationError {
  message: string;
}
```

### Team Assignment

```typescript
interface Participant {
  id: number;
  firstName: string;
  lastName: string;
}

interface Team {
  id: number;
  name: string;
  participants: Participant[];
}
```

### Export

```typescript
interface ExportRow {
  teamName: string;
  firstName: string;
  lastName: string;
}
```

## State Management

### Signal Usage

- `signal<T>()` for reactive state
- `computed()` for derived state
- `@Input()` and `@Output()` for component communication

### State Updates

```typescript
// Setting state
this.uploadedFiles.set(newFiles);

// Updating
this.uploadedFiles.update((files) => [...files, newFile]);

// Reading
const files = this.uploadedFiles();
```

## Styling Approach

### Global Styles (`src/styles.css`)

- Pre-built Material theme
- Custom CSS variables for dynamic theming
- Dark mode support
- Responsive breakpoints

### Component Styles

- Custom CSS with Angular component styles
- CSS variables for theming
- Mobile-first responsive design

## Testing Strategy

### Unit Tests

- File upload validation
- Text parsing
- Name validation
- Team assignment logic
- CSV generation

### Integration Tests

- Complete workflow
- Theme switching
- Form validation
- CSV export

## Future Enhancements

1. **Large File Support**: Implement streaming for files >50MB
2. **Automated Name Detection**: ML-based first/last name detection
3. **Team Balancing**: Algorithm to balance team skill levels
4. **Multi-tournament Support**: Save/load tournament data
5. **Export Formats**: Support multiple export formats
6. **Drag-and-Drop Implementation**: Full Angular CDK implementation
