import {View, Text, Image} from 'react-native'
import React from 'react'
import {Tabs} from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const _Layout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'All Tasks',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <FontAwesome5 name="tasks" size={24} color="black" />
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <AntDesign name="home" size={24} color="black" />
                }} />
            <Tabs.Screen
                name="work"
                options={{
                    title: 'Work',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <FontAwesome6 name="person-digging" size={24} color="black" />
                }} />
            <Tabs.Screen
                name="sport"
                options={{
                    title: 'Sport',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <MaterialIcons name="sports-gymnastics" size={24} color="black" />
                }} />
            <Tabs.Screen
                name="god"
                options={{
                    title: 'God',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <FontAwesome5 name="bible" size={24} color="black" />
                }} />
        </Tabs>
    )
}
export default _Layout
