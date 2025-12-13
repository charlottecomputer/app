// KeyResult Schema Types

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



export interface KeyResult {
  userId: string;
  keyResultId: string;
  content: string;
  completed: boolean;
  createdAt: string;
  requiredTouches: number;
  currentTouches: number;
  emoji?: string;
  unit?: string;
  color?: string;
  // New fields
  projectId?: string;
  icon?: string;
  recurrence?: Recurrence;
  dueDate?: string; // ISO date string
  priority?: Priority;
  reminders?: string[]; // ISO date strings
  type: 'task'; // Renamed from 'todo'

  // Subtasks are fetched separately or embedded
  frequency?: number[]; // 0-6, where 0 is Sunday

  lastCompletedAt?: string; // ISO date string
}

export interface Objective {
  userId: string;
  projectId: string; // stored as todoId in DynamoDB with prefix or just ID
  name: string;
  icon?: string;
  color?: string;
  createdAt: string;
  type: 'objective';
}

// Union type for items returned from DB
export type KeyResultItem = KeyResult | Objective;

// API Response Types
export interface KeyResultResponse {
  keyResults: KeyResult[];
  objectives?: Objective[];
  error?: string;
}

export interface KeyResultActionResponse {
  success: boolean;
  error?: string;
  data?: any;
}

// Input Types
export interface CreateKeyResultInput {
  content: string;
  projectId?: string;
  icon?: string;
  recurrence?: Recurrence;
  dueDate?: string;
  priority?: Priority;
  reminders?: string[];
  subtasks?: { content: string; requiredTouches: number; emoji?: string }[];
}

export interface CreateProjectInput {
  name: string;
  icon?: string;
  color?: string;
}

export interface UpdateKeyResultInput {
  keyResultId: string;
  content?: string;
  completed?: boolean;
  icon?: string;
  objectiveId?: string;
  recurrence?: Recurrence;
  dueDate?: string;
  priority?: Priority;
  reminders?: string[];
}

export interface UpdateKeyResultInput {
  subtaskId: string;
  keyResultId: string;
  content?: string;
  completed?: boolean;
  currentTouches?: number;
  requiredTouches?: number;
  icon?: string;
  unit?: string;
  color?: string;
  frequency?: number[];
}

export interface UpdateObjectiveInput {
  objectiveId: string;
  name?: string;
  icon?: string;
  color?: string;
}

export interface DeleteKeyResultInput {
  keyResultId: string;
}
