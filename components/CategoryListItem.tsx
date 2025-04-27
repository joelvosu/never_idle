import { useContext, useRef } from 'react';
import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

interface CategoryListItemProps {
  category: { name: string; icon: string };
  index: number;
  onEdit: (index: number, swipeable: Swipeable | null) => void;
  onDelete: (index: number) => void;
}

export default function CategoryListItem({ category, index, onEdit, onDelete }: CategoryListItemProps) {
  const { theme } = useContext(ThemeContext);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const displayCategoryWidth = screenWidth * 0.9; // 90% width
  const displayCategoryHeight = screenHeight * 0.07; // 7% height
  const swipeableRef = useRef<Swipeable | null>(null);

  const renderLeftActions = () => (
    <TouchableOpacity
      onPress={() => onEdit(index, swipeableRef.current)}
      style={{
        width: screenWidth * 0.18,
        height: displayCategoryHeight,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        className={`flex-row items-center justify-center h-full rounded-3xl border ${
          theme === 'light' ? 'bg-blue-400 border-gray-300' : 'bg-blue-600 border-gray-600'
        }`}
        style={{ width: '100%', paddingHorizontal: 8 }}
      >
        <MaterialCommunityIcons name="pencil" size={24} color="#ffffff" />
        <Text className="text-sm text-white ml-2">Edit</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRightActions = () => (
    <TouchableOpacity
      onPress={() => onDelete(index)}
      style={{
        width: screenWidth * 0.18,
        height: displayCategoryHeight,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        className={`flex-row items-center justify-center h-full rounded-3xl border ${
          theme === 'light' ? 'bg-red-400 border-gray-300' : 'bg-red-600 border-gray-600'
        }`}
        style={{ width: '100%', paddingHorizontal: 8 }}
      >
        <MaterialCommunityIcons name="delete" size={24} color="#ffffff" />
        <Text className="text-sm text-white ml-2">Delete</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        width: displayCategoryWidth,
        height: displayCategoryHeight,
        marginVertical: 2.5, // 5px between items
        alignSelf: 'center',
      }}
    >
      <Swipeable
        ref={swipeableRef}
        friction={1}
        leftThreshold={50}
        rightThreshold={50}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        onSwipeableOpen={() => {
          swipeableRef.current = swipeableRef.current || null;
        }}
      >
        <View
          className={`flex-row items-center border rounded-3xl shadow elevation-8 ${
            theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
          }`}
          style={{ width: displayCategoryWidth, height: displayCategoryHeight, paddingHorizontal: 16 }}
        >
          <FontAwesome6 name={category.icon} size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
          <Text className={`text-base ml-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`} numberOfLines={1}>
            {category.name}
          </Text>
        </View>
      </Swipeable>
    </View>
  );
}
