import { useContext } from 'react';
import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

interface CategoryCardProps {
  category?: { name: string; icon: string };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { theme } = useContext(ThemeContext);
  const screenWidth = Dimensions.get('window').width;
  const cardSize = screenWidth * 0.28; // 28% of screen width

  return (
    <TouchableOpacity
      onPress={() =>
        category ? router.push(`/category/${encodeURIComponent(category.name)}`) : router.push('/confCategories')
      }
    >
      <View
        style={{
          width: cardSize,
          height: cardSize,
          margin: screenWidth * 0.02, // 2% margin for spacing
        }}
      >
        <View
          className={`flex items-center justify-center border rounded-3xl shadow elevation-8 ${
            theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
          }`}
          style={{ width: cardSize, height: cardSize }}
        >
          {category ? (
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
      </View>
    </TouchableOpacity>
  );
}
