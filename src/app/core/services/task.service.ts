import { Injectable } from '@angular/core';
import { Task } from '../models/task';

const MOCK_TASKS: Task[] = [
  { id: 'task-001', title: 'Prepare quarterly report', description: 'Compile team metrics and summarize the quarter for the leadership review.', dueDate: '2026-11-18', status: 'Open' },
  { id: 'task-002', title: 'Review vendor contract', description: 'Check renewal terms and send comments to the procurement team.', dueDate: '2026-11-22', status: 'Open' },
  { id: 'task-003', title: 'Update onboarding guide', description: 'Add the new account setup steps and links for incoming teammates.', dueDate: '2026-11-27', status: 'Open' },
  { id: 'task-004', title: 'Schedule design review', description: 'Find a time with product and design to review the updated flow.', dueDate: '2026-11-29', status: 'Open' },
  { id: 'task-005', title: 'Send project status email', description: 'Share this week’s milestones, open questions, and next steps.', dueDate: '2026-11-24', status: 'Done' },
  { id: 'task-006', title: 'Approve expense receipts', description: 'Review submitted travel and team expense receipts.', dueDate: '2026-11-25', status: 'Open' },
  { id: 'task-007', title: 'Draft customer survey', description: 'Write a short post-launch survey for the latest release.', dueDate: '2026-12-03', status: 'Open' },
  { id: 'task-008', title: 'Back up shared drive', description: 'Archive the current project folder and verify the backup.', dueDate: '2026-11-20', status: 'Done' },
  { id: 'task-009', title: 'Plan team retrospective', description: 'Collect discussion points and prepare the retrospective board.', dueDate: '2026-12-05', status: 'Open' },
  { id: 'task-010', title: 'Confirm workshop attendees', description: 'Check registrations and send the final attendee list.', dueDate: '2026-11-21', status: 'Open' },
];

@Injectable({ providedIn: 'root' })
export class TaskService {
  async getTasks(): Promise<Task[]> {
    await new Promise((resolve) => setTimeout(resolve, 650));
    return MOCK_TASKS.map((task) => ({ ...task }));
  }
}
