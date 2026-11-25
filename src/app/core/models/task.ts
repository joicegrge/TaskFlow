export type TaskStatus = 'Open' | 'Done';

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  /** Date-only value in YYYY-MM-DD format. */
  readonly dueDate: string;
  readonly status: TaskStatus;
}
