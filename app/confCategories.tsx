import { ThemeContext } from '@/contexts/ThemeContext';
import { useContext, useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

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
  const displayCategoryHeight = screenHeight * 0.07; // 9% height

  // Modal state
  const [isModalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);

  // Sample FontAwesome6 icons (curated list for simplicity; expand as needed)
  const fontAwesomeIcons = [
    'at',
    'trash-can',
    'stethoscope',
    'message',
    'file-text',
    'calendar-days',
    'volleyball',
    'icons',
    'fingerprint',
    'flag-checkered',
    'people-roof',
    'person',
    'laptop',
    'address-book',
    'pencil',
    'comments',
    'paw',
    'gavel',
    'binoculars',
    'motorcycle',
    'scissors',
    'film',
    'feather',
    'volume-low',
    'list',
    'campground',
    'tree',
    'edit',
    'car-side',
    'bag-shopping',
    'bicycle',
    'snowman',
    'school',
    'horse',
    'capsules',
    'umbrella-beach',
    'pen-clip',
    'cross',
    'passport',
    'people-carry-box',
    'microchip',
    'champagne-glasses',
    'mug-hot',
    'train',
    'cow',
    'suitcase',
    'seedling',
    'children',
    'church',
    'puzzle-piece',
    'code',
    'file-contract',
    'poop',
    'toilet-paper',
    'wrench',
    'cat',
    'wine-glass',
    'basket-shopping',
    'file-code',
    'house-chimney',
    'hand-holding-dollar',
    'phone',
    'book-bible',
    'paperclip',
    'person-skiing-nordic',
    'coins',
    'person-hiking',
    'calculator',
    'guitar',
    'paint-roller',
    'user-graduate',
    'gun',
    'tractor',
    'person-praying',
    'dog',
    'music',
    'gifts',
  ];

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
  const handleCreateCategory = async () => {
    if (!categoryName.trim() || !selectedIcon) {
      alert('Please enter a category name and select an icon');
      return;
    }
    const newCategory = { name: categoryName.trim(), icon: selectedIcon };
    const updatedCategories = [...categories, newCategory];
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      setCategoryName('');
      setSelectedIcon(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  // Render displayCategory
  const renderCategory = ({ item }: { item: Category }) => (
    <View
      style={{
        width: displayCategoryWidth,
        height: displayCategoryHeight,
        marginVertical: 2.5, //5px total padding
      }}
    >
      <View
        className={`flex-row items-center border rounded-3xl shadow elevation-8 ${
          theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
        }`}
        style={{ width: displayCategoryWidth, height: displayCategoryHeight, paddingHorizontal: 16 }}
      >
        <FontAwesome6 name={item.icon} size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
        <Text className={`text-base ml-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
    </View>
  );

  return (
    <View className={`flex-1 ${theme === 'light' ? 'bg-blue-100' : 'bg-gray-900'}`}>
      {/* displayCategory List */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        style={{ marginTop: 16, marginBottom: elementHeight + 32 }} // Space for bottom row
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />

      {/* Modal for Add Category */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{ justifyContent: 'center', margin: 16 }}
      >
        <View
          className={`rounded-2xl p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
          style={{ justifyContent: 'center', margin: 16 }}
        >
          <Text className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            Category Name
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
            Category Image
          </Text>
          <ScrollView style={{ maxHeight: 200, marginTop: 8 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {fontAwesomeIcons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setSelectedIcon(icon)}
                  style={{
                    width: '23%',
                    aspectRatio: 1,
                    margin: '1%',
                    borderWidth: selectedIcon === icon ? 2 : 0,
                    borderColor: theme === 'light' ? '1f2937' : '#ffffff',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FontAwesome6 name={icon} size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={handleCreateCategory}
            style={{
              width: addCategoryWidth * 0.6,
              height: elementHeight * 0.8,
              alignSelf: 'flex-end',
              marginTop: 16,
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
                Create Category
              </Text>
            </View>
          </TouchableOpacity>
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
          onPress={() => setModalVisible(true)}
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
