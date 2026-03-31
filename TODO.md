## Styling Implementation Plan

### 1. Set Up Routing (`app.routes.ts`)

- Configure 3 routes: `/upload`, `/organize`, `/finalize`
- Import necessary modules (`RouterModule`)

### 2. Update App Component (`app.ts`, `app.html`, `app.css`)

- Add `SideNav` to `App` component imports
- Restructure template: `<app-side-nav></app-side-nav>` + `<router-outlet></router-outlet>`
- Add flexbox/grid CSS to position sidebar left, main content right

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
