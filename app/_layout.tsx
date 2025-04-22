import { Stack } from 'expo-router';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <CategoryProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="confCategories" options={{ headerShown: false }} />
          </Stack>
        </CategoryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
