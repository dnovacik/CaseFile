import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ui } from '@/i18n/en';
import { MAX_SELECTED_FACTS, useProgressStore, useSelectedFacts } from '@/state/progress';
import { colors, minTouch, spacing, type } from '@/theme';

/** Bottom bar showing the fact selection and opening the compare sheet once two are picked. */
export function CompareTray({ caseId }: { caseId: string }) {
  const selected = useSelectedFacts(caseId);
  const clearSelection = useProgressStore((state) => state.clearSelection);
  const insets = useSafeAreaInsets();
  const ready = selected.length === MAX_SELECTED_FACTS;

  return (
    <View style={[styles.tray, { paddingBottom: insets.bottom + spacing.md }]}>
      {ready ? (
        <Button
          label={ui.evidence.compare(selected.length)}
          icon="git-compare-outline"
          onPress={() => router.push(`/case/${caseId}/compare`)}
        />
      ) : (
        <Text style={[type.meta, styles.hint]} accessibilityLiveRegion="polite">
          {ui.evidence.compare(selected.length)}
        </Text>
      )}
      {selected.length > 0 ? (
        <Pressable
          onPress={() => clearSelection(caseId)}
          accessibilityRole="button"
          style={styles.clear}
        >
          <Text style={[type.label, { color: colors.brass }]}>{ui.evidence.clear}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.abyss,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  hint: {
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  clear: {
    minHeight: minTouch,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
