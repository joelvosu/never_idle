import ThemeToggle from '@/components/ThemeToggle';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useContext } from 'react';
import { View, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QuoteCard from '@/components/QuoteCard';

export default function Home() {
  const { theme } = useContext(ThemeContext);

  return (
    <View className={`flex-1 ${theme === 'light' ? 'bg-blue-100' : 'bg-gray-900'}`}>
      <ThemeToggle />
      <Link href="/confCategories" asChild className={`absolute top-7 right-7 rounded-full`}>
        <Ionicons name="settings" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
      </Link>
      <View
        style={{
          position: 'absolute',
          top: 64,
          left: 0,
          right: 0,
          height: Dimensions.get('window').height * 0.15,
        }}
      >
        <QuoteCard />
      </View>
    </View>
  );
}
