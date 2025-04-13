import {View, Text} from 'react-native'
import React from 'react'
import {Tabs} from "expo-router";

const _Layout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Index',
                    headerShown: false,
                }} />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                }} />
            <Tabs.Screen
                name="work"
                options={{
                    title: 'Work',
                    headerShown: false,
                }} />
            <Tabs.Screen
                name="sport"
                options={{
                    title: 'Sport',
                    headerShown: false,
                }} />
            <Tabs.Screen
                name="god"
                options={{
                    title: 'God',
                    headerShown: false,
                }} />
        </Tabs>
    )
}
export default _Layout
