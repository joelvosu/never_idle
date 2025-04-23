import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Dimensions, View } from 'react-native';

export default function TodoCard() {
  const { theme } = useContext(ThemeContext);
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth * 0.9; // 90% of screen width
  const cardHeight = screenWidth * 0.18; // Consistent with app's card proportions

  return (
    <View
      style={{
        width: cardWidth,
        height: cardHeight,
        marginVertical: 8,
        alignSelf: 'center',
      }}
    >
      <View
        className={`flex items-center justify-center border rounded-3xl shadow elevation-8 ${
          theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
        }`}
        style={{ width: cardWidth, height: cardHeight }}
      >
        {/* Placeholder for ToDo content */}
      </View>
    </View>
  );
}
