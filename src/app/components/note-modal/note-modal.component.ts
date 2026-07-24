import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [FormsModule, SpinnerComponent, IconComponent],
  templateUrl: './note-modal.component.html',
  styleUrl: './note-modal.component.css',
})
export class NoteModalComponent {
  notes = inject(NotesService);
  readonly colors = ['slate', 'blue', 'green', 'yellow', 'purple', 'rose'];

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.notes.handleAddTag();
    }
  }

  setColor(color: string): void {
    if (!this.notes.modalSaving()) {
      this.notes.noteForm.update((f) => ({ ...f, color }));
    }
  }

  updateFormField(field: string, value: any): void {
    this.notes.noteForm.update((f) => ({ ...f, [field]: value }));
  }
}
