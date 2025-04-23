import { useContext } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { CategoryContext } from '@/contexts/CategoryContext';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CategoryCard from '@/components/CategoryCard';
import TodoCard from '@/components/TodoCard';

export default function CategoryPage() {
  const { theme } = useContext(ThemeContext);
  const { categories } = useContext(CategoryContext);
  const { name } = useLocalSearchParams<{ name: string }>();
  const screenWidth = Dimensions.get('window').width;
  const cardSize = screenWidth * 0.28; // Same as CategoryCard

  // Find the category by name
  const category = categories.find((cat) => cat.name === decodeURIComponent(name || ''));

  return (
    <View className={`flex-1 ${theme === 'light' ? 'bg-blue-100' : 'bg-gray-900'}`}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.push('/')}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
        }}
      >
        <Ionicons name="arrow-back" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
      </TouchableOpacity>

      {/* Category Card */}
      <View
        style={{
          position: 'absolute',
          top: 16,
          left: (screenWidth - cardSize) / 2, // Center horizontally
          width: cardSize,
          height: cardSize,
        }}
      >
        {category && <CategoryCard category={category} />}
      </View>

      {/* Todo Card */}
      <View
        style={{
          position: 'absolute',
          top: 16 + cardSize + 16, // Below CategoryCard with 16px spacing
          left: 0,
          right: 0,
        }}
      >
        <TodoCard />
      </View>
    </View>
  );
}
