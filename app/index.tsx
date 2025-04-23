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

  const renderCategory = ({ item }: { item: { name: string; icon: string } }) => <CategoryCard category={item} />;

  return (
    <View className={`flex-1 ${theme === 'light' ? 'bg-blue-100' : 'bg-gray-900'}`}>
      <ThemeToggle
        style={{
          position: 'absolute',
          left: 20, // px-5
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
            right: 20, // px-5
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
          top: 64 + quoteCardHeight + 30, // 30px spacing
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <FlatList
          data={
            categories.length > 0 ? categories : [{ name: '', icon: '' }] // Placeholder for "plus" card
          }
          renderItem={({ item }) => (item.name ? renderCategory({ item }) : <CategoryCard />)}
          keyExtractor={(item, index) => (item.name ? `${item.name}-${index}` : 'plus')}
          numColumns={3}
          contentContainerStyle={{
            paddingHorizontal: screenWidth * 0.02,
            paddingBottom: 16,
          }}
        />
      </View>
    </View>
  );
}
