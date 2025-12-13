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

  // Progress tracking (formerly subtask logic)
  requiredTouches: number;
  currentTouches: number;

  // Visuals
  icon?: string;
  color?: string;
  unit?: string;

  // Organization
  projectId?: string; // Maps to Objective ID

  // Scheduling
  recurrence?: Recurrence;
  dueDate?: string; // ISO date string
  priority?: Priority;
  reminders?: string[]; // ISO date strings

  type: 'keyResult';

  lastCompletedAt?: string; // ISO date string
  frequency?: number[]; // 0-6, where 0 is Sunday
}

export interface Objective {
  userId: string;
  projectId: string; // stored as id in DynamoDB
  name: string;
  icon?: string;
  color?: string;
  createdAt: string;
  type: 'objective';
}

// Union type for items returned from DB
export type KeyResultItem = KeyResult | Objective;

// API Response Types
export interface KeyResultsResponse {
  keyResults: KeyResult[];
  objectives: Objective[];
  error?: string;
}

export interface KeyResultsActionResponse {
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
  requiredTouches?: number;
  currentTouches?: number;
  unit?: string;
  color?: string;
  frequency?: number[];
  lastCompletedAt?: string;
}

export interface createObjectiveInput {
  name: string;
  icon?: string;
  color?: string;
}

export interface UpdateKeyResultInput {
  keyResultId: string;
  content?: string;
  completed?: boolean;
  icon?: string;
  projectId?: string; // Objective ID
  recurrence?: Recurrence;
  dueDate?: string;
  priority?: Priority;
  reminders?: string[];
  currentTouches?: number;
  requiredTouches?: number;
  unit?: string;
  color?: string;
  frequency?: number[];
}

export interface UpdateObjectiveInput {
  projectId: string; // Objective ID
  name?: string;
  icon?: string;
  color?: string;
}

export interface DeleteKeyResultInput {
  keyResultId: string;
}
