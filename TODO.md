## Styling Implementation Plan

### 1. Set Up Routing (`app.routes.ts`) DONE!!!!!!

- Configure 3 routes: `/upload`, `/organize`, `/finalize`
- Import necessary modules (`RouterModule`)

### 2. Update App Component (`app.ts`, `app.html`, `app.css`) DONE!!!!!!

- Add `SideNav` to `App` component imports
- Restructure template: `<app-side-nav></app-side-nav>` + `<router-outlet></router-outlet>`
- Add flexbox CSS to position sidebar left, main content right

### 3. Implement Side Nav Component (`side-nav.ts`, `side-nav.html`, `side-nav.css`)

- Create toggleable navigation menu
- Add 3 navigation items with visual indicators (active state)
- Implement toggle state (signal<boolean>)
- Add CSS for:
  - Sidebar positioning (fixed on left)
  - Collapse/expand animation
  - Active route highlighting

### 4. Implement Step Indicator Component (`step-indicator.ts`, `step-indicator.html`, `step-indicator.css`)

- Visual indicator showing current step
- Simple bullet points or numbered steps
- Add active/inactive styles

### 5. Add Global Styles (`styles.css`)

- Normalize/base styles if needed
- CSS variables for colors/tokens

### UPLOAD WORK
Required Updates
1. upload.ts - Component Logic
- Add file drag & drop event handlers
- Add file input click handler
- Add dragover/preventDefault to enable drop
- Track file selection state
2. upload.html - Template
- Drop zone area with visual feedback
- File input element (hidden or styled)
- Upload button/click area
- Selected file display
- Use Angular Material components
3. upload.css - Styles
- Drop zone styling with borders
- Hover states for drag-over
- File preview container
- Upload button styling
Suggested Material Components
- mat-card for drop zone container
- mat-button for upload trigger
- mat-icon for file/upload icons
- mat-progress-spinner (for future async state)
- mat-chip or simple text for file name display
UI Elements Needed
1. Drop zone (card/div that accepts drops)
2. "Click to upload" link/button
3. Icon (upload/document icon)
4. Selected file display area
5. Visual feedback on drag-over
