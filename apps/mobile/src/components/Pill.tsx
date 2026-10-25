import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, spacing } from '@/theme';

type Props = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  tone?: 'brass' | 'muted';
};

/** Small status or category badge. Always text (plus optional icon), never colour alone. */
export function Pill({ label, icon, tone = 'brass' }: Props) {
  const color = tone === 'brass' ? colors.brass : colors.ivoryMuted;
  return (
    <View style={[styles.pill, { borderColor: tone === 'brass' ? colors.brassDim : colors.line }]}>
      {icon ? <Ionicons name={icon} size={14} color={color} /> : null}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
