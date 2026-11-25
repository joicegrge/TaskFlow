import { CanDeactivateFn } from '@angular/router';
import { EditTaskPageComponent } from './edit-task-page.component';
export const unsavedChangesGuard: CanDeactivateFn<EditTaskPageComponent> = (component) =>
  !component.form.dirty || window.confirm('You have unsaved changes. Leave this page?');
