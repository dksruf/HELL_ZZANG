import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#333333',  // 활성 탭 색상을 짙은 회색으로 변경
        tabBarInactiveTintColor: '#666666',  // 비활성 탭 색상
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',  // 탭 바 배경색을 흰색으로 설정
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',  // 상단 테두리 색상
          height: Platform.OS === 'ios' ? 60 : 45,  // 탭 바 높이 더 줄임
          paddingBottom: Platform.OS === 'ios' ? 8 : 3,  // 하단 패딩 더 줄임
        },
        tabBarLabelStyle: {
          fontSize: 10,  // 폰트 크기도 약간 더 줄임
          marginTop: -2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="gearshape" color={color} />,
        }}
      />
    </Tabs>
  );
}
