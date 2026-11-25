import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskStateService } from '../core/services/task-state.service';
@Component({ selector: 'app-edit-task-page', standalone: true, imports: [ReactiveFormsModule, RouterLink], templateUrl: './edit-task-page.component.html', styleUrl: './edit-task-page.component.scss' })
export class EditTaskPageComponent implements OnInit {
  readonly state = inject(TaskStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/.*\S.*/)] }),
    dueDate: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)] }),
    status: new FormControl<'Open' | 'Done'>('Open', { nonNullable: true }),
  });
  private taskId = '';
  async ngOnInit(): Promise<void> {
    this.taskId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.state.tasks().length === 0) await this.state.loadTasks();
    const task = this.state.tasks().find((item) => item.id === this.taskId);
    if (task) {
      this.form.setValue({ title: task.title, dueDate: task.dueDate, status: task.status });
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  }
  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.state.updateTask(this.taskId, this.form.getRawValue());
    this.form.markAsPristine();
    void this.router.navigate(['/tasks']);
  }
}
