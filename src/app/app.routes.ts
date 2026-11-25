import { Routes } from '@angular/router';
import { EditTaskPageComponent } from './edit-task/edit-task-page.component';
import { unsavedChangesGuard } from './edit-task/unsaved-changes.guard';
import { SettingsPageComponent } from './settings/settings-page.component';
import { TasksPageComponent } from './tasks/tasks-page.component';

export const routes: Routes = [
  { path: 'tasks', component: TasksPageComponent },
  { path: 'tasks/:id/edit', component: EditTaskPageComponent, canDeactivate: [unsavedChangesGuard] },
  { path: 'settings', component: SettingsPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: '**', redirectTo: 'tasks' },
];
