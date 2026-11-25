import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../core/models/task';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  readonly task = input<Task | null>(null);
  readonly markDone = output<string>();
}
