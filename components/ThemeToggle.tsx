import { useContext } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@react-navigation/core';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`absolute top-4 left-4 px-4 py-2 rounded-full ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
    >
      <Text className={`text-base font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        {theme === 'light' ? 'dark' : 'light'}
      </Text>
    </TouchableOpacity>
  );
}
