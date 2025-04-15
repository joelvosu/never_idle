import {View, Text, TextInput, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileInput() {
    const [name, setName] = useState('');
    const [savedName, setSavedName] = useState('');

    //Load saved name when the component loads
    useEffect(() => {
        const loadName = async () => {
            try {
                const storedName = await AsyncStorage.getItem('profileName');
                if (storedName) {
                    setSavedName(storedName);
                    setName(storedName);
                }
            } catch (error) {
                console.log('Error loading name:', error);
            }
        };
        loadName();
    }, []);

    // Save name to AsynaStorage
    const saveName = async () => {
        try {
            await AsyncStorage.setItem('profileName', name);
            setSavedName(name);
        } catch (error) {
            console.log('Error saving name:', error);
        }
    };

    return (
        <View className="flex-1 p-4 bg-gray-100">
            <Text className="text-xl font-bold mb-4">Your Profile</Text>
            <TextInput
                className="bg-white p-3 rounded mb-4 border border-gray-300"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
            />
            <Pressable
                className="bg-blue-500 p-3 rounded"
                onPress={saveName}
            >
                <Text className="text-white text-center">Save Name</Text>
            </Pressable>
            {savedName ? (
                <Text className="mt-4 text-lg">Saved Name: {savedName}</Text>
            ) : null}
        </View>
    );
}