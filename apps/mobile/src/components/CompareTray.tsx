import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { getCase, useCaseText } from '@/content/cases';
import { useUi } from '@/i18n';
import { MAX_SELECTED_FACTS, useProgressStore, useSelectedFacts } from '@/state/progress';
import { colors, fonts, minTouch, radii, spacing, type } from '@/theme';

/**
 * Bottom bar showing the fact selection. It names the picked fact and says plainly that the
 * second one can come from any evidence, then opens the compare sheet (which can pick it too).
 */
export function CompareTray({ caseId }: { caseId: string }) {
  const content = getCase(caseId)!;
  const t = useCaseText(content);
  const ui = useUi();
  const selected = useSelectedFacts(caseId);
  const clearSelection = useProgressStore((state) => state.clearSelection);
  const insets = useSafeAreaInsets();
  const facts = selected
    .map((id) => content.definition.facts.find((f) => f.id === id))
    .filter((f) => !!f);
  const openCompare = () => router.push(`/case/${caseId}/compare`);

  return (
    <View
      style={[styles.tray, { paddingBottom: insets.bottom + spacing.md }]}
      accessibilityLiveRegion="polite"
    >
      {facts.length === 0 ? (
        <Text style={[type.meta, styles.center]}>{ui.evidence.trayEmpty}</Text>
      ) : (
        facts.map((fact) => (
          <View key={fact.id} style={styles.fact}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{fact.evidenceId}</Text>
            </View>
            <Text style={[type.meta, styles.factText]} numberOfLines={2}>
              {t(fact.textKey)}
            </Text>
          </View>
        ))
      )}

      {facts.length === 1 ? (
        <>
          <Text style={[type.label, styles.center, { color: colors.brass }]}>
            {ui.evidence.trayOne}
          </Text>
          <Button
            label={ui.evidence.chooseFromAll}
            variant="secondary"
            icon="list-outline"
            onPress={openCompare}
          />
        </>
      ) : null}

      {facts.length === MAX_SELECTED_FACTS ? (
        <Button
          label={ui.evidence.compare(facts.length)}
          icon="git-compare-outline"
          onPress={openCompare}
        />
      ) : null}

      {facts.length > 0 ? (
        <Pressable
          onPress={() => clearSelection(caseId)}
          accessibilityRole="button"
          style={styles.clear}
        >
          <Ionicons name="close-circle-outline" size={18} color={colors.ivoryMuted} />
          <Text style={type.meta}>{ui.evidence.clear}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.abyss,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  center: {
    textAlign: 'center',
  },
  fact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: colors.brassDim,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  tagText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ivory,
  },
  factText: {
    flex: 1,
    color: colors.ivory,
  },
  clear: {
    minHeight: minTouch,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
});
