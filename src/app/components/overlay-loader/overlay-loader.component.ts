import { Component, Input } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-overlay-loader',
  standalone: true,
  imports: [SpinnerComponent],
  template: `
    <div class="overlay-loader" role="status" aria-live="polite">
      <app-spinner [size]="40" color="var(--accent)" [thickness]="3" />
      @if (label) {
        <span class="overlay-loader-label">{{ label }}</span>
      }
    </div>
  `,
  styles: `
    .overlay-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 80px 20px;
      width: 100%;
      animation: fadeIn 0.2s ease;
    }
    .overlay-loader-label {
      font-size: 0.9rem;
      color: var(--text-secondary);
      animation: pulse-glow 1.4s ease-in-out infinite;
    }
  `,
})
export class OverlayLoaderComponent {
  @Input() label = 'Loading…';
}
