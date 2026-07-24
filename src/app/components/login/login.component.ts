import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, SpinnerComponent, IconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  async handleSubmit(): Promise<void> {
    this.error.set('');
    if (!this.email().trim() || !this.password().trim()) {
      this.error.set('Please fill in all fields.');
      return;
    }
    this.loading.set(true);
    try {
      await this.auth.login(this.email().trim(), this.password());
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error.set(err.message || 'Invalid email or password.');
    } finally {
      this.loading.set(false);
    }
  }
}
