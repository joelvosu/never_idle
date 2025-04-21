import { ThemeContext } from '@/contexts/ThemeContext';
import { useContext } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';

export default function ConfCategories() {
  const { theme } = useContext(ThemeContext);
  const screenWidth = Dimensions.get('window').width;
  const addCategoryWidth = screenWidth * 0.4; // 40% width
  const backupRestoreWidth = screenWidth * 0.2; // 20% width
  const elementHeight = screenWidth * 0.2; // 20% width height

  return (
    <View className={`flex-1 ${theme === 'light' ? 'bg-blue-100' : 'bg-gray-900'}`}>
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
