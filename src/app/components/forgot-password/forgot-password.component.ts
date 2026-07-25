import { Component, inject, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink, SpinnerComponent, IconComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Form step: 1 = Request Code, 2 = Verify Code, 3 = New Password, 4 = Success
  step = signal<1 | 2 | 3 | 4>(1);

  email = signal('');
  code = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  error = signal('');
  info = signal('');
  loading = signal(false);

  // Rate limit cooldown timer (in seconds)
  cooldown = signal(0);
  private timer: any = null;

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private startCooldown(seconds: number = 60): void {
    this.cooldown.set(seconds);
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.cooldown() > 1) {
        this.cooldown.update((v) => v - 1);
      } else {
        this.cooldown.set(0);
        clearInterval(this.timer);
        this.timer = null;
      }
    }, 1000);
  }

  async handleRequestCode(): Promise<void> {
    this.error.set('');
    this.info.set('');
    if (!this.email().trim()) {
      this.error.set('Please enter your email address.');
      return;
    }

    this.loading.set(true);
    try {
      const res = await this.auth.forgotPassword(this.email().trim());
      this.info.set(res.message || 'Verification code sent to your email.');
      this.step.set(2);
      this.startCooldown(60);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to send reset code.');
    } finally {
      this.loading.set(false);
    }
  }

  async handleResendCode(): Promise<void> {
    if (this.cooldown() > 0 || this.loading()) return;
    await this.handleRequestCode();
  }

  async handleVerifyCode(): Promise<void> {
    this.error.set('');
    this.info.set('');
    if (!this.code().trim()) {
      this.error.set('Please enter the 6-digit verification code.');
      return;
    }

    this.loading.set(true);
    try {
      await this.auth.verifyResetCode(this.email().trim(), this.code().trim());
      this.info.set('Code verified! Set your new password below.');
      this.step.set(3);
    } catch (err: any) {
      this.error.set(err.message || 'Invalid or expired code.');
    } finally {
      this.loading.set(false);
    }
  }

  async handleResetPassword(): Promise<void> {
    this.error.set('');
    this.info.set('');

    if (!this.newPassword() || !this.confirmPassword()) {
      this.error.set('Please enter and confirm your new password.');
      return;
    }
    if (this.newPassword().length < 6) {
      this.error.set('Password must be at least 6 characters long.');
      return;
    }
    if (this.newPassword() !== this.confirmPassword()) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    try {
      const res = await this.auth.resetPassword(
        this.email().trim(),
        this.code().trim(),
        this.newPassword()
      );
      this.info.set(res.message || 'Password reset successfully.');
      this.step.set(4);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to reset password.');
    } finally {
      this.loading.set(false);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
