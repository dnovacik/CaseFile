import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, minTouch, radii, spacing } from '@/theme';

type Props<T extends string> = {
  /** Names the group for screen readers, e.g. "Language". */
  label?: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <View style={styles.row} accessibilityRole="tablist" accessibilityLabel={label}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.segment, selected && styles.selected]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: 3,
    gap: 3,
  },
  segment: {
    flex: 1,
    minHeight: minTouch,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: spacing.sm,
  },
  selected: {
    backgroundColor: colors.slateRaised,
    borderColor: colors.brass,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.ivoryMuted,
    textAlign: 'center',
  },
  selectedLabel: {
    color: colors.ivory,
  },
});
