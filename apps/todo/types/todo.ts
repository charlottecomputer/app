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
  dayOfMonth?: number;
  monthOfYear?: number;
}

export interface Subtask {
  subtaskId: string;
  taskId: string;
  content: string;
  completed: boolean;
  requiredTouches: number;
  currentTouches: number;
  createdAt: string;
  emoji?: string;
  unit?: string;
  color?: string;
  frequency?: number[]; // 0-6, where 0 is Sunday
}

export interface Task {
  userId: string;
  taskId: string; // Renamed from todoId
  content: string;
  completed: boolean;
  createdAt: string;

  // New fields
  projectId?: string;
  emoji?: string;
  recurrence?: Recurrence;
  dueDate?: string; // ISO date string
  priority?: Priority;
  reminders?: string[]; // ISO date strings
  type: 'task'; // Renamed from 'todo'

  // Subtasks are fetched separately or embedded
  subtasks?: Subtask[];
  lastCompletedAt?: string; // ISO date string
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
export type TodoItem = Task | Project;

// API Response Types
export interface TodosResponse {
  tasks: Task[];
  projects?: Project[];
  error?: string;
}

export interface TodoActionResponse {
  success: boolean;
  error?: string;
  data?: any;
}

// Input Types
export interface CreateTaskInput {
  content: string;
  projectId?: string;
  emoji?: string;
  recurrence?: Recurrence;
  dueDate?: string;
  priority?: Priority;
  reminders?: string[];
  subtasks?: { content: string; requiredTouches: number; emoji?: string }[];
}

export interface CreateProjectInput {
  name: string;
  emoji?: string;
  color?: string;
}

export interface UpdateTaskInput {
  taskId: string;
  content?: string;
  completed?: boolean;
  emoji?: string;
  projectId?: string;
  recurrence?: Recurrence;
  dueDate?: string;
  priority?: Priority;
  reminders?: string[];
}

export interface UpdateSubtaskInput {
  subtaskId: string;
  taskId: string;
  content?: string;
  completed?: boolean;
  currentTouches?: number;
  requiredTouches?: number;
  emoji?: string;
  unit?: string;
  color?: string;
  frequency?: number[];
}

export interface UpdateProjectInput {
  projectId: string;
  name?: string;
  emoji?: string;
  color?: string;
}

export interface DeleteTaskInput {
  taskId: string;
}
