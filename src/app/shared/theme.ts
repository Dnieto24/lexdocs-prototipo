import { Injectable, signal, effect } from '@angular/core';

type Mode = 'light' | 'dark';

// ponytail: tema en localStorage + atributo data-theme en <html>. Default claro.
@Injectable({ providedIn: 'root' })
export class Theme {
  private mode = signal<Mode>((localStorage.getItem('lexdocs-theme') as Mode) || 'light');
  isDark = () => this.mode() === 'dark';

  constructor() {
    effect(() => {
      const m = this.mode();
      document.documentElement.dataset['theme'] = m;
      localStorage.setItem('lexdocs-theme', m);
    });
  }

  toggle() {
    this.mode.update(m => (m === 'dark' ? 'light' : 'dark'));
  }
}
