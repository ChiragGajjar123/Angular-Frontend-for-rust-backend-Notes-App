import { Component, Input, inject } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { LucideAngularModule, Pin, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [SpinnerComponent, LucideAngularModule],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.css',
})
export class NoteCardComponent {
  @Input({ required: true }) note!: any;

  notes = inject(NotesService);
  readonly icons = { Pin, Trash2 };

  get isPinning(): boolean {
    return this.notes.pinningIds().has(this.note.id);
  }

  get isDeleting(): boolean {
    return this.notes.deletingIds().has(this.note.id);
  }
}
