import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskStateService } from '../core/services/task-state.service';
import { TaskStatus } from '../core/models/task';
import { TaskDetailsComponent } from './task-details.component';
import { TaskListComponent } from './task-list.component';

type StatusTab = 'All' | TaskStatus;

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [TaskListComponent, TaskDetailsComponent],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
})
export class TasksPageComponent implements OnInit {
  readonly state = inject(TaskStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  // Keep the router's parameter map as the reactive source. Search text itself
  // is always read from the URL and is never copied into local writable state.
  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly searchText = computed(() => this.queryParams().get('search') ?? '');
  readonly selectedTab = signal<StatusTab>('All');
  readonly compactView = signal(false);
  readonly selectedTaskId = signal<string | null>(null);
  readonly selectedTask = computed(() => this.state.tasks().find((task) => task.id === this.selectedTaskId()) ?? null);

  readonly visibleTasks = computed(() => {
    const search = this.searchText().trim().toLocaleLowerCase();
    const tab = this.selectedTab();

    return this.state.tasks().filter((task) => {
      const matchesSearch = !search || `${task.title} ${task.description}`.toLocaleLowerCase().includes(search);
      const matchesStatus = tab === 'All' || task.status === tab;
      return matchesSearch && matchesStatus;
    });
  });

  readonly openCount = computed(() => this.state.tasks().filter((task) => task.status === 'Open').length);
  readonly doneCount = computed(() => this.state.tasks().filter((task) => task.status === 'Done').length);

  ngOnInit(): void {
    if (this.state.tasks().length === 0 && !this.state.isLoading()) void this.state.loadTasks();
  }

  updateSearch(value: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: value || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  setTab(tab: StatusTab): void {
    this.selectedTab.set(tab);
  }

  toggleCompactView(): void {
    this.compactView.update((compact) => !compact);
  }

  selectTask(id: string): void { this.selectedTaskId.set(id); }

  markTaskDone(id: string): void {
    this.state.markTaskDone(id);
  }
}
