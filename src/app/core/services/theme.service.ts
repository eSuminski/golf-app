import { Injectable, signal } from '@angular/core';

export type FileType = 'none' | 'pdf' | 'excel' | 'word';

export interface ThemeConfig {
  navGradient: string;
  pageBg: string;
  accentColor: string;
  textOnDark: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Primary Colors
  private readonly RED_PRIMARY = '#7f1d1d';
  private readonly GREEN_PRIMARY = '#14532d';
  private readonly BLUE_PRIMARY = '#1e3a8a';

  // Muted/Dark versions for the "sandwich" effect
  private readonly RED_MUTED = '#450a0a';
  private readonly GREEN_MUTED = '#064e3b';
  private readonly BLUE_MUTED = '#172554';

  // Very light tints for the page background
  private readonly RED_TINT = '#fef2f2';
  private readonly GREEN_TINT = '#f0fdf4';
  private readonly BLUE_TINT = '#eff6ff';
  private readonly NEUTRAL_TINT = '#f8fafc';

  // Initial Spectrum Gradient
  private readonly SPECTRUM_GRADIENT = `linear-gradient(to bottom, ${this.RED_PRIMARY}, ${this.GREEN_PRIMARY}, ${this.BLUE_PRIMARY})`;

  private themeSignal = signal<ThemeConfig>({
    navGradient: this.SPECTRUM_GRADIENT,
    pageBg: this.NEUTRAL_TINT,
    accentColor: '#64748b', // Neutral slate for initial state
    textOnDark: '#ffffff',
  });

  readonly theme = this.themeSignal.asReadonly();

  setTheme(type: FileType) {
    switch (type) {
      case 'pdf':
        this.themeSignal.set({
          navGradient: `linear-gradient(to bottom, ${this.BLUE_MUTED}, ${this.RED_PRIMARY}, ${this.GREEN_MUTED})`,
          pageBg: this.RED_TINT,
          accentColor: this.RED_PRIMARY,
          textOnDark: '#ffffff',
        });
        break;
      case 'excel':
        this.themeSignal.set({
          navGradient: `linear-gradient(to bottom, ${this.BLUE_MUTED}, ${this.GREEN_PRIMARY}, ${this.RED_MUTED})`,
          pageBg: this.GREEN_TINT,
          accentColor: this.GREEN_PRIMARY,
          textOnDark: '#ffffff',
        });
        break;
      case 'word':
        this.themeSignal.set({
          navGradient: `linear-gradient(to bottom, ${this.RED_MUTED}, ${this.BLUE_PRIMARY}, ${this.GREEN_MUTED})`,
          pageBg: this.BLUE_TINT,
          accentColor: this.BLUE_PRIMARY,
          textOnDark: '#ffffff',
        });
        break;
      default:
        this.themeSignal.set({
          navGradient: this.SPECTRUM_GRADIENT,
          pageBg: this.NEUTRAL_TINT,
          accentColor: '#64748b',
          textOnDark: '#ffffff',
        });
        break;
    }
  }
}
