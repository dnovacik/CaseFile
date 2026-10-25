import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, minTouch, spacing, type } from '@/theme';

type Props = {
  backLabel: string;
  /** Where to go when there's no history (e.g. after a deep link). */
  fallbackHref: string;
  right?: ReactNode;
};

export function BackHeader({ backLabel, fallbackHref, right }: Props) {
  return (
    <View style={styles.bar}>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace(fallbackHref))}
        accessibilityRole="button"
        accessibilityLabel={backLabel}
        hitSlop={8}
        style={styles.back}
      >
        <Ionicons name="chevron-back" size={24} color={colors.brass} />
        <Text style={type.label}>{backLabel}</Text>
      </Pressable>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: minTouch,
  },
  back: {
    minHeight: minTouch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingRight: spacing.sm,
  },
});
