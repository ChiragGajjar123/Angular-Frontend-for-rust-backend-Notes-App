import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

export interface NoteForm {
  title: string;
  content: string;
  tags: string[];
  color: string;
  pinned: boolean;
}

export interface Toast {
  id: number;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export interface ConfirmState {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private router = inject(Router);
  private auth = inject(AuthService);
  private api = inject(ApiService);

  // Notes state
  readonly notes = signal<any[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string>('');

  // Busy sets
  readonly pinningIds = signal<Set<string>>(new Set());
  readonly deletingIds = signal<Set<string>>(new Set());
  readonly modalSaving = signal<boolean>(false);
  readonly themeSaving = signal<boolean>(false);

  // Mobile sidebar
  readonly isSidebarOpen = signal<boolean>(false);

  // Filter & Search
  readonly searchQuery = signal<string>('');
  readonly selectedTag = signal<string | null>(null);

  // Modal state
  readonly isModalOpen = signal<boolean>(false);
  readonly editingNote = signal<any | null>(null);
  readonly noteForm = signal<NoteForm>({
    title: '',
    content: '',
    tags: [],
    color: 'slate',
    pinned: false,
  });
  readonly tagInput = signal<string>('');

  // Confirm dialog state
  readonly confirmState = signal<ConfirmState>({
    visible: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  // Toast state
  readonly toasts = signal<Toast[]>([]);
  private toastIdCounter = 0;

  // Track initialization
  private initialized = false;

  // Computed: isDarkMode (delegate to auth)
  readonly isDarkMode = this.auth.isDarkMode;

  // Computed: filtered notes
  readonly filteredNotes = computed(() => {
    return this.notes().filter((note) => {
      const tag = this.selectedTag();
      const matchesTag = tag ? (note.tags || []).includes(tag) : true;
      const q = this.searchQuery().trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        (note.tags || []).some((t: string) => t.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    });
  });

  // Computed: unique tags
  readonly allTags = computed(() => {
    return Array.from(new Set(this.notes().flatMap((note) => note.tags || []))).sort();
  });

  // Computed: pinned and other
  readonly pinnedNotes = computed(() => this.filteredNotes().filter((n) => n.pinned));
  readonly otherNotes = computed(() => this.filteredNotes().filter((n) => !n.pinned));

  constructor() {
    // Watch for user changes
    effect(() => {
      const userId = this.auth.user()?.id;
      if (userId && !this.initialized) {
        this.initialized = true;
        this.fetchNotes();
      }
      if (!userId) {
        this.notes.set([]);
        this.initialized = false;
      }
    });
  }

  // Toast helper
  showToast(message: string, type: 'error' | 'success' | 'warning' = 'error'): void {
    const id = ++this.toastIdCounter;
    this.toasts.update((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      this.toasts.update((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }

  dismissToast(id: number): void {
    this.toasts.update((prev) => prev.filter((t) => t.id !== id));
  }

  // Confirm dialog helper
  showConfirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmState.set({
        visible: true,
        title,
        message,
        onConfirm: () => {
          this.confirmState.update((s) => ({ ...s, visible: false }));
          resolve(true);
        },
        onCancel: () => {
          this.confirmState.update((s) => ({ ...s, visible: false }));
          resolve(false);
        },
      });
    });
  }

  private handleUnauthorized(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // Toggle theme
  async toggleTheme(): Promise<void> {
    if (this.themeSaving()) return;
    this.themeSaving.set(true);
    try {
      await this.auth.updateTheme(this.isDarkMode() ? 'light' : 'dark');
    } finally {
      this.themeSaving.set(false);
    }
  }

  // Select tag filter
  handleSelectTag(tag: string | null): void {
    this.selectedTag.set(tag);
    this.isSidebarOpen.set(false);
  }

  // Fetch notes
  async fetchNotes(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const data = await this.api.getNotes();
      this.notes.set(data);
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') {
        this.handleUnauthorized();
      } else {
        this.error.set('Could not load notes. Please verify your database connection.');
      }
    } finally {
      this.loading.set(false);
    }
  }

  // Initialize notes — called once from Dashboard
  initNotes(): void {
    if (this.auth.user() && !this.initialized) {
      this.initialized = true;
      this.fetchNotes();
    }
  }

  // Pin / Unpin toggle
  async handleTogglePin(event: Event, note: any): Promise<void> {
    event.stopPropagation();
    const ids = this.pinningIds();
    if (ids.has(note.id)) return;
    this.pinningIds.update((s) => {
      const ns = new Set(s);
      ns.add(note.id);
      return ns;
    });
    try {
      const updated = { ...note, pinned: !note.pinned };
      const result = await this.api.updateNote(note.id, updated);
      this.notes.update((prev) => prev.map((n) => (n.id === note.id ? result : n)));
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') {
        this.handleUnauthorized();
      } else {
        this.error.set('Failed to update pin status.');
      }
    } finally {
      this.pinningIds.update((s) => {
        const ns = new Set(s);
        ns.delete(note.id);
        return ns;
      });
    }
  }

  // Open Create Modal
  handleOpenCreateModal(): void {
    this.editingNote.set(null);
    this.noteForm.set({
      title: '',
      content: '',
      tags: [],
      color: 'slate',
      pinned: false,
    });
    this.tagInput.set('');
    this.isModalOpen.set(true);
  }

  // Open Edit Modal
  handleOpenEditModal(note: any): void {
    this.editingNote.set(note);
    this.noteForm.set({
      title: note.title,
      content: note.content,
      tags: [...(note.tags || [])],
      color: note.color || 'slate',
      pinned: note.pinned || false,
    });
    this.tagInput.set('');
    this.isModalOpen.set(true);
  }

  // Delete Note — uses ConfirmDialog
  async handleDeleteNote(event: Event, id: string): Promise<void> {
    event.stopPropagation();
    const confirmed = await this.showConfirm(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.'
    );
    if (!confirmed) return;
    const ids = this.deletingIds();
    if (ids.has(id)) return;
    this.deletingIds.update((s) => {
      const ns = new Set(s);
      ns.add(id);
      return ns;
    });
    try {
      await this.api.deleteNote(id);
      this.notes.update((prev) => prev.filter((n) => n.id !== id));
      this.showToast('Note deleted successfully.', 'success');
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') {
        this.handleUnauthorized();
      } else {
        this.showToast('Failed to delete the note.', 'error');
      }
    } finally {
      this.deletingIds.update((s) => {
        const ns = new Set(s);
        ns.delete(id);
        return ns;
      });
    }
  }

  // Form Submit
  async handleFormSubmit(): Promise<void> {
    const form = this.noteForm();
    if (!form.title.trim() && !form.content.trim()) {
      this.showToast('Note cannot be completely empty.', 'warning');
      return;
    }
    this.modalSaving.set(true);
    try {
      const payload = {
        title: form.title,
        content: form.content,
        tags: form.tags,
        color: form.color,
        pinned: form.pinned,
      };
      const editing = this.editingNote();
      if (editing) {
        const result = await this.api.updateNote(editing.id, payload);
        this.notes.update((prev) => prev.map((n) => (n.id === editing.id ? result : n)));
        this.showToast('Note updated successfully.', 'success');
      } else {
        const result = await this.api.createNote(payload);
        this.notes.update((prev) =>
          [result, ...prev].sort((a, b) => {
            if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          })
        );
        this.showToast('Note created successfully.', 'success');
      }
      this.isModalOpen.set(false);
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') {
        this.handleUnauthorized();
      } else {
        this.showToast('Failed to save the note.', 'error');
      }
    } finally {
      this.modalSaving.set(false);
    }
  }

  // Tag helpers
  handleAddTag(): void {
    const trimmed = this.tagInput().trim().toLowerCase();
    if (trimmed && !this.noteForm().tags.includes(trimmed)) {
      this.noteForm.update((f) => ({ ...f, tags: [...f.tags, trimmed] }));
    }
    this.tagInput.set('');
  }

  handleRemoveTag(tagToRemove: string): void {
    this.noteForm.update((f) => ({
      ...f,
      tags: f.tags.filter((t) => t !== tagToRemove),
    }));
  }

  // Format date
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
