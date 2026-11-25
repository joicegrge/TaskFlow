import { Component, inject } from '@angular/core';
import { TaskStateService } from '../core/services/task-state.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  readonly state = inject(TaskStateService);
}
