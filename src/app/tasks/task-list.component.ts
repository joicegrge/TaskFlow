import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '../core/models/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly tasks = input.required<Task[]>();
  readonly selectedTaskId = input<string | null>(null);
  readonly compact = input(false);
  readonly taskSelected = output<string>();

  isOverdue(task: Task): boolean {
    if (task.status === 'Done') return false;
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return task.dueDate < todayString;
  }
}
