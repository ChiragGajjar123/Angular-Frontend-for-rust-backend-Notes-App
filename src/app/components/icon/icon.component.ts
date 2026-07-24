import { Component, input, computed } from '@angular/core';
import {
  LucideSparkles,
  LucideLogIn,
  LucideUserPlus,
  LucideUser,
  LucideMail,
  LucideLock,
  LucideAlertCircle,
  LucideCheckCircle,
  LucideAlertTriangle,
  LucideMenu,
  LucideSearch,
  LucideSun,
  LucideMoon,
  LucidePlus,
  LucideFileText,
  LucideTag,
  LucideLogOut,
  LucidePin,
  LucideTrash2,
  LucideCheck,
  LucideX,
} from '@lucide/angular';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [
    LucideSparkles,
    LucideLogIn,
    LucideUserPlus,
    LucideUser,
    LucideMail,
    LucideLock,
    LucideAlertCircle,
    LucideCheckCircle,
    LucideAlertTriangle,
    LucideMenu,
    LucideSearch,
    LucideSun,
    LucideMoon,
    LucidePlus,
    LucideFileText,
    LucideTag,
    LucideLogOut,
    LucidePin,
    LucideTrash2,
    LucideCheck,
    LucideX,
  ],
  template: `
    @switch (name()) {
      @case ('sparkles') { <svg lucideSparkles [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('log-in') { <svg lucideLogIn [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('user-plus') { <svg lucideUserPlus [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('user') { <svg lucideUser [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('mail') { <svg lucideMail [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('lock') { <svg lucideLock [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('alert-circle') { <svg lucideAlertCircle [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('check-circle') { <svg lucideCheckCircle [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('alert-triangle') { <svg lucideAlertTriangle [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('menu') { <svg lucideMenu [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('search') { <svg lucideSearch [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('sun') { <svg lucideSun [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('moon') { <svg lucideMoon [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('plus') { <svg lucidePlus [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('file-text') { <svg lucideFileText [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('tag') { <svg lucideTag [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('logout') { <svg lucideLogOut [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('pin') { <svg lucidePin [size]="size()" [color]="color()" [attr.fill]="fill()" [class]="className()"></svg> }
      @case ('trash-2') { <svg lucideTrash2 [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('check') { <svg lucideCheck [size]="size()" [color]="color()" [class]="className()"></svg> }
      @case ('x') { <svg lucideX [size]="size()" [color]="color()" [class]="className()"></svg> }
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
    }
    svg {
      display: inline-block;
      vertical-align: middle;
      flex-shrink: 0;
    }
  `,
})
export class IconComponent {
  name = input.required<string>();
  size = input<number>(20);
  color = input<string>('currentColor');
  fill = input<string>('none');
  class = input<string>('');

  className = computed(() => this.class());
}
