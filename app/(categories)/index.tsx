import {Pressable, Text, View} from "react-native";
import Fontisto from '@expo/vector-icons/Fontisto';
import {Link} from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
        <Link href={'/profile'} asChild>
            <Pressable className="absolute top-3 right-5">
                <Fontisto name="player-settings" size={24} color="purple" />
            </Pressable>
        </Link>
        <Text className="text-4xl text-teal-700 font-bold text-center mx-5">Laziness casts one into a deep sleep,
          and an idle person will suffer hunger.</Text>
        <Text className="text-2xl text-primary font-bold text-center">Proverbs 19:15</Text>
    </View>
  );
}
