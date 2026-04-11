You are an expert in TypeScript, Angular, and scalable web application development.

## Angular v21 Requirements

- Always use standalone components (no NgModules)
- Do NOT set `standalone: true` in decorators (default in v20+)
- Use `input()`/`output()` instead of decorators
- Use `inject()` for DI (no constructor injection)
- Set `changeDetection: OnPush` in `@Component`
- Use signals: `signal()`, `computed()`, `effect()`

## Templates

- Use native control flow: `@if`, `@for`, `@switch`
- Do NOT use `*ngIf`, `*ngFor`, `*ngSwitch`
- Use `class`/`style` bindings (no `ngClass`/`ngStyle`)

## Material UI

- Explicit import only (no barrel imports)
- MDC-only components
- Do NOT use `@angular/material` barrel or `MaterialModule`

## State & Forms

- Use signals for local state (pure transformations)
- Use reactive forms
- No `asyncPipe` on signals
- No observable local state

## Accessibility

- Pass all AXE checks
- Follow WCAG AA minimums (focus, color contrast, ARIA)

## Routing

- Use `provideRouter`
- Lazy load with `loadComponent`

## Testing

- Use `standaloneTestBed`
- Use `provideHttpClientTesting`

## TypeScript

- Strict mode
- Type inference when obvious
- Use `unknown` (never `any`)
