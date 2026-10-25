import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, minTouch, radii, spacing } from '@/theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: keyof typeof Ionicons.glyphMap;
  accessibilityHint?: string;
};

export function Button({ label, onPress, variant = 'primary', icon, accessibilityHint }: Props) {
  const primary = variant === 'primary';
  const color = primary ? colors.onBrass : colors.brass;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.label, { color }]}>{label}</Text>
        {icon ? <Ionicons name={icon} size={20} color={color} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minTouch + 8,
    borderRadius: radii.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.brass,
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.brass,
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
  },
});
