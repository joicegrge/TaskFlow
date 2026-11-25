import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Task } from '../core/models/task';
import { TaskService } from '../core/services/task.service';
import { TaskStateService } from '../core/services/task-state.service';
import { TasksPageComponent } from './tasks-page.component';

const TEST_TASKS: Task[] = [
  { id: 'past-open', title: 'Review release plan', description: 'Prepare notes for the launch review.', dueDate: '2026-11-24', status: 'Open' },
  { id: 'next-open', title: 'Draft handbook', description: 'Review onboarding materials.', dueDate: '2026-11-28', status: 'Open' },
  { id: 'done', title: 'Prepare meeting agenda', description: 'Share the agenda with the team.', dueDate: '2026-11-20', status: 'Done' },
];

describe('TasksPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'tasks', component: TasksPageComponent }]),
        { provide: TaskService, useValue: { getTasks: async () => TEST_TASKS } },
      ],
    }).compileComponents();
  });

  it('restores search from the URL, filters title and description, and removes the query when cleared', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/tasks?search=onboarding', TasksPageComponent);
    await harness.fixture.whenStable();

    expect(component.searchText()).toBe('onboarding');
    expect(component.visibleTasks().map((task) => task.id)).toEqual(['next-open']);

    component.updateSearch('release');
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/tasks?search=release');
    expect(component.visibleTasks().map((task) => task.id)).toEqual(['past-open']);

    component.updateSearch('');
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/tasks');
    expect(component.visibleTasks().length).toBe(3);
  });

  it('filters by status and toggles compact rows while keeping selection and details aligned', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/tasks', TasksPageComponent);
    await harness.fixture.whenStable();

    expect(component.visibleTasks().length).toBe(3);
    component.setTab('Open');
    expect(component.visibleTasks().map((task) => task.status)).toEqual(['Open', 'Open']);
    component.setTab('Done');
    expect(component.visibleTasks().map((task) => task.id)).toEqual(['done']);
    component.setTab('All');

    component.toggleCompactView();
    component.selectTask('past-open');
    harness.detectChanges();

    const element = harness.fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.task-row.compact')).not.toBeNull();
    expect(element.querySelector('.task-row.selected .task-title')?.textContent?.trim()).toBe('Review release plan');
    expect(element.querySelector('.details-panel h2')?.textContent?.trim()).toBe('Review release plan');
  });

  it('derives overdue count from open task dates and excludes completed tasks', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/tasks', TasksPageComponent);
    await harness.fixture.whenStable();

    const state = TestBed.inject(TaskStateService);
    expect(state.overdueCount()).toBe(1);
    state.markTaskDone('past-open');
    expect(state.overdueCount()).toBe(0);
  });
});
