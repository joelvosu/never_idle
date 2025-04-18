import ThemeToggle from '@/components/ThemeToggle';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useContext } from 'react';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const { theme } = useContext(ThemeContext);

  return (
    <View className={`flex-1 items-center justify-center ${theme === 'light' ? 'bg-blue-100' : 'bg-gray-900'}`}>
      <ThemeToggle />
      <Link href="/confCategories" asChild className={`absolute top-7 right-7 rounded-full`}>
        <Ionicons name="settings" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
      </Link>
      <Text className={`text-lg font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        Welcome to Never Idle!
      </Text>
    </View>
  );
}
