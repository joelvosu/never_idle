import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar, Platform } from 'react-native';
import * as SystemUI from 'expo-system-ui'; // Revert to expo-system-ui
import * as NavigationBar from 'expo-navigation-bar'; // Keep for fallback

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isThemeLoaded: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  isThemeLoaded: false,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  const applyTheme = async (newTheme: Theme) => {
    try {
      // Set status bar style and transparency synchronously
      StatusBar.setBarStyle(newTheme === 'light' ? 'dark-content' : 'light-content', true);
      StatusBar.setBackgroundColor('transparent', true);
      StatusBar.setTranslucent(true);

      // Apply system UI background color for navigation bar
      if (Platform.OS === 'android') {
        await SystemUI.setBackgroundColorAsync(newTheme === 'light' ? '#DBEAFE' : '#111827');
        // Fallback to expo-navigation-bar if SystemUI fails
        try {
          await NavigationBar.setBackgroundColorAsync(newTheme === 'light' ? '#DBEAFE' : '#111827');
          await NavigationBar.setButtonStyleAsync(newTheme === 'light' ? 'dark' : 'light');
        } catch (navError) {
          console.warn('expo-navigation-bar failed, using expo-system-ui as fallback:', navError);
        }
      }
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
    setTheme(newTheme);
  };

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    // Set default status bar style immediately to avoid flash
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle('dark-content', true); // Default to light theme
      StatusBar.setBackgroundColor('transparent', true);
      StatusBar.setTranslucent(true);
    }

    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'light';
        await applyTheme(initialTheme);
        setIsThemeLoaded(true);
      } catch (error) {
        console.error('Failed to load theme:', error);
        // Fallback to light theme on error
        await applyTheme('light');
        setIsThemeLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Toggle theme and save to AsyncStorage
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await AsyncStorage.setItem('theme', newTheme);
    await applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: applyTheme, isThemeLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};
