import { Stack } from 'expo-router';
import './globals.css';
import { ThemeProvider, ThemeContext } from '@/contexts/ThemeContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { TodoProvider } from '@/contexts/TodoContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useContext } from 'react';

export default function RootLayout() {
  const { theme } = useContext(ThemeContext);

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: theme === 'light' ? '#DBEAFE' : '#111827', // Matches bg-blue-100, bg-gray-900
      }}
    >
      <ThemeProvider>
        <CategoryProvider>
          <TodoProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade_from_bottom', // Smooth fade transition
                animationDuration: 250, // Fast but noticeable
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="confCategories" options={{ headerShown: false }} />
              <Stack.Screen name="category/[name]" options={{ headerShown: false }} />
            </Stack>
          </TodoProvider>
        </CategoryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
