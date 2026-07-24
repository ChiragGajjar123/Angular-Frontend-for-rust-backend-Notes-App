import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { LucideAngularModule, UserPlus, User, Mail, Lock, AlertCircle, CheckCircle, Sparkles } from 'lucide-angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, SpinnerComponent, LucideAngularModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly icons = { UserPlus, User, Mail, Lock, AlertCircle, CheckCircle, Sparkles };

  username = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  error = signal('');
  success = signal('');
  loading = signal(false);

  async handleSubmit(): Promise<void> {
    this.error.set('');
    this.success.set('');

    if (!this.username().trim() || !this.email().trim() || !this.password() || !this.confirmPassword()) {
      this.error.set('Please fill in all fields.');
      return;
    }
    if (this.username().trim().length < 3) {
      this.error.set('Username must be at least 3 characters.');
      return;
    }
    if (this.username().trim().length > 100) {
      this.error.set('Username must not exceed 100 characters.');
      return;
    }
    if (this.password().length < 6) {
      this.error.set('Password must be at least 6 characters.');
      return;
    }
    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    try {
      await this.auth.signup(this.username().trim(), this.email().trim(), this.password());
      this.success.set('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    } catch (err: any) {
      this.error.set(err.message || 'Registration failed. Try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
