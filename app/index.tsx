import ThemeToggle from '@/components/ThemeToggle';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useContext } from 'react';
import { Text, useColorScheme, View } from 'react-native';

export default function Home() {
  const { theme } = useContext(ThemeContext);
  const colorScheme = useColorScheme();

  return (
    <View className={`flex-1 items-center justify-center ${theme === 'light' ? 'bg-blue-100' : 'bg-gray-900'}`}>
      <ThemeToggle />
      <Text className={`text-lg font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        Welcome to Never Idle!
      </Text>
    </View>
  );
}
