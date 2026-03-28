# Golf Tournament Team Assignment App

A web application for tournament organizers to efficiently assign golf participants into teams and export the results to CSV.

## Overview

This app helps tournament organizers:

- **Upload** participant data from Word, Excel, CSV, or PDF documents
- **Extract** text and organize names into structured data
- **Assign** participants to teams via drag-and-drop interface
- **Export** the final team assignments to CSV format

## Features

- ✅ Document upload with drag-and-drop
- ✅ Text extraction from Word, Excel, CSV, and PDF files
- ✅ Excel-like data entry for name entry (First/Last name)
- ✅ Team assignment with drag-and-drop
- ✅ Dynamic theming based on file type (blue for Word, green for Excel, red for PDF)
- ✅ Dark mode support
- ✅ Responsive design (mobile to desktop)
- ✅ CSV export with team assignments

## Tech Stack

- **Angular 21.2.3** - Web framework
- **Angular Material** - UI components
- **TypeScript** - Type-safe development
- **Vitest** - Testing framework
- **PapaParse** - CSV parsing
- **PDF.js** - PDF text extraction

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v11 or higher)

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200/`

### Building for Production

```bash
npm run build
```

The build artifacts will be in the `dist/golf-app/` directory.

### Running Tests

```bash
npm test
```

## Project Structure

```
src/
├── app/
│   ├── app.ts              # Root component
│   ├── app.config.ts       # App configuration
│   ├── app.routes.ts       # Router configuration
│   └── features/
│       ├── upload/         # File upload component
│       ├── data-entry/     # Participant data entry
│       ├── team-assignment/ # Team assignment
│       └── export/         # CSV export
├── styles.css              # Global styles and themes
└── main.ts                 # App entry point
```

## Documentation

- **Agent Instructions** - See `.github/copilot-instructions.md` for AI development guidelines
- **Architecture Documentation** - See `.opencode/` for detailed architecture specifications

## License

Private - golf-app
