import { useContext } from 'react';
import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { TodoContext } from '@/contexts/TodoContext';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

interface CategoryCardProps {
  category?: { name: string; icon: string };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { theme } = useContext(ThemeContext);
  const { todos } = useContext(TodoContext);
  const screenWidth = Dimensions.get('window').width;
  const cardSize = screenWidth * 0.29; // 30% of screen width to fit 3 columns in 90%

  const uncompletedCount =
    category && category.name ? todos.filter((todo) => todo.category === category.name && !todo.completed).length : 0;

  const getCircleSize = (count: number) => {
    if (count === 0) return 0;
    const minSize = cardSize * 0.2;
    const maxSize = cardSize * 0.28;
    if (count >= 10) return maxSize;
    return minSize + ((maxSize - minSize) * (count - 1)) / 9;
  };

  const uncompletedCircleSize = getCircleSize(uncompletedCount);

  return (
    <TouchableOpacity
      onPress={() => {
        if (category && category.name) {
          router.push(`/category/${encodeURIComponent(category.name)}`);
        } else {
          router.push('/confCategories');
        }
      }}
    >
      <View style={{ width: cardSize, height: cardSize }}>
        <View
          className={`flex-1 items-center justify-center border rounded-3xl shadow elevation-8 ${
            theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
          }`}
          style={{ width: cardSize, height: cardSize }}
        >
          {category && category.name ? (
            <>
              <FontAwesome6 name={category.icon} size={32} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
              <Text
                className={`text-sm mt-2 text-center ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}
                numberOfLines={1}
              >
                {category.name}
              </Text>
            </>
          ) : (
            <FontAwesome6 name="plus" size={32} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
          )}
        </View>
        {category && uncompletedCount > 0 && (
          <View
            className={`rounded-full border justify-center items-center absolute ${
              theme === 'light' ? 'bg-red-200 border-gray-300' : 'bg-red-900 border-gray-600'
            }`}
            style={{
              width: uncompletedCircleSize,
              height: uncompletedCircleSize,
              bottom: 0,
              right: 0,
            }}
          >
            <Text className={`text-sm font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
              {uncompletedCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
