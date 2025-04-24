import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TodoItem {
  id: string; // Unique ID for each ToDo item
  name: string; // ToDo item name
  category: string; // Category name
  completed: boolean; // Checkbox state
}

interface TodoContextType {
  todos: TodoItem[];
  refreshTodos: () => Promise<void>;
  updateCategoryInTodos: (oldName: string, newName: string) => Promise<void>;
}

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  refreshTodos: async () => {},
  updateCategoryInTodos: async () => {},
});

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const refreshTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('todoItems');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const updateCategoryInTodos = async (oldName: string, newName: string) => {
    try {
      const updatedTodos = todos.map((todo) => (todo.category === oldName ? { ...todo, category: newName } : todo));
      await AsyncStorage.setItem('todoItems', JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating category in todos:', error);
    }
  };

  // Load todos on mount
  useEffect(() => {
    refreshTodos();
  }, []);

  return <TodoContext.Provider value={{ todos, refreshTodos, updateCategoryInTodos }}>{children}</TodoContext.Provider>;
};
