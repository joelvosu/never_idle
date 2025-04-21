import { useContext, useRef, useEffect } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Quote, quotes } from '@/data/quotes';
import ReanimatedCarousel from 'react-native-reanimated-carousel';

export default function QuoteCard() {
  const { theme } = useContext(ThemeContext);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const cardWidth = screenWidth * 0.9; // 90% of screen width
  const padding = screenWidth * 0.1; // 10% padding total
  const cardHeight = screenHeight * 0.15; // 15% of screen height
  const carouselRef = useRef<any>(null);

  // Initial scroll to first item
  useEffect(() => {
    const scrollToInitial = () => {
      carouselRef.current?.scrollTo({ index: 0, animated: false });
    };
    scrollToInitial();
    // Retry after a delay to handle Android rendering
    const timer = setTimeout(scrollToInitial, 200);
    return () => clearTimeout(timer);
  }, []);

  const renderItem = ({ item }: { item: Quote }) => (
    <View style={{ paddingLeft: screenWidth * 0.05, width: screenWidth }}>
      <View
        className={`w-[${cardWidth}px] p-4 rounded-3xl shadow elevation-8 border ${
          theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'
        } flex items-center justify-center`}
        style={{ width: cardWidth, height: cardHeight }}
      >
        <Text
          className={`text-lg font-bold text-center ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}
          style={{ width: cardWidth - 32 }} // Account for 16px padding on each side
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          "{item.quote}"
        </Text>
        <Text
          className={`text-sm mt-2 text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}
          style={{ width: cardWidth - 32 }}
        >
          — {item.author}
        </Text>
      </View>
    </View>
  );

  return (
    <ReanimatedCarousel
      ref={carouselRef}
      data={quotes}
      renderItem={renderItem}
      width={screenWidth}
      height={cardHeight}
      loop={true}
      autoPlay={false}
      scrollAnimationDuration={500}
      style={{ width: screenWidth }}
      snapEnabled={true}
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 1,
        parallaxScrollingOffset: screenWidth * 0.05, // 5% gap (~20px on 400px screen)
        parallaxAdjacentItemScale: 1,
      }}
    />
  );
}
