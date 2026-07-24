import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      [attr.viewBox]="'0 0 ' + size + ' ' + size"
      fill="none"
      class="spinner-svg"
      aria-label="Loading"
      role="status"
    >
      <circle
        [attr.cx]="size / 2"
        [attr.cy]="size / 2"
        [attr.r]="r"
        [attr.stroke]="color"
        [attr.stroke-width]="thickness"
        opacity="0.15"
      />
      <circle
        [attr.cx]="size / 2"
        [attr.cy]="size / 2"
        [attr.r]="r"
        [attr.stroke]="color"
        [attr.stroke-width]="thickness"
        [attr.stroke-dasharray]="dashArray"
        stroke-linecap="round"
        class="spinner-arc"
      />
    </svg>
  `,
  styles: `
    .spinner-svg {
      display: inline-block;
      flex-shrink: 0;
      vertical-align: middle;
    }
    .spinner-arc {
      transform-origin: center;
      animation: spin 0.75s linear infinite;
    }
  `,
})
export class SpinnerComponent {
  @Input() size = 20;
  @Input() color = 'currentColor';
  @Input() thickness = 2.5;

  get r(): number {
    return (this.size - this.thickness * 2) / 2;
  }

  get dashArray(): string {
    const circ = 2 * Math.PI * this.r;
    return `${circ * 0.75} ${circ * 0.25}`;
  }
}
