import { useContext, useState, useEffect, useRef } from 'react';
import { Dimensions, FlatList, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { CategoryContext } from '@/contexts/CategoryContext';
import { TodoContext } from '@/contexts/TodoContext';
import { FontAwesome5, FontAwesome6, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { fontAwesomeIcons } from '@/data/fontAwesomeIcons';
import { router } from 'expo-router';
import CategoryListItem from '@/components/CategoryListItem';
import { Swipeable } from 'react-native-gesture-handler';

interface Category {
  name: string;
  icon: string;
}

export default function ConfCategories() {
  const { theme } = useContext(ThemeContext);
  const { refreshCategories } = useContext(CategoryContext);
  const { todos, updateCategoryInTodos } = useContext(TodoContext);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const cardSize = screenWidth * 0.28; // Same as CategoryCard
  const addCategorySize = screenWidth * 0.12; // Matches round "+" button

  // Modal state
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editCategoryIndex, setEditCategoryIndex] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);

  // Swipeable ref
  const activeSwipeableRef = useRef<Swipeable | null>(null);

  // Load categories from AsyncStorage
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const storedCategories = await AsyncStorage.getItem('categories');
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Save category to AsyncStorage
  const handleSaveCategory = async () => {
    if (!categoryName.trim() || !selectedIcon) {
      Alert.alert('Error', 'Please enter a category name and select an icon');
      return;
    }
    const newCategory = { name: categoryName.trim(), icon: selectedIcon };
    let updatedCategories: Category[];
    if (modalMode === 'add') {
      updatedCategories = [...categories, newCategory];
    } else {
      updatedCategories = [...categories];
      if (editCategoryIndex !== null) {
        const oldCategoryName = categories[editCategoryIndex].name;
        updatedCategories[editCategoryIndex] = newCategory;
        // Update todos with new category name
        await updateCategoryInTodos(oldCategoryName, newCategory.name);
      }
    }
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      await refreshCategories(); // Notify home screen
      setCategoryName('');
      setSelectedIcon(null);
      setModalVisible(false);
      setModalMode('add');
      setEditCategoryIndex(null);
      activeSwipeableRef.current?.close(); // Reset Swipeable
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  // Delete category
  const handleDeleteCategory = async (index: number) => {
    const categoryName = categories[index].name;
    const hasTodos = todos.some((todo) => todo.category === categoryName);
    if (hasTodos) {
      Alert.alert('Error', 'Category not empty!');
      activeSwipeableRef.current?.close();
      return;
    }
    const updatedCategories = categories.filter((_, i) => i !== index);
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      await refreshCategories(); // Notify home screen
      activeSwipeableRef.current?.close(); // Reset Swipeable
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Open Edit modal
  const handleEditCategory = (index: number, swipeable: Swipeable | null) => {
    activeSwipeableRef.current = swipeable;
    const category = categories[index];
    setModalMode('edit');
    setEditCategoryIndex(index);
    setCategoryName(category.name);
    setSelectedIcon(category.icon);
    setModalVisible(true);
  };

  // Render icon in FlatList
  const renderIcon = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => setSelectedIcon(item)}
      style={{
        width: '23%',
        aspectRatio: 1,
        margin: '1%',
        borderWidth: selectedIcon === item ? 2 : 0,
        borderColor: theme === 'light' ? '#1f2937' : '#ffffff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FontAwesome6 name={item} size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
    </TouchableOpacity>
  );

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

      {/* Header Element */}
      <View
        style={{
          position: 'absolute',
          top: 16,
          left: (screenWidth - cardSize) / 2, // Center horizontally
          width: cardSize,
          height: cardSize,
        }}
      >
        <View
          className={`border rounded-3xl shadow elevation-8 items-center justify-center ${
            theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
          }`}
          style={{ width: cardSize, height: cardSize }}
        >
          <MaterialIcons name="category" size={cardSize * 0.5} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
          <Text
            className={`text-base text-center mt-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}
            numberOfLines={2}
          >
            Todo Categories
          </Text>
        </View>
      </View>

      {/* Category List */}
      <FlatList
        data={categories}
        renderItem={({ item, index }) => (
          <CategoryListItem category={item} index={index} onEdit={handleEditCategory} onDelete={handleDeleteCategory} />
        )}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        style={{ marginTop: 16 + cardSize + 16, marginBottom: addCategorySize + 32 }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />

      {/* Modal for Add/Edit Category */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
          setModalMode('add');
          setEditCategoryIndex(null);
          setCategoryName('');
          setSelectedIcon(null);
          activeSwipeableRef.current?.close();
        }}
        style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
      >
        <View
          className={`rounded-2xl p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
          style={{ width: screenWidth * 0.8, maxHeight: screenHeight * 0.7, alignSelf: 'center' }}
        >
          <Text className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            {modalMode === 'add' ? 'Category Name' : 'Edit Category Name'}
          </Text>
          <TextInput
            className={`border rounded-lg p-2 mt-2 ${
              theme === 'light' ? 'border-gray-300 text-gray-800' : 'border-gray-600 text-gray-100'
            }`}
            value={categoryName}
            onChangeText={setCategoryName}
            placeholder="Enter category name"
            placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
          />
          <Text className={`text-lg font-bold mt-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            {modalMode === 'add' ? 'Category Image' : 'Edit Category Image'}
          </Text>
          <FlatList
            data={fontAwesomeIcons}
            renderItem={renderIcon}
            keyExtractor={(item) => item}
            numColumns={4}
            style={{ maxHeight: 200, marginTop: 8 }}
            contentContainerStyle={{ paddingBottom: 8 }}
            bounces={false}
            overScrollMode="never"
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
                setModalVisible(false);
                setModalMode('add');
                setEditCategoryIndex(null);
                setCategoryName('');
                setSelectedIcon(null);
                activeSwipeableRef.current?.close();
              }}
              style={{
                width: screenWidth * 0.8 * 0.45,
                height: screenHeight * 0.07,
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

            {/* Create/Modify Category Button */}
            <TouchableOpacity
              onPress={handleSaveCategory}
              style={{
                width: screenWidth * 0.8 * 0.45,
                height: screenHeight * 0.07,
              }}
            >
              <View
                className={`flex-row items-center justify-center border rounded-3xl shadow elevation-8 ${
                  theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
                }`}
                style={{ width: '100%', height: '100%', paddingHorizontal: 16 }}
              >
                <FontAwesome5 name="folder-plus" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
                <Text className={`text-sm ml-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
                  {modalMode === 'add' ? 'Create Category' : 'Modify Category'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Category Button */}
      <TouchableOpacity
        onPress={() => {
          setModalMode('add');
          setCategoryName('');
          setSelectedIcon(null);
          setModalVisible(true);
        }}
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
      >
        <View
          className={`rounded-full border shadow elevation-8 ${
            theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
          }`}
          style={{
            width: addCategorySize,
            height: addCategorySize,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MaterialCommunityIcons name="plus" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
        </View>
      </TouchableOpacity>

      {/* Backup and Restore Buttons */}
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          flexDirection: 'row',
        }}
      >
        {/* Backup Button */}
        <TouchableOpacity
          style={{
            marginRight: 8, // 8px padding between buttons
          }}
        >
          <View
            className={`rounded-full border shadow elevation-8 ${
              theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
            }`}
            style={{
              width: addCategorySize,
              height: addCategorySize,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MaterialIcons name="backup" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
          </View>
        </TouchableOpacity>

        {/* Restore Button */}
        <TouchableOpacity>
          <View
            className={`rounded-full border shadow elevation-8 ${
              theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
            }`}
            style={{
              width: addCategorySize,
              height: addCategorySize,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MaterialIcons name="cloud-download" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
