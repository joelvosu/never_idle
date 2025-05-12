import { Stack } from 'expo-router';
import './globals.css';
import { ThemeProvider, ThemeContext } from '@/contexts/ThemeContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { TodoProvider } from '@/contexts/TodoContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useContext, useEffect } from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const { theme, isThemeLoaded } = useContext(ThemeContext);

  useEffect(() => {
    if (Platform.OS === 'android' && isThemeLoaded) {
      // Reinforce status bar style after theme is loaded
      StatusBar.setBarStyle(theme === 'light' ? 'dark-content' : 'light-content', true);
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent', true);
      StatusBar.setHidden(false);
    }
  }, [theme, isThemeLoaded]);

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
