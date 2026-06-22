// theme.service.ts
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  isDark = false;

  constructor(factory: RendererFactory2) {
    this.renderer = factory.createRenderer(null, null);
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDark();
    }
  }

  toggle() {
    this.isDark ? this.enableLight() : this.enableDark();
  }

  private enableDark() {
    this.renderer.addClass(document.body, 'dark');
    localStorage.setItem('theme', 'dark');
    this.isDark = true;
  }

  private enableLight() {
    this.renderer.removeClass(document.body, 'dark');
    localStorage.setItem('theme', 'light');
    this.isDark = false;
  }
}