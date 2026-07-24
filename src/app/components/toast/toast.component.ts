import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule, AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  @Input() toasts: any[] = [];
  @Output() dismiss = new EventEmitter<number>();

  readonly icons = { AlertCircle, CheckCircle, AlertTriangle, X };

  getIcon(type: string) {
    switch (type) {
      case 'success':
        return this.icons.CheckCircle;
      case 'warning':
        return this.icons.AlertTriangle;
      default:
        return this.icons.AlertCircle;
    }
  }
}
