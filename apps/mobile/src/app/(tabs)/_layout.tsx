import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUi } from '@/i18n';
import { colors, fonts } from '@/theme';

/** Tall enough for 13 pt labels; the default 49 pt bar is sized for 10 pt labels. */
const TAB_BAR_HEIGHT = 60;

export default function TabsLayout() {
  // A custom height replaces the navigator's own inset handling, so add the inset back.
  const insets = useSafeAreaInsets();
  const ui = useUi();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.abyss },
        tabBarStyle: {
          backgroundColor: colors.abyss,
          borderTopColor: colors.line,
          height: TAB_BAR_HEIGHT + insets.bottom,
        },
        tabBarActiveTintColor: colors.brass,
        tabBarInactiveTintColor: colors.ivoryMuted,
        tabBarLabelStyle: { fontFamily: fonts.sansMedium, fontSize: 13, lineHeight: 16 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: ui.tabs.cases,
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? 'folder' : 'folder-outline'}
              size={size}
              color={focused ? colors.brass : colors.ivoryMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: ui.tabs.settings,
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={size}
              color={focused ? colors.brass : colors.ivoryMuted}
            />
          ),
        }}
      />
    </Tabs>
  );
}
