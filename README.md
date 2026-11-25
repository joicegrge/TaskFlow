# TaskFlow — Angular 21 State Management Assessment

TaskFlow is a small task-management application built for a State Management assessment. It demonstrates Angular Signals, state ownership, URL-based state, shared state through services, and form state with Reactive Forms.

The application uses mock task data and has no backend.

## Project Overview

### Technologies

- Angular 21 and TypeScript
- Angular Signals
- Angular Router
- Angular Reactive Forms
- HTML and SCSS

### Features

- A shared top bar with the current username and overdue task count.
- A task dashboard with a loading state and approximately 10 mock tasks.
- Search by task title or description, stored in the URL query parameter `search`.
- All, Open, and Done status filters.
- Comfortable and compact task-list views.
- Task selection, highlighting, and a details panel.
- Mark as Done, with the overdue count recalculated from task status and due dates.
- An edit page with Reactive Forms validation and an unsaved-changes warning.
- A Settings page that shows the same username as the top bar.

## Project Structure

```text
TaskFlow/
├── angular.json
├── package.json
├── package-lock.json
├── README.md
└── src/
    ├── main.ts
    ├── styles.scss
    └── app/
        ├── app.ts
        ├── app.html
        ├── app.scss
        ├── app.config.ts
        ├── app.routes.ts
        ├── app.spec.ts
        ├── core/
        │   ├── models/task.ts
        │   └── services/
        │       ├── task.service.ts
        │       └── task-state.service.ts
        ├── layout/
        │   └── top-bar.component.{ts,html,scss}
        ├── tasks/
        │   ├── tasks-page.component.{ts,html,scss}
        │   ├── tasks-page.component.spec.ts
        │   ├── task-list.component.{ts,html,scss}
        │   └── task-details.component.{ts,html,scss}
        ├── edit-task/
        │   ├── edit-task-page.component.{ts,html,scss}
        │   └── unsaved-changes.guard.ts
        └── settings/
            └── settings-page.component.{ts,html,scss}
```

| Area | Responsibility |
|---|---|
| `core/models` | Task interface and status type. |
| `core/services` | Mock task provider and shared task/application state. |
| `layout` | Common top bar shown around routed pages. |
| `tasks` | Dashboard, task list, selection, and task details. |
| `edit-task` | Edit form and navigation guard for unsaved changes. |
| `settings` | User profile display. |
| `app.routes.ts` | Tasks, edit-task, and Settings routes. |

## A. How to Run the App

### Prerequisites

- Node.js and npm versions supported by Angular 21.
- A current project installation includes the Angular CLI as a local development dependency; a global CLI is not required.

Check the installed versions:

```bash
node --version
npm --version
npx ng version
```

### Install and start

From the TaskFlow project directory, install dependencies and start the development server:

```bash
npm install
npm start
```

Open `http://localhost:4200` in a browser. The development server watches source files and rebuilds when they change.

### Build and tests

Create a production build:

```bash
npm run build
```

Run the unit tests once:

```bash
npm test -- --watch=false
```

The project does not currently configure an end-to-end test target.

## B. State Management

The table uses the assessment’s state categories: **Local UI, URL, Server, Form, Shared, and Derived**.

| # | Data | Kind | Owner/location | Reason |
|---|---|---|---|---|
| 1 | Search text | URL | Tasks route query parameter `search` | The URL preserves the search across reloads and can be shared. |
| 2 | Selected status tab | Local UI | `TasksPageComponent` signal | Only the Tasks page needs the selected filter. |
| 3 | Compact view | Local UI | `TasksPageComponent` signal | It controls the task list presentation on this page. |
| 4 | Task list | Server | `TaskStateService` | This represents server-owned task data. The current app supplies it locally through `TaskService` mock data; there is no backend. |
| 5 | Selected task | Local UI | `TasksPageComponent` signal holding the selected ID | The page coordinates the list and details panel. The selected task object is derived from the ID and task list. |
| 6 | Unsaved form changes | Form | Reactive `FormGroup` in `EditTaskPageComponent` | The form’s built-in `dirty` property is used by the navigation guard. |
| 7 | Overdue count | Derived | `TaskStateService` `computed()` | It is calculated from due dates and status instead of being stored separately. |
| 8 | User’s name | Shared | Read-only signal in `TaskStateService` | The top bar and Settings page read the same value. |

### State ownership and update flow

`TaskStateService` keeps its writable task, loading, and username signals private and exposes read-only signal APIs with `asReadonly()`. Shared task updates go through service methods such as `markTaskDone()` and `updateTask()`; current components do not write to the service’s private signals.

`TaskService` returns 10 mock tasks after a 650 ms delay to demonstrate the loading state. `TaskStateService.overdueCount` is a `computed()` value: it counts tasks with a due date before today whose status is not Done. Marking a task Done or editing its date/status updates the task signal, which causes the computed count to recalculate.

The Tasks page observes the router’s query parameter map and derives the search text from it. Updating or clearing the search changes the URL. There is no separate writable search-text signal. The visible task list is computed from the tasks, URL search value, and selected status tab; it is not stored as another copy.

The selected tab, compact mode, and selected task ID are page-level signals. The details panel receives the selected task through an input. The edit page uses its Reactive Form’s built-in values, validation, and `dirty` state without additional form-tracking signals. No `effect()` is used to copy values between signals.

### Services and components

- **`TaskService`** supplies mock tasks after an artificial delay; it does not call a backend.
- **`TaskStateService`** owns shared task/loading state and the shared username. It exposes read-only signals, a computed overdue count, and methods for state updates.
- **`App`** renders the common top bar and router outlet.
- **`TopBarComponent`** reads the shared username and overdue count.
- **`TasksPageComponent`** owns page-only filters and selection, derives the visible tasks, and coordinates list actions with the service.
- **`TaskListComponent`** displays task rows and emits selection events.
- **`TaskDetailsComponent`** displays the selected task and emits the Mark as Done action; the page calls the service method.
- **`EditTaskPageComponent`** loads and saves task fields through the shared service and owns the Reactive Form.
- **`UnsavedChangesGuard`** checks `form.dirty` and asks for confirmation before navigation away from changed form data.
- **`SettingsPageComponent`** reads the same username signal used by the top bar.

## C. Problems in the Supplied Code and How TaskFlow Avoids Them

The assessment’s code-review snippet is separate from the TaskFlow source.

### 1. Public writable signals

**Problem:** Public writable signals let any consumer of the service change shared state directly, weakening clear state ownership.

**TaskFlow:** Writable signals in `TaskStateService` are private and exposed through `asReadonly()`. Components request changes through service methods.

### 2. Storing a derived overdue count

**Problem:** Storing `overdueCount` separately from tasks duplicates information and risks leaving the count out of sync after a task update.

**TaskFlow:** The overdue count is computed from the task list, due date, and status. There is no separate overdue-count signal.

### 3. Copying state with an effect

**Problem:** Creating a component signal and using `effect()` to copy a service value creates duplicate state and synchronization work.

**TaskFlow:** The top bar reads the service’s read-only computed count directly. It does not create a local copy or use an effect for synchronization.

## Implementation Notes

- Routes: `/tasks`, `/tasks/:id/edit`, and `/settings`.
- Task status is represented by the `TaskStatus` type: `Open` or `Done`.
- Task due dates use the `YYYY-MM-DD` date-only format.
- Search is URL state; tabs, compact mode, and selection are Local UI state.
- The app has no backend, NgRx, or RxJS Subjects for state management.

## Conclusion

TaskFlow demonstrates state ownership with Angular Signals: page-only state remains local, search lives in the URL, shared task and username data live in a root service, form state stays in the Reactive Form, and derived values use `computed()`. This avoids separately stored calculated values and unnecessary signal synchronization.
