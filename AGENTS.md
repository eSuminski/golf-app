```json
{
  "angularVersion": "21",
  "context": {
    "projectName": "Golf App",
    "description": "A golf tournament organization tool that parses text from Word, Excel, and PDF documents into table format for organizing names into teams and exporting to CSV.",
    "coreFeatures": [
      "Parse documents (Word, Excel, PDF) into structured data",
      "Connect names (first and last name)",
      "Organize names into teams",
      "Export organized data to CSV"
    ],
    "accessibility": {
      "requirements": ["AXE passes", "WCAG AA minimums"],
      "focus": "focus management, color contrast, ARIA attributes"
    },
    "angularNotes": {
      "standaloneDefault": "standalone is default in Angular v20+, don't set it explicitly in decorators",
      "hostBindings": "Use host object in @Component/@Directive instead of @HostBinding/@HostListener decorators",
      "ngOptimizedImage": "Use for all static images (not inline base64)",
      "cli": "Use 'npm run ng' for Angular CLI access"
    },
    "codeOrganization": {
      "guideline": "Group by feature when possible, otherwise by resource type",
      "componentSize": "Keep components small and focused on single responsibility",
      "templateStyle": "Prefer inline templates for small components, external for larger ones",
      "forms": "Prefer Reactive forms over Template-driven"
    },
    "typing": {
      "strict": true,
      "inference": "Prefer type inference when obvious",
      "unknown": "Use unknown when type is uncertain, never any"
    }
  },
  "forbidden": {
    "structuralDirectives": ["*ngIf", "*ngFor", "*ngSwitchCase", "*ngSwitchDefault"],
    "ngModules": true,
    "constructorDI": true,
    "materialBarrels": ["@angular/material", "MaterialModule"],
    "legacyMaterial": true,
    "asyncPipeOnSignals": true,
    "observableLocalState": true,
    "routerModule": ["RouterModule.forRoot", "RouterModule.forChild"]
  },
  "required": {
    "component": {
      "standalone": true,
      "importsArray": true,
      "changeDetection": "OnPush",
      "useInject": true,
      "useInputOutputDecorators": true
    },
    "template": {
      "useAtSyntax": ["@if", "@for", "@switch"],
      "forTrackExpression": true
    },
    "state": {
      "signals": ["signal", "computed", "effect"],
      "readonlySignals": true
    },
    "material": {
      "explicitImports": true,
      "mdcOnly": true
    },
    "routing": {
      "provideRouter": true,
      "lazyLoad": "loadComponent"
    },
    "testing": {
      "standaloneTestBed": true,
      "httpTesting": "provideHttpClientTesting"
    }
  },
  "allowed": {
    "rxjs": ["httpStreams", "websocketStreams", "externalEventSources", "complexAsyncPipelines"]
  },
  "patterns": {
    "component": {
      "example": {
        "standalone": true,
        "imports": ["MatButtonModule"],
        "changeDetection": "OnPush",
        "di": "inject()",
        "state": "signal()"
      }
    },
    "template": {
      "example": ["@if (user()) { ... }", "@for (item of items(); track item.id) { ... }"]
    },
    "routing": {
      "example": {
        "lazy": "loadComponent: () => import('./cmp').then(m => m.Cmp)"
      }
    }
  },
  "rules": {
    "alwaysUse": [
      "@if/@for/@switch",
      "signal/computed/effect",
      "inject()",
      "explicitMaterialImports",
      "standaloneComponents",
      "OnPush"
    ],
    "neverUse": [
      "*ngIf/*ngFor",
      "NgModule",
      "MaterialModule",
      "constructorInjection",
      "asyncPipeOnSignals",
      "observableLocalState"
    ]
  }
}
```
