import { Component, inject } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { LucideAngularModule, Menu, Search, Sun, Moon, Plus } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SpinnerComponent, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  notes = inject(NotesService);
  readonly icons = { Menu, Search, Sun, Moon, Plus };
}
