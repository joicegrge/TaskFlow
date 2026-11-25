export type TaskStatus = 'Open' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  /** Date-only value in YYYY-MM-DD format. */
  dueDate: string;
  status: TaskStatus;
}
