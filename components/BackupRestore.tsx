import { useContext, useState } from 'react';
import { TouchableOpacity, View, Alert, Text, Dimensions, StyleProp, ViewStyle } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { CategoryContext } from '@/contexts/CategoryContext';
import { TodoContext } from '@/contexts/TodoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

interface BackupData {
  timestamp: string;
  categories: { name: string; icon: string }[];
  todos: { id: string; name: string; completed: boolean; category: string; comment: string }[];
  theme: 'light' | 'dark';
}

interface BackupRestoreProps {
  size: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function BackupButton({ size, style }: BackupRestoreProps) {
  const { theme } = useContext(ThemeContext);

  const handleBackup = async () => {
    // Declare fileUri outside try-catch
    const timestamp = new Date().toISOString();
    const fileUri = `${FileSystem.cacheDirectory}backup-${timestamp.replace(/[:.]/g, '-')}.json`;

    try {
      // Collect data from AsyncStorage
      const categories = await AsyncStorage.getItem('categories');
      const todos = await AsyncStorage.getItem('todoItems');
      const themeSetting = await AsyncStorage.getItem('theme');

      // Prepare backup data with timestamp
      const backupData: BackupData = {
        timestamp,
        categories: categories ? JSON.parse(categories) : [],
        todos: todos ? JSON.parse(todos) : [],
        theme: themeSetting ? (themeSetting as 'light' | 'dark') : 'light',
      };

      // Save to temporary file in cache directory
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2), {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      // Attempt to share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Share Backup File',
        UTI: 'public.json',
      });

      // Clean up file (assume cancellation unless confirmed saved)
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    } catch (error) {
      console.error('Backup error:', error);
      // Clean up file on error
      try {
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      Alert.alert('Error', 'Failed to create or share backup');
    }
  };

  return (
    <TouchableOpacity onPress={handleBackup} style={style}>
      <View
        className={`rounded-full border shadow elevation-8 ${
          theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
        }`}
        style={{
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MaterialIcons name="backup" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
      </View>
    </TouchableOpacity>
  );
}

export function RestoreButton({ size, style }: BackupRestoreProps) {
  const { theme, setTheme } = useContext(ThemeContext);
  const { refreshCategories } = useContext(CategoryContext);
  const { refreshTodos } = useContext(TodoContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [backupData, setBackupData] = useState<BackupData | null>(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const handleRestore = async () => {
    try {
      // Open document picker
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        Alert.alert('Cancelled', 'No file selected');
        return;
      }

      // Read file
      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Parse and validate
      const data: BackupData = JSON.parse(fileContent);
      if (
        !data.timestamp ||
        !Array.isArray(data.categories) ||
        !Array.isArray(data.todos) ||
        !['light', 'dark'].includes(data.theme)
      ) {
        Alert.alert('Error', 'Invalid backup file');
        return;
      }

      // Show modal with timestamp
      setBackupData(data);
      setModalVisible(true);
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Failed to read backup file');
    }
  };

  const confirmRestore = async () => {
    if (!backupData) return;

    try {
      // Clear current AsyncStorage
      await AsyncStorage.multiRemove(['categories', 'todoItems', 'theme']);

      // Save new data
      await AsyncStorage.multiSet([
        ['categories', JSON.stringify(backupData.categories)],
        ['todoItems', JSON.stringify(backupData.todos)],
        ['theme', backupData.theme],
      ]);

      // Update app state
      setTheme(backupData.theme);
      await refreshCategories();
      await refreshTodos();

      setModalVisible(false);
      setBackupData(null);
      Alert.alert('Success', 'Data restored successfully');
    } catch (error) {
      console.error('Restore confirm error:', error);
      Alert.alert('Error', 'Failed to restore data');
    }
  };

  const cancelRestore = () => {
    setModalVisible(false);
    setBackupData(null);
  };

  return (
    <>
      <TouchableOpacity onPress={handleRestore} style={style}>
        <View
          className={`rounded-full border shadow elevation-8 ${
            theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
          }`}
          style={{
            width: size,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MaterialIcons name="cloud-download" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
        </View>
      </TouchableOpacity>

      {/* Restore Confirmation Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={cancelRestore}
        style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
      >
        <View
          className={`rounded-2xl p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
          style={{ width: screenWidth * 0.8, maxHeight: screenHeight * 0.7, alignSelf: 'center' }}
        >
          <Text className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            Restore Backup
          </Text>
          <Text className={`text-base mt-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            Backup created on: {backupData ? new Date(backupData.timestamp).toLocaleString() : ''}
          </Text>
          <Text className={`text-base mt-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            This will overwrite all current data. Proceed?
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
              onPress={cancelRestore}
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

            {/* Restore Button */}
            <TouchableOpacity
              onPress={confirmRestore}
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
                <MaterialIcons name="restore" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
                <Text className={`text-sm ml-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Restore</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
