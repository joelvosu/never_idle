import { createContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Category {
  name: string;
  icon: string;
}

interface CategoryContextType {
  categories: Category[];
  refreshCategories: () => Promise<void>;
}

export const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  refreshCategories: async () => {},
});

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const refreshCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Load categories on mount
  useEffect(() => {
    refreshCategories();
  }, []);

  return <CategoryContext.Provider value={{ categories, refreshCategories }}>{children}</CategoryContext.Provider>;
};
