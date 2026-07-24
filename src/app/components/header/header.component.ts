import { Component, inject } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SpinnerComponent, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  notes = inject(NotesService);
}
