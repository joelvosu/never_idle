import ThemeToggle from '@/components/ThemeToggle';
import { ThemeContext } from '@/contexts/ThemeContext';
import { CategoryContext } from '@/contexts/CategoryContext';
import { useContext } from 'react';
import { View, Dimensions, Text, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QuoteCard from '@/components/QuoteCard';
import CategoryCard from '@/components/CategoryCard';

export default function Home() {
  const { theme } = useContext(ThemeContext);
  const { categories } = useContext(CategoryContext);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const quoteCardHeight = screenHeight * 0.15; // 15% of screen height
  const containerWidth = screenWidth * 0.9; // 90% of screen width for CategoryCards
  const marginHorizontal = screenWidth * 0.05; // 5% margin on each side

  // Prepare data with placeholder items to ensure multiple of 3
  const prepareData = () => {
    let data = categories.length > 0 ? categories : [{ name: '', icon: 'plus' }];
    const remainder = data.length % 3;
    if (remainder !== 0) {
      // Add invisible placeholder items to complete the row
      const placeholdersNeeded = 3 - remainder;
      const placeholders = Array(placeholdersNeeded).fill({ name: '', icon: '', isPlaceholder: true });
      data = [...data, ...placeholders];
    }
    return data;
  };

  const renderCategory = ({ item }: { item: { name: string; icon: string; isPlaceholder?: boolean } }) => {
    if (item.isPlaceholder) {
      // Render an invisible placeholder with the same dimensions
      return <View style={{ width: screenWidth * 0.29, height: screenWidth * 0.29 }} />;
    }
    return <CategoryCard category={item} />;
  };

  const RowSeparator = () => <View style={{ height: screenWidth * 0.015 }} />; // 1.5% of screen width

  return (
    <View className={`flex-1 ${theme === 'light' ? 'bg-blue-100' : 'bg-gray-900'}`}>
      <ThemeToggle
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
        }}
      />
      <View className="absolute top-4 box-border" style={{ width: screenWidth, height: 44 }}>
        <Text
          className={`text-4xl font-semibold ${theme === 'light' ? 'text-teal-700' : 'text-teal-400'}`}
          style={{
            position: 'absolute',
            left: 80,
            bottom: 0,
            fontFamily: 'Roboto',
          }}
        >
          Never Idle
        </Text>
        <Link
          href="/confCategories"
          asChild
          style={{
            position: 'absolute',
            right: 20,
            bottom: 4,
          }}
        >
          <Ionicons name="settings" size={24} color={theme === 'light' ? '#1f2937' : '#ffffff'} />
        </Link>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 64,
          left: 0,
          right: 0,
          height: quoteCardHeight,
        }}
      >
        <QuoteCard />
      </View>
      <View
        style={{
          position: 'absolute',
          top: 64 + quoteCardHeight + 30,
          left: marginHorizontal,
          width: containerWidth,
          bottom: 0,
        }}
      >
        <FlatList
          data={prepareData()}
          renderItem={renderCategory}
          keyExtractor={(item, index) => (item.name ? `${item.name}-${index}` : `placeholder-${index}`)}
          numColumns={3}
          contentContainerStyle={{
            paddingBottom: 16,
          }}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          ItemSeparatorComponent={RowSeparator}
        />
      </View>
    </View>
  );
}
