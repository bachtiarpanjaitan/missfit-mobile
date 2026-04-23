import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/main/DashboardScreen';
import PackagesScreen from '../screens/main/PackagesScreen';
import MyQuizzesScreen from '../screens/main/MyQuizzesScreen';
import RankingsScreen from '../screens/main/RankingsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e5e7eb',
    borderTopWidth: 1,
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});

const screenOptions = {
  headerShown: false,
  tabBarActiveTintColor: '#6366f1',
  tabBarInactiveTintColor: '#a1a5b4',
  tabBarStyle: styles.tabBar,
  tabBarLabelStyle: styles.tabBarLabel,
};

export default function MainNavigator() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Packages"
        component={PackagesScreen}
        options={{
          tabBarLabel: 'Paket',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyQuizzes"
        component={MyQuizzesScreen}
        options={{
          tabBarLabel: 'Paket Saya',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Rankings"
        component={RankingsScreen}
        options={{
          tabBarLabel: 'Peringkat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

