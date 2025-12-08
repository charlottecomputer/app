// Todo Schema Types
export interface Todo {
  userId: string;
  todoId: string;
  content: string;
  completed: boolean;
  createdAt: string;
}

// API Response Types
export interface TodosResponse {
  todos: Todo[];
  error?: string;
}

export interface TodoActionResponse {
  success: boolean;
  error?: string;
}

// Input Types
export interface CreateTodoInput {
  content: string;
}

export interface UpdateTodoInput {
  todoId: string;
  completed: boolean;
}

export interface DeleteTodoInput {
  todoId: string;
}
