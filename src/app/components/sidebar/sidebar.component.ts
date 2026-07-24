import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotesService } from '../../services/notes.service';
import { LucideAngularModule, Sparkles, X, FileText, Tag, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  auth = inject(AuthService);
  notes = inject(NotesService);
  private router = inject(Router);

  readonly icons = { Sparkles, X, FileText, Tag, LogOut };

  handleLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  getTagCount(tag: string): number {
    return this.notes.notes().filter((n) => (n.tags || []).includes(tag)).length;
  }
}
