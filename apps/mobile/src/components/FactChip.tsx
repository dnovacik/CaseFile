import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useUi } from '@/i18n';
import { colors, minTouch, radii, spacing, type } from '@/theme';

type Props = {
  text: string;
  selected: boolean;
  onPress: () => void;
};

/** A selectable fact excerpt. Selection shows a check icon and border, not colour alone. */
export function FactChip({ text, selected, onPress }: Props) {
  const ui = useUi();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityHint={ui.evidence.selectFact}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      <Ionicons
        name={selected ? 'checkmark-circle' : 'add-circle-outline'}
        size={22}
        color={colors.brass}
      />
      <Text style={[type.body, styles.text]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: minTouch,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.slate,
  },
  selected: {
    borderColor: colors.brass,
    backgroundColor: colors.slateRaised,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    flex: 1,
  },
});
