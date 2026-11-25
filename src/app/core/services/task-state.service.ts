import { computed, Injectable, signal } from '@angular/core';
import { Task } from '../models/task';
import { TaskService } from './task.service';

@Injectable({ providedIn: 'root' })
export class TaskStateService {
  private readonly tasksState = signal<ReadonlyArray<Task>>([]);
  private readonly loadingState = signal(false);
  private readonly userNameState = signal('Jordan Lee');

  readonly tasks = this.tasksState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly userName = this.userNameState.asReadonly();

  readonly overdueCount = computed(() => {
    const today = this.localDateString(new Date());
    return this.tasksState().filter((task) => task.status !== 'Done' && task.dueDate < today).length;
  });

  constructor(private readonly taskService: TaskService) {}

  async loadTasks(): Promise<void> {
    this.loadingState.set(true);
    try {
      const loadedTasks = await this.taskService.getTasks();
      this.tasksState.set(loadedTasks.map((task) => ({ ...task })));
    } finally {
      this.loadingState.set(false);
    }
  }

  markTaskDone(id: string): void {
    this.updateTask(id, { status: 'Done' });
  }

  updateTask(id: string, changes: Partial<Pick<Task, 'title' | 'dueDate' | 'status'>>): void {
    this.tasksState.update((tasks) => tasks.map((task) => task.id === id ? { ...task, ...changes } : task));
  }

  private localDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
