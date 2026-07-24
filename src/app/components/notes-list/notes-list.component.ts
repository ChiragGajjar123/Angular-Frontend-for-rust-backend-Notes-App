import { Component, inject } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { OverlayLoaderComponent } from '../overlay-loader/overlay-loader.component';
import { NoteCardComponent } from '../note-card/note-card.component';
import { LucideAngularModule, FileText, Plus, Pin } from 'lucide-angular';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [OverlayLoaderComponent, NoteCardComponent, LucideAngularModule],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css',
})
export class NotesListComponent {
  notes = inject(NotesService);
  readonly icons = { FileText, Plus, Pin };
}
