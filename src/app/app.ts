import { ChangeDetectionStrategy, Component, signal, ViewChild, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNav } from './side-nav/side-nav';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, MatButtonModule, MatIconModule, SideNav],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private themeService = inject(ThemeService);
  protected readonly title = signal('golf-app');
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor() {
    effect(() => {
      const theme = this.themeService.theme();
      // We apply the variables to the host element or a wrapper. 
      // Since this is the root component, we'll use the effect to update the DOM.
      const root = document.documentElement;
      root.style.setProperty('--app-bg', theme.pageBg);
      root.style.setProperty('--nav-gradient', theme.navGradient);
      root.style.setProperty('--accent-color', theme.accentColor);
      root.style.setProperty('--text-on-dark', theme.textOnDark);
    });
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}
