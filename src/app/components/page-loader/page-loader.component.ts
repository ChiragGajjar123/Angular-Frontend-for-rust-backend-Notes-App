import { Component } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-page-loader',
  standalone: true,
  imports: [SpinnerComponent],
  template: `
    <div class="page-loader">
      <div class="page-loader-inner">
        <div class="page-loader-logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 1 7.92 7.499c0 4.142-3.358 7.5-7.5 7.5H6.75A2.25 2.25 0 0 1 4.5 15.75v-1.5A6 6 0 0 1 12 8.25"/>
            <path d="M12 3c-.132 0-.263 0-.393 0A7.5 7.5 0 0 0 3.687 10.5"/>
          </svg>
          <app-spinner [size]="64" color="var(--accent)" [thickness]="3" />
        </div>
        <h2 class="page-loader-title">CM Notes</h2>
        <p class="page-loader-sub">Loading your workspace…</p>
      </div>
    </div>
  `,
  styles: `
    .page-loader {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
      animation: fadeIn 0.25s ease;
    }
    .page-loader-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .page-loader-logo {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      color: var(--accent);
    }
    .page-loader-logo app-spinner {
      position: absolute;
      inset: 0;
    }
    .page-loader-title {
      font-family: var(--font-title);
      font-size: 1.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--accent), #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }
    .page-loader-sub {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin: 0;
      animation: pulse-glow 1.6s ease-in-out infinite;
    }
  `,
})
export class PageLoaderComponent {}
