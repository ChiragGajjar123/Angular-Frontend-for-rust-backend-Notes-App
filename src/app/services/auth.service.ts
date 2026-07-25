import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  theme: 'light' | 'dark';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<UserProfile | null>(null);
  readonly loading = signal<boolean>(true);
  readonly isDarkMode = computed(() => this.user()?.theme === 'dark');

  constructor(private api: ApiService) {
    // Initialize from localStorage on service creation
    const storedUser = localStorage.getItem('notes_app_user');
    const token = localStorage.getItem('notes_app_token');
    if (storedUser && token) {
      try {
        this.user.set(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('notes_app_user');
        localStorage.removeItem('notes_app_token');
      }
    }
    this.loading.set(false);
  }

  private handleAuthResponse(data: any): UserProfile {
    const token = data.access_token || data.accessToken;
    const userObj = data.user || data;

    const userProfile: UserProfile = {
      id: userObj.id,
      username: userObj.username,
      email: userObj.email,
      theme: userObj.theme || 'light',
    };

    if (token) {
      localStorage.setItem('notes_app_token', token);
      localStorage.setItem('notes_app_user', JSON.stringify(userProfile));
      this.user.set(userProfile);
    }

    return userProfile;
  }

  async login(email: string, password: string): Promise<any> {
    const data = await this.api.login(email, password);
    this.handleAuthResponse(data);
    return data;
  }

  async signup(username: string, email: string, password: string): Promise<any> {
    const data = await this.api.signup(username, email, password);
    this.handleAuthResponse(data);
    return data;
  }

  async forgotPassword(email: string): Promise<any> {
    return await this.api.forgotPassword(email);
  }

  async verifyResetCode(email: string, code: string): Promise<any> {
    return await this.api.verifyResetCode(email, code);
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<any> {
    return await this.api.resetPassword(email, code, newPassword);
  }

  async updateTheme(newTheme: 'light' | 'dark'): Promise<void> {
    try {
      await this.api.updateTheme(newTheme);
      const current = this.user();
      if (current) {
        const updatedUser = { ...current, theme: newTheme };
        localStorage.setItem('notes_app_user', JSON.stringify(updatedUser));
        this.user.set(updatedUser);
      }
    } catch (err) {
      console.error('Failed to sync theme preference with backend:', err);
    }
  }

  logout(): void {
    localStorage.removeItem('notes_app_token');
    localStorage.removeItem('notes_app_user');
    this.user.set(null);
  }
}
