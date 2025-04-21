import { useContext } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

export default function CategoryCard() {
  const { theme } = useContext(ThemeContext);
  const screenWidth = Dimensions.get('window').width;
  const cardSize = screenWidth * 0.4; // 40% of screen width

  return (
    <TouchableOpacity
      onPress={() => router.push('/confCategories')}
      style={{
        width: cardSize,
        height: cardSize,
        marginLeft: screenWidth * 0.05, // 5% padding
      }}
    >
      <View
        className={`flex items-center justify-center border rounded-3xl shadow elevation-8 ${
          theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
        }`}
        style={{ width: cardSize, height: cardSize }}
      >
        <FontAwesome6 name="plus" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
      </View>
    </TouchableOpacity>
  );
}
