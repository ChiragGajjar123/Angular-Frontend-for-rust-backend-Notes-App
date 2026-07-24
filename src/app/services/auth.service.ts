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

  async login(email: string, password: string): Promise<any> {
    const data = await this.api.login(email, password);
    const userProfile: UserProfile = {
      id: data.id,
      username: data.username,
      email: data.email,
      theme: data.theme || 'light',
    };
    localStorage.setItem('notes_app_token', data.accessToken);
    localStorage.setItem('notes_app_user', JSON.stringify(userProfile));
    this.user.set(userProfile);
    return data;
  }

  async signup(username: string, email: string, password: string): Promise<any> {
    return await this.api.signup(username, email, password);
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
