import { Stack } from 'expo-router';
import './globals.css';
import { ThemeProvider, ThemeContext } from '@/contexts/ThemeContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { TodoProvider } from '@/contexts/TodoContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useContext, useEffect } from 'react';
import { View, Platform, NativeModules, StatusBar } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                  animation: 'fade',
                  animationDuration: 200,
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
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
    const setStatusBar = async () => {
      if (Platform.OS === 'android') {
        // Get initial theme from AsyncStorage to avoid race condition
        const storedTheme = await AsyncStorage.getItem('theme');
        const initialTheme = storedTheme ? storedTheme : theme;

        // Set navigation bar color
        SystemUI.setBackgroundColorAsync(initialTheme === 'light' ? '#DBEAFE' : '#111827').catch((error) =>
          console.error('Error setting system UI background color:', error)
        );
        // Ensure status bar is translucent and themed
        NativeModules.StatusBarManager?.setTranslucent(true);
        NativeModules.StatusBarManager?.setStyle(initialTheme === 'light' ? 'dark-content' : 'light-content');
        // Force status bar visibility
        StatusBar.setHidden(false);
        StatusBar.setBackgroundColor('transparent');
      }
    };

    setStatusBar();
  }, [theme]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme === 'light' ? '#DBEAFE' : '#111827',
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </View>
  );
}
