import { useContext, useState, useRef } from 'react';
import { View, Dimensions, TouchableOpacity, FlatList, Text, TextInput, ScrollView } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { CategoryContext } from '@/contexts/CategoryContext';
import { TodoContext } from '@/contexts/TodoContext';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import CategoryCard from '@/components/CategoryCard';
import TodoCard from '@/components/TodoCard';
import { Swipeable } from 'react-native-gesture-handler';

export default function CategoryPage() {
  const { theme } = useContext(ThemeContext);
  const { categories } = useContext(CategoryContext);
  const { todos, refreshTodos } = useContext(TodoContext);
  const { name } = useLocalSearchParams<{ name: string }>();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const cardSize = screenWidth * 0.28; // Same as CategoryCard
  const inputCardHeight = screenWidth * 0.1 + 6; // cardHeight + 2 * marginVertical (8px)
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const [editTodoName, setEditTodoName] = useState('');
  const [editTodoComment, setEditTodoComment] = useState('');
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [currentTodoName, setCurrentTodoName] = useState('');
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const activeSwipeableRef = useRef<Swipeable | null>(null);

  // Find the category by name
  const category = categories.find((cat) => cat.name === decodeURIComponent(name || ''));

  // Split todos into uncompleted and completed
  const uncompletedTodos = todos.filter((todo) => todo.category === decodeURIComponent(name || '') && !todo.completed);
  const completedTodos = todos.filter((todo) => todo.category === decodeURIComponent(name || '') && todo.completed);

  // Combine data for FlatList: uncompleted, spacer, completed
  const listData = [
    ...uncompletedTodos,
    ...(completedTodos.length > 0 ? [{ id: 'spacer', name: '', completed: false, isSpacer: true, comment: '' }] : []),
    ...completedTodos,
  ];

  const handleSaveTodo = async (todoName: string) => {
    if (!category) {
      console.error('No category found for name:', name);
      return;
    }
    const newTodo = {
      id: `todo-${Date.now()}-${Math.random()}`,
      name: todoName,
      category: category.name,
      completed: false,
      comment: '',
    };
    try {
      const updatedTodos = [...todos, newTodo];
      await AsyncStorage.setItem('todoItems', JSON.stringify(updatedTodos));
      await refreshTodos();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    try {
      await AsyncStorage.setItem('todoItems', JSON.stringify(updatedTodos));
      await refreshTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleEditTodo = (id: string, name: string, swipeable: Swipeable | null) => {
    activeSwipeableRef.current = swipeable;
    setEditTodoId(id);
    setEditTodoName(name);
    const todo = todos.find((t) => t.id === id);
    setEditTodoComment(todo ? todo.comment : '');
    setEditModalVisible(true);
  };

  const handleSaveEditTodo = async () => {
    if (!editTodoId || !editTodoName.trim()) {
      console.error('Invalid editTodoId or empty name');
      return;
    }
    const updatedTodos = todos.map((todo) =>
      todo.id === editTodoId ? { ...todo, name: editTodoName.trim(), comment: editTodoComment } : todo
    );
    try {
      await AsyncStorage.setItem('todoItems', JSON.stringify(updatedTodos));
      await refreshTodos();
      setEditModalVisible(false);
      setEditTodoId(null);
      setEditTodoName('');
      setEditTodoComment('');
      activeSwipeableRef.current?.close();
    } catch (error) {
      console.error('Error saving edited todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    try {
      await AsyncStorage.setItem('todoItems', JSON.stringify(updatedTodos));
      await refreshTodos();
      activeSwipeableRef.current?.close();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleViewComment = (comment: string, todoName: string) => {
    setCurrentComment(comment);
    setCurrentTodoName(todoName);
    setCommentModalVisible(true);
  };

  const handleDeleteCompletedTodos = async () => {
    const updatedTodos = todos.filter((todo) => !(todo.category === decodeURIComponent(name || '') && todo.completed));
    try {
      await AsyncStorage.setItem('todoItems', JSON.stringify(updatedTodos));
      await refreshTodos();
      setDeleteModalVisible(false);
      activeSwipeableRef.current?.close();
    } catch (error) {
      console.error('Error deleting completed todos:', error);
    }
  };

  const handleSwipeableWillOpen = (swipeable: Swipeable) => {
    if (activeSwipeableRef.current && activeSwipeableRef.current !== swipeable) {
      activeSwipeableRef.current.close();
    }
    activeSwipeableRef.current = swipeable;
  };

  const renderTodo = ({
    item,
  }: {
    item: { id: string; name: string; completed: boolean; isSpacer?: boolean; comment: string };
  }) => {
    if (item.isSpacer) {
      return <View style={{ height: 8 }} />; // 16px gap between groups
    }
    return (
      <TodoCard
        todo={item}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditTodo}
        onDelete={handleDeleteTodo}
        onViewComment={handleViewComment}
        onSwipeableWillOpen={handleSwipeableWillOpen}
      />
    );
  };

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

      {/* Input TodoCard (Sticky) */}
      <View
        style={{
          position: 'absolute',
          top: 16 + cardSize + 16, // Below CategoryCard with 16px spacing
          left: 0,
          right: 0,
          zIndex: 10, // Ensure it stays above FlatList
          paddingHorizontal: 16,
        }}
      >
        <TodoCard isInputCard onSave={handleSaveTodo} />
      </View>

      {/* Todo List */}
      <View
        style={{
          position: 'absolute',
          top: 8 + cardSize + 16 + inputCardHeight + 16, // Below input card with 16px spacing
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <FlatList
          data={listData}
          renderItem={renderTodo}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 16,
            paddingHorizontal: 16,
          }}
        />
      </View>

      {/* Trashcan Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          width: screenWidth * 0.12,
          height: screenWidth * 0.12,
          borderRadius: (screenWidth * 0.12) / 2,
          backgroundColor: theme === 'light' ? '#ffffff' : '#1F2937',
          borderColor: theme === 'light' ? '#D1D5DB' : '#4B5563',
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 8,
        }}
        onPress={() => setDeleteModalVisible(true)}
      >
        <MaterialCommunityIcons name="delete" size={24} color={theme === 'light' ? '#7F1D1D' : '#FECACA'} />
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal
        isVisible={isEditModalVisible}
        onBackdropPress={() => {
          setEditModalVisible(false);
          setEditTodoId(null);
          setEditTodoName('');
          setEditTodoComment('');
          activeSwipeableRef.current?.close();
        }}
        style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
      >
        <View
          className={`rounded-2xl p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
          style={{ width: screenWidth * 0.8, alignSelf: 'center' }}
        >
          <Text className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            {editTodoName || 'Unnamed'}
          </Text>
          <TextInput
            className={`border rounded-lg p-2 mt-2 ${
              theme === 'light' ? 'border-gray-300 text-gray-800' : 'border-gray-600 text-gray-100'
            }`}
            value={editTodoName}
            onChangeText={setEditTodoName}
            placeholder="Edit to-do item"
            placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
          />
          <Text className={`text-lg font-bold mt-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            Comment
          </Text>
          <TextInput
            className={`border rounded-lg p-2 mt-2 ${
              theme === 'light' ? 'border-gray-300 text-gray-800' : 'border-gray-600 text-gray-100'
            }`}
            value={editTodoComment}
            onChangeText={setEditTodoComment}
            placeholder="Add a comment"
            placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
            multiline
            numberOfLines={5}
            style={{ height: 100, textAlignVertical: 'top' }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
          >
            {/* Cancel Button */}
            <TouchableOpacity
              onPress={() => {
                setEditModalVisible(false);
                setEditTodoId(null);
                setEditTodoName('');
                setEditTodoComment('');
                activeSwipeableRef.current?.close();
              }}
              style={{
                width: screenWidth * 0.8 * 0.45,
                height: screenWidth * 0.12,
              }}
            >
              <View
                className={`flex-row items-center justify-center border rounded-3xl shadow elevation-8 ${
                  theme === 'light' ? 'bg-red-200 border-gray-300' : 'bg-red-900 border-gray-600'
                }`}
                style={{ width: '100%', height: '100%', paddingHorizontal: 16 }}
              >
                <MaterialCommunityIcons name="cancel" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
                <Text className={`text-sm ml-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Cancel</Text>
              </View>
            </TouchableOpacity>

            {/* Modify Button */}
            <TouchableOpacity
              onPress={handleSaveEditTodo}
              style={{
                width: screenWidth * 0.8 * 0.45,
                height: screenWidth * 0.12,
              }}
            >
              <View
                className={`flex-row items-center justify-center border rounded-3xl shadow elevation-8 ${
                  theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
                }`}
                style={{ width: '100%', height: '100%', paddingHorizontal: 16 }}
              >
                <MaterialCommunityIcons
                  name="content-save"
                  size={24}
                  color={theme === 'light' ? '#1f2937' : '#ffffff'}
                />
                <Text className={`text-sm ml-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Modify</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Comment Display Modal */}
      <Modal
        isVisible={isCommentModalVisible}
        onBackdropPress={() => setCommentModalVisible(false)}
        style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
      >
        <View
          className={`rounded-2xl p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
          style={{
            width: screenWidth * 0.8,
            minHeight: screenHeight * 0.2,
            maxHeight: screenHeight * 0.8,
            alignSelf: 'center',
          }}
        >
          <Text
            className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}
            style={{ marginBottom: 8 }}
          >
            {currentTodoName || 'Unnamed'}
          </Text>
          <ScrollView
            style={{
              marginBottom: 16,
              maxHeight: screenHeight * 0.8 - 120, // Adjust for TodoName, Close button, padding
            }}
          >
            <Text className={`text-base ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
              {currentComment || 'No comment'}
            </Text>
          </ScrollView>
          <TouchableOpacity
            onPress={() => setCommentModalVisible(false)}
            style={{
              width: screenWidth * 0.8 * 0.45,
              height: screenWidth * 0.12,
              alignSelf: 'center',
            }}
          >
            <View
              className={`flex-row items-center justify-center border rounded-3xl shadow elevation-8 ${
                theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
              }`}
              style={{ width: '100%', height: '100%', paddingHorizontal: 16 }}
            >
              <MaterialCommunityIcons name="close" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
              <Text className={`text-sm ml-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Delete Completed Todos Modal */}
      <Modal
        isVisible={isDeleteModalVisible}
        onBackdropPress={() => {
          setDeleteModalVisible(false);
          activeSwipeableRef.current?.close();
        }}
        style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
      >
        <View
          className={`rounded-2xl p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
          style={{ width: screenWidth * 0.8, alignSelf: 'center' }}
        >
          <Text
            className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}
            style={{ marginBottom: 16 }}
          >
            Delete all completed todos in {decodeURIComponent(name || '')}?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
          >
            {/* Cancel Button */}
            <TouchableOpacity
              onPress={() => {
                setDeleteModalVisible(false);
                activeSwipeableRef.current?.close();
              }}
              style={{
                width: screenWidth * 0.8 * 0.45,
                height: screenWidth * 0.12,
              }}
            >
              <View
                className={`flex-row items-center justify-center border rounded-3xl shadow elevation-8 ${
                  theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
                }`}
                style={{ width: '100%', height: '100%', paddingHorizontal: 16 }}
              >
                <MaterialCommunityIcons name="cancel" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
                <Text className={`text-sm ml-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Cancel</Text>
              </View>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={handleDeleteCompletedTodos}
              style={{
                width: screenWidth * 0.8 * 0.45,
                height: screenWidth * 0.12,
              }}
            >
              <View
                className={`flex-row items-center justify-center border rounded-3xl shadow elevation-8 ${
                  theme === 'light' ? 'bg-red-200 border-gray-300' : 'bg-red-900 border-gray-600'
                }`}
                style={{ width: '100%', height: '100%', paddingHorizontal: 16 }}
              >
                <MaterialCommunityIcons name="delete" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
                <Text className={`text-sm ml-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Delete</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
