import { useContext, useState, useEffect, useRef } from 'react';
import { Dimensions, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { FontAwesome5, FontAwesome6, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { fontAwesomeIcons } from '@/data/fontAwesomeIcons';
import { Swipeable } from 'react-native-gesture-handler';

interface Category {
  name: string;
  icon: string;
}

export default function ConfCategories() {
  const { theme } = useContext(ThemeContext);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const addCategoryWidth = screenWidth * 0.44; // 44% width
  const backupRestoreWidth = screenWidth * 0.22; // 22% width
  const elementHeight = screenWidth * 0.22; // 22% width height
  const displayCategoryWidth = screenWidth * 0.9; // 90% width
  const displayCategoryHeight = screenHeight * 0.07; // 7% height

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
      alert('Please enter a category name and select an icon');
      return;
    }
    const newCategory = { name: categoryName.trim(), icon: selectedIcon };
    let updatedCategories: Category[];
    if (modalMode === 'add') {
      updatedCategories = [...categories, newCategory];
    } else {
      updatedCategories = [...categories];
      if (editCategoryIndex !== null) {
        updatedCategories[editCategoryIndex] = newCategory;
      }
    }
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
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
    const updatedCategories = categories.filter((_, i) => i !== index);
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      activeSwipeableRef.current?.close(); // Reset Swipeable
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Open Edit modal
  const handleEditCategory = (index: number) => {
    const category = categories[index];
    setModalMode('edit');
    setEditCategoryIndex(index);
    setCategoryName(category.name);
    setSelectedIcon(category.icon);
    setModalVisible(true);
  };

  // Render displayCategory with swipe actions
  const renderCategory = ({ item, index }: { item: Category; index: number }) => {
    const renderLeftActions = () => (
      <TouchableOpacity
        onPress={() => handleEditCategory(index)}
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
        onPress={() => handleDeleteCategory(index)}
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
          marginVertical: 2.5,
        }}
      >
        <Swipeable
          ref={(ref) => {
            if (ref) activeSwipeableRef.current = ref;
          }}
          friction={1}
          leftThreshold={50}
          rightThreshold={50}
          renderLeftActions={renderLeftActions}
          renderRightActions={renderRightActions}
          onSwipeableOpen={() => {
            activeSwipeableRef.current = activeSwipeableRef.current || null;
          }}
        >
          <View
            className={`flex-row items-center border rounded-3xl shadow elevation-8 ${
              theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
            }`}
            style={{ width: displayCategoryWidth, height: displayCategoryHeight, paddingHorizontal: 16 }}
          >
            <FontAwesome6 name={item.icon} size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
            <Text
              className={`text-base ml-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>
        </Swipeable>
      </View>
    );
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
      {/* displayCategory List */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        style={{ marginTop: 16, marginBottom: elementHeight + 32 }}
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
          activeSwipeableRef.current?.close(); // Reset Swipeable
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

          {/* Modal Footer: Cancel and Create/Modify Buttons */}
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
                activeSwipeableRef.current?.close(); // Reset Swipeable
              }}
              style={{
                width: addCategoryWidth * 0.6,
                height: elementHeight * 0.8,
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
                width: addCategoryWidth * 0.6,
                height: elementHeight * 0.8,
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

      {/* Bottom Row: Add Category, Backup, Restore */}
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {/* Add Category */}
        <TouchableOpacity
          onPress={() => {
            setModalMode('add');
            setCategoryName('');
            setSelectedIcon(null);
            setModalVisible(true);
          }}
          style={{
            width: addCategoryWidth,
            height: elementHeight,
          }}
        >
          <View
            className={`flex items-center justify-center border rounded-3xl shadow elevation-8 ${
              theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
            }`}
            style={{ width: addCategoryWidth, height: elementHeight }}
          >
            <FontAwesome6 name="plus" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
            <Text className={`text-sm mt-2 text-center ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
              Add Category
            </Text>
          </View>
        </TouchableOpacity>

        {/* Backup */}
        <TouchableOpacity
          style={{
            width: backupRestoreWidth,
            height: elementHeight,
          }}
        >
          <View
            className={`flex items-center justify-center border rounded-3xl shadow elevation-8 ${
              theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
            }`}
            style={{ width: backupRestoreWidth, height: elementHeight }}
          >
            <MaterialIcons name="backup" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
            <Text className={`text-sm text-center ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
              Backup
            </Text>
          </View>
        </TouchableOpacity>

        {/* Restore */}
        <TouchableOpacity
          style={{
            width: backupRestoreWidth,
            height: elementHeight,
          }}
        >
          <View
            className={`flex items-center justify-center border rounded-3xl shadow elevation-8 ${
              theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
            }`}
            style={{ width: backupRestoreWidth, height: elementHeight }}
          >
            <MaterialIcons name="cloud-download" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
            <Text className={`text-sm text-center ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
              Restore
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
