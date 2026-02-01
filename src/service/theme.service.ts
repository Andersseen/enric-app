import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export default class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';

  // Signal for reactive theme state
  #theme = signal<Theme>(this.getInitialTheme());
  theme = this.#theme.asReadonly();

  constructor() {
    // Apply initial theme immediately
    this.applyTheme(this.#theme());

    // Apply theme whenever it changes
    effect(() => {
      this.applyTheme(this.#theme());
    });
  }

  /**
   * Get initial theme from localStorage or system preference
   */
  private getInitialTheme(): Theme {
    // Check localStorage first
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: Theme): void {
    const isDark = theme === 'dark';

    document.documentElement.classList.toggle('ion-palette-dark', isDark);
    document.body.classList.toggle('ion-palette-dark', isDark);

    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    const currentTheme = this.#theme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    this.#theme.set(newTheme);
  }

  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this.#theme.set(theme);
  }

  /**
   * Get current theme value
   */
  getTheme(): Theme {
    return this.#theme();
  }

  /**
   * Check if dark mode is active
   */
  isDark(): boolean {
    return this.#theme() === 'dark';
  }
}
