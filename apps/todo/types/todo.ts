// Todo Schema Types

export type RecurrenceType = 'daily' | 'weekly' | 'custom';

export interface Recurrence {
  type: RecurrenceType;
  days?: number[]; // 0-6 for weekly
  time?: string; // HH:MM
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
}

export interface CreateProjectInput {
  name: string;
  emoji?: string;
  color?: string;
}

export interface UpdateTodoInput {
  todoId: string;
  completed?: boolean;
  currentTouches?: number;
}

export interface DeleteTodoInput {
  todoId: string;
}
