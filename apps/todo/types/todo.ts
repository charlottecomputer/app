// Todo Schema Types

export type RecurrenceType = 'daily' | 'weekly' | 'weekdays' | 'monthly' | 'yearly' | 'custom';
export type RecurrenceUnit = 'day' | 'week' | 'month' | 'year';
export type RecurrenceBasis = 'scheduled' | 'completed';
export type Priority = 'low' | 'medium' | 'high';

export interface Recurrence {
  type: RecurrenceType;
  interval?: number;
  unit?: RecurrenceUnit;
  days?: number[]; // 0-6 for weekly (0 = Sunday)
  basis?: RecurrenceBasis; // Default to 'scheduled'
  endDate?: string; // ISO date string, if null/undefined then "Never"
  // For monthly/yearly "on the 4th Sunday" type logic, we might need more fields, 
  // but for now let's stick to simple day of month or specific date.
  dayOfMonth?: number;
  monthOfYear?: number;
}

export interface Todo {
  userId: string;
  todoId: string;
  content: string;
  completed: boolean;
  createdAt: string;

  // New fields
  projectId?: string;
  requiredTouches?: number;
  currentTouches?: number;
  emoji?: string;
  recurrence?: Recurrence;
  dueDate?: string; // ISO date string
  priority?: Priority;
  reminders?: string[]; // ISO date strings
  type?: 'todo'; // To distinguish from projects if needed
}

export interface Project {
  userId: string;
  projectId: string; // stored as todoId in DynamoDB with prefix or just ID
  name: string;
  emoji?: string;
  color?: string;
  createdAt: string;
  type: 'project';
}

// Union type for items returned from DB
export type TodoItem = Todo | Project;

// API Response Types
export interface TodosResponse {
  todos: Todo[];
  projects?: Project[];
  error?: string;
}

export interface TodoActionResponse {
  success: boolean;
  error?: string;
}

// Input Types
export interface CreateTodoInput {
  content: string;
  projectId?: string;
  requiredTouches?: number;
  emoji?: string;
  recurrence?: Recurrence;
  dueDate?: string;
  priority?: Priority;
  reminders?: string[];
}

export interface CreateProjectInput {
  name: string;
  emoji?: string;
  color?: string;
}

export interface UpdateTodoInput {
  todoId: string;
  content?: string;
  completed?: boolean;
  currentTouches?: number;
  requiredTouches?: number;
  emoji?: string;
  projectId?: string;
  recurrence?: Recurrence;
  dueDate?: string;
  priority?: Priority;
  reminders?: string[];
}

export interface UpdateProjectInput {
  projectId: string;
  name?: string;
  emoji?: string;
  color?: string;
}

export interface DeleteTodoInput {
  todoId: string;
}
