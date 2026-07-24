import { Component, inject, OnInit } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { NotesListComponent } from '../notes-list/notes-list.component';
import { NoteModalComponent } from '../note-modal/note-modal.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ToastComponent } from '../toast/toast.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    NotesListComponent,
    NoteModalComponent,
    ConfirmDialogComponent,
    ToastComponent,
    IconComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  notes = inject(NotesService);

  ngOnInit(): void {
    this.notes.initNotes();
  }
}
