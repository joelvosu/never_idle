import { useContext, useRef } from 'react';
import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { TodoContext } from '@/contexts/TodoContext';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

interface CategoryListItemProps {
  category: { name: string; icon: string };
  index: number;
  onEdit: (index: number, swipeable: Swipeable | null) => void;
  onDelete: (index: number) => void;
  onSwipeableWillOpen?: (swipeable: Swipeable) => void;
}

export default function CategoryListItem({
  category,
  index,
  onEdit,
  onDelete,
  onSwipeableWillOpen,
}: CategoryListItemProps) {
  const { theme } = useContext(ThemeContext);
  const { todos } = useContext(TodoContext);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const displayCategoryWidth = screenWidth * 0.9; // 90% width
  const displayCategoryHeight = screenHeight * 0.06; // 7% height
  const swipeableRef = useRef<Swipeable | null>(null);

  // Count uncompleted and completed todos for this category
  const uncompletedCount = todos.filter((todo) => todo.category === category.name && !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.category === category.name && todo.completed).length;

  // Calculate circle size: 35% height at count=1, 65% at count=10
  const getCircleSize = (count: number) => {
    if (count === 0) return 0;
    const minSize = displayCategoryHeight * 0.35; // 35% for count=1
    const maxSize = displayCategoryHeight * 0.65; // 65% for count>=10
    if (count >= 10) return maxSize;
    // Linear interpolation: size = minSize + (maxSize - minSize) * (count - 1) / (10 - 1)
    return minSize + ((maxSize - minSize) * (count - 1)) / 9;
  };

  const uncompletedCircleSize = getCircleSize(uncompletedCount);
  const completedCircleSize = getCircleSize(completedCount);

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
        className={`flex-row items-center justify-center h-full rounded-2xl border ${
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
        className={`flex-row items-center justify-center h-full rounded-2xl border ${
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
        marginVertical: 1, // 5px between items
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
        onSwipeableWillOpen={() => {
          if (onSwipeableWillOpen && swipeableRef.current) {
            onSwipeableWillOpen(swipeableRef.current);
          }
        }}
      >
        <View
          className={`flex-row items-center border rounded-2xl shadow elevation-8 ${
            theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
          }`}
          style={{ width: displayCategoryWidth, height: displayCategoryHeight, paddingHorizontal: 16 }}
        >
          <FontAwesome6 name={category.icon} size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
          <Text
            className={`text-base ml-4 flex-1 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}
            numberOfLines={1}
          >
            {category.name}
          </Text>
          <View className="flex-row items-center">
            {uncompletedCount > 0 && (
              <View
                className={`rounded-full border justify-center items-center ${
                  theme === 'light' ? 'bg-red-200 border-gray-300' : 'bg-red-900 border-gray-600'
                }`}
                style={{
                  width: uncompletedCircleSize,
                  height: uncompletedCircleSize,
                  marginLeft: 8,
                }}
              >
                <Text className={`text-sm font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
                  {uncompletedCount}
                </Text>
              </View>
            )}
            {completedCount > 0 && (
              <View
                className={`rounded-full border justify-center items-center ${
                  theme === 'light' ? 'bg-gray-200 border-gray-300' : 'bg-gray-800 border-gray-600'
                }`}
                style={{
                  width: completedCircleSize,
                  height: completedCircleSize,
                  marginLeft: 8,
                }}
              >
                <Text className={`text-sm font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
                  {completedCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Swipeable>
    </View>
  );
}
