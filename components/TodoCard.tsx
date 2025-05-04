import { useContext, useRef, useState } from 'react';
import { View, Dimensions, TextInput, Text, TouchableOpacity, Keyboard } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

interface TodoCardProps {
  todo?: { id: string; name: string; completed: boolean; comment: string };
  isInputCard?: boolean;
  onSave?: (name: string) => void;
  onToggleComplete?: (id: string) => void;
  onEdit?: (id: string, name: string, swipeable: Swipeable | null) => void;
  onDelete?: (id: string) => void;
  onViewComment?: (comment: string, name: string) => void;
  onSwipeableWillOpen?: (swipeable: Swipeable) => void;
  showSeparator?: boolean;
}

export default function TodoCard({
  todo,
  isInputCard = false,
  onSave,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewComment,
  onSwipeableWillOpen,
  showSeparator = false,
}: TodoCardProps) {
  const { theme } = useContext(ThemeContext);
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = isInputCard ? screenWidth * 0.9 : screenWidth * 0.9 - 8; // Adjust for group padding
  const cardHeight = screenWidth * 0.1;
  const [inputText, setInputText] = useState('');
  const swipeableRef = useRef<Swipeable | null>(null);

  const handleSave = () => {
    if (inputText.trim() && onSave) {
      onSave(inputText.trim());
      setInputText('');
      Keyboard.dismiss();
    }
  };

  const renderLeftActions = () => (
    <TouchableOpacity
      onPress={() => todo && onEdit && onEdit(todo.id, todo.name, swipeableRef.current)}
      style={{
        width: screenWidth * 0.16, // Slightly reduced to fit narrower card
        height: cardHeight,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        className={`flex-row items-center justify-center h-full rounded-2xl border ${
          theme === 'light' ? 'bg-blue-400 border-gray-300' : 'bg-blue-600 border-gray-600'
        }`}
        style={{ width: '100%', paddingHorizontal: 8, borderWidth: 1 }}
      >
        <MaterialCommunityIcons name="pencil" size={20} color="#ffffff" />
        <Text className="text-xs text-white ml-1">Edit</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRightActions = () => (
    <TouchableOpacity
      onPress={() => todo && onDelete && onDelete(todo.id)}
      style={{
        width: screenWidth * 0.16,
        height: cardHeight,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        className={`flex-row items-center justify-center h-full rounded-2xl border ${
          theme === 'light' ? 'bg-red-400 border-gray-300' : 'bg-red-600 border-gray-600'
        }`}
        style={{ width: '100%', paddingHorizontal: 8, borderWidth: 1 }}
      >
        <MaterialCommunityIcons name="delete" size={20} color="#ffffff" />
        <Text className="text-xs text-white ml-1">Delete</Text>
      </View>
    </TouchableOpacity>
  );

  if (isInputCard) {
    return (
      <View
        style={{
          width: cardWidth,
          height: cardHeight,
          marginVertical: 4,
          alignSelf: 'center',
        }}
      >
        <View
          className={`flex-row items-center border rounded-2xl shadow elevation-8 ${
            theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
          }`}
          style={{ width: cardWidth, height: cardHeight, paddingHorizontal: 16 }}
        >
          <TextInput
            className={`flex-1 text-base ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}
            placeholder="Enter to-do item"
            placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSave}
            returnKeyType="done"
            blurOnSubmit={true}
            keyboardType="default"
            autoCapitalize="sentences"
          />
          <TouchableOpacity onPress={handleSave} style={{ marginLeft: 8 }}>
            <MaterialCommunityIcons name="plus" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!todo) return null;

  const textColor = todo.completed
    ? theme === 'light'
      ? 'text-gray-400'
      : 'text-gray-500'
    : theme === 'light'
      ? 'text-gray-800'
      : 'text-gray-100';
  const iconColor = todo.completed
    ? theme === 'light'
      ? '#9CA3AF'
      : '#6B7280'
    : theme === 'light'
      ? '#1F2937'
      : '#FFFFFF';

  return (
    <View style={{ width: cardWidth, alignSelf: 'center' }}>
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
          className={`flex-row items-center rounded-2xl shadow elevation-8 ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          }`}
          style={{ width: cardWidth, height: cardHeight, paddingHorizontal: 8 }}
        >
          <TouchableOpacity onPress={() => onToggleComplete && onToggleComplete(todo.id)} style={{ marginRight: 12 }}>
            <MaterialCommunityIcons
              name={todo.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
              color={iconColor}
            />
          </TouchableOpacity>
          <Text className={`flex-1 text-base ${textColor} ${todo.completed ? 'line-through' : ''}`} numberOfLines={1}>
            {todo.name}
          </Text>
          {todo.comment.trim() && (
            <TouchableOpacity
              onPress={() => onViewComment && onViewComment(todo.comment, todo.name)}
              style={{ marginLeft: 8 }}
            >
              <MaterialCommunityIcons name="sticker-text-outline" size={24} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>
      </Swipeable>
      {showSeparator && (
        <View
          style={{
            width: cardWidth * 0.95,
            height: 1,
            backgroundColor: theme === 'light' ? '#D1D5DB' : '#4B5563',
            alignSelf: 'center',
            marginVertical: 4,
          }}
        />
      )}
    </View>
  );
}
