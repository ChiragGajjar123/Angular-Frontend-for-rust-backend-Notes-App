import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const API_URL = (environment.apiUrl || '/api').replace(/\/+$/, '');

const getHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('notes_app_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const parseResponse = async (res: Response): Promise<any> => {
  let data = null;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // Not a JSON response
  }
  return data;
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  // Auth API
  async login(email: string, password: string): Promise<any> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseResponse(res);
    if (!res.ok) throw new Error((data && data.message) || 'Login failed');
    return data;
  }

  async signup(username: string, email: string, password: string): Promise<any> {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await parseResponse(res);
    if (!res.ok) throw new Error((data && data.message) || 'Signup failed');
    return data;
  }

  // User Configurations API
  async updateTheme(theme: string): Promise<any> {
    const res = await fetch(`${API_URL}/users/theme`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ theme }),
    });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    const data = await parseResponse(res);
    if (!res.ok) throw new Error('Failed to update theme');
    return data;
  }

  // Notes API
  async getNotes(): Promise<any> {
    const res = await fetch(`${API_URL}/notes`, {
      headers: getHeaders(),
    });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    const data = await parseResponse(res);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return data;
  }

  async createNote(note: any): Promise<any> {
    const res = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(note),
    });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    const data = await parseResponse(res);
    if (!res.ok) throw new Error('Failed to create note');
    return data;
  }

  async updateNote(id: string, note: any): Promise<any> {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(note),
    });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    const data = await parseResponse(res);
    if (!res.ok) throw new Error('Failed to update note');
    return data;
  }

  async deleteNote(id: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    if (!res.ok) throw new Error('Failed to delete note');
    return true;
  }
}
