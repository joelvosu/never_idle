import { Stack } from 'expo-router';
import './globals.css';
import { ThemeProvider, ThemeContext } from '@/contexts/ThemeContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { TodoProvider } from '@/contexts/TodoContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useContext, useEffect } from 'react';
import { View, Platform } from 'react-native';
import * as SystemUI from 'expo-system-ui';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ThemeBackgroundWrapper>
          <CategoryProvider>
            <TodoProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'fade', // Consistent fade for all transitions
                  animationDuration: 200, // Slightly faster
                  gestureEnabled: true, // Enable Android back swipe
                  gestureDirection: 'horizontal', // Match Android swipe
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="confCategories" options={{ headerShown: false }} />
                <Stack.Screen name="category/[name]" options={{ headerShown: false }} />
              </Stack>
            </TodoProvider>
          </CategoryProvider>
        </ThemeBackgroundWrapper>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function ThemeBackgroundWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (Platform.OS === 'android') {
      SystemUI.setBackgroundColorAsync(theme === 'light' ? '#DBEAFE' : '#111827').catch((error) =>
        console.error('Error setting system UI background color:', error)
      );
    }
  }, [theme]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme === 'light' ? '#DBEAFE' : '#111827', // Matches bg-blue-100, bg-gray-900
      }}
    >
      {children}
    </View>
  );
}
