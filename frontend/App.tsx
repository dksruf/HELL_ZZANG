import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NutritionProvider } from './context/NutritionContext';
import './styles/index.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <NutritionProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
        </NavigationContainer>
      </NutritionProvider>
    </SafeAreaProvider>
  );
} 