import { View, Text } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function ConfCategories() {
  const { theme } = useContext(ThemeContext);

  return (
    <View className={`flex-1 items-center justify-center ${theme === 'light' ? 'bg-blue-100' : 'bg-gray-900'}`}>
      <Text className={`text-lg font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        Configuration Categories (TBD)
      </Text>
    </View>
  );
}
