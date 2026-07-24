import { Component, inject } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { OverlayLoaderComponent } from '../overlay-loader/overlay-loader.component';
import { NoteCardComponent } from '../note-card/note-card.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [OverlayLoaderComponent, NoteCardComponent, IconComponent],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css',
})
export class NotesListComponent {
  notes = inject(NotesService);
}
