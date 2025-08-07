import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { AppStackParamList } from './types';

// Import screens (will be created)
import HomeScreen from '@/screens/app/HomeScreen';
import ProfileScreen from '@/screens/app/ProfileScreen';
import SettingsScreen from '@/screens/app/SettingsScreen';

// You can customize icons here using react-native-vector-icons
// import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
        },
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="home" color={color} size={size} />
          // ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="person" color={color} size={size} />
          // ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="settings" color={color} size={size} />
          // ),
        }}
      />
    </Tab.Navigator>
  );
}