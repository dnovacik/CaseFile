import Ionicons from '@expo/vector-icons/Ionicons';
import {
  getAvailableActionIds,
  getHintTarget,
  type CaseDefinition,
  type Deduction,
  type HintResult,
  type Id,
} from '@casefile/engine';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { AccessibilityInfo, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader } from '@/components/BackHeader';
import { Button } from '@/components/Button';
import { caseText, getCase, type CaseContent } from '@/content/cases';
import { ui } from '@/i18n/en';
import { dispatch, useCaseProgress } from '@/state/progress';
import { colors, fonts, minTouch, radii, spacing, type } from '@/theme';

export default function DeductionBoard() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const content = getCase(caseId);
  if (!content) return null;
  return <Board content={content} />;
}

/** Evidence a deduction rests on, for the source chips. Derived from its requirements. */
function sourceEvidence(def: CaseDefinition, deduction: Deduction): Id[] {
  const factIds = [
    ...(deduction.requires.factIds ?? []),
    ...def.relationships
      .filter((r) => deduction.requires.relationshipIds?.includes(r.id))
      .flatMap((r) => r.factIds),
  ];
  const evidenceIds = factIds
    .map((id) => def.facts.find((f) => f.id === id)?.evidenceId)
    .filter((id): id is Id => id !== undefined);
  return [...new Set(evidenceIds)].sort();
}

function Board({ content }: { content: CaseContent }) {
  const { definition } = content;
  const t = caseText(content);
  const progress = useCaseProgress(definition);
  const insets = useSafeAreaInsets();
  const [revealed, setRevealed] = useState<Id[]>([]);

  const unlocked = definition.deductions.filter((d) =>
    progress.unlockedDeductionIds.includes(d.id),
  );
  const requiredIds = new Set([
    ...definition.deductions.filter((d) => d.mandatory).map((d) => d.id),
    ...definition.conclusions.flatMap((c) => c.requiresDeductionIds),
  ]);
  const remaining = [...requiredIds].filter((id) => !progress.unlockedDeductionIds.includes(id));
  const actions = getAvailableActionIds(definition, progress)
    .map((id) => definition.actions.find((a) => a.id === id))
    .filter((a) => !!a);
  const reportReady = remaining.length === 0;
  const caseId = definition.id;

  const perform = (actionId: Id) => {
    const result = dispatch(definition, { type: 'performAction', actionId });
    if (result.code === 'valid') {
      setRevealed(result.revealedEvidenceIds);
      AccessibilityInfo.announceForAccessibility(ui.board.revealed);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackHeader backLabel={ui.board.back} fallbackHref={`/case/${caseId}/evidence`} />
        <Text style={type.title} accessibilityRole="header">
          {t(definition.titleKey)}
        </Text>
        <Text style={[type.heading, styles.muted]}>{ui.board.title}</Text>

        {unlocked.length === 0 ? (
          <Text style={[type.body, styles.muted]}>{ui.board.empty}</Text>
        ) : (
          <View style={styles.chain}>
            {unlocked.map((deduction, index) => (
              <View key={deduction.id} style={styles.step}>
                <View style={styles.rail}>
                  <View style={styles.node}>
                    <Ionicons name="checkmark" size={18} color={colors.onBrass} />
                  </View>
                  {index < unlocked.length - 1 ? <View style={styles.line} /> : null}
                </View>
                <View style={styles.deductionCard}>
                  <View style={styles.tags}>
                    <Tag label={deduction.id} />
                    <Text style={styles.status}>
                      {deduction.mandatory ? ui.board.confirmed : ui.board.optional}
                    </Text>
                  </View>
                  <Text style={styles.deductionTitle}>{t(deduction.titleKey)}</Text>
                  <Text style={type.body}>{t(deduction.descriptionKey)}</Text>
                  <View style={styles.sources}>
                    {sourceEvidence(definition, deduction).map((evidenceId) => (
                      <Pressable
                        key={evidenceId}
                        onPress={() => router.push(`/case/${caseId}/evidence/${evidenceId}`)}
                        accessibilityRole="link"
                        accessibilityLabel={`${evidenceId}, ${t(
                          definition.evidence.find((e) => e.id === evidenceId)?.titleKey ?? '',
                        )}`}
                        style={styles.sourceChip}
                      >
                        <Ionicons name="document-text-outline" size={16} color={colors.brass} />
                        <Text style={type.label}>{evidenceId}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.progressCard} accessibilityLiveRegion="polite">
          <Ionicons
            name={reportReady ? 'checkmark-done-outline' : 'help-circle-outline'}
            size={24}
            color={colors.brass}
          />
          <Text style={[type.body, styles.flex]}>{ui.board.remaining(remaining.length)}</Text>
        </View>

        {actions.map((action) => (
          <View key={action.id} style={styles.actionCard}>
            <Text style={type.overline}>{ui.board.actionsTitle}</Text>
            <Text style={styles.deductionTitle}>{t(action.titleKey)}</Text>
            {action.justificationKey ? (
              <Text style={type.body}>{t(action.justificationKey)}</Text>
            ) : null}
            <Button
              label={ui.board.performAction}
              icon="search-outline"
              onPress={() => perform(action.id)}
            />
          </View>
        ))}

        {revealed.length > 0 ? (
          <View style={[styles.actionCard, styles.revealedCard]} accessibilityLiveRegion="polite">
            <Text style={type.overline}>{ui.board.revealed}</Text>
            {revealed.map((evidenceId) => {
              const evidence = definition.evidence.find((e) => e.id === evidenceId);
              return (
                <View key={evidenceId} style={styles.revealedRow}>
                  <Text style={[type.heading, styles.flex]}>
                    {evidenceId} · {t(evidence?.titleKey ?? '')}
                  </Text>
                  <Button
                    label={ui.board.viewEvidence}
                    variant="secondary"
                    onPress={() => router.push(`/case/${caseId}/evidence/${evidenceId}`)}
                  />
                </View>
              );
            })}
          </View>
        ) : null}

        <HintPanel content={content} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {!reportReady ? (
          <Text style={[type.meta, styles.footerHint]}>{ui.board.reportLocked}</Text>
        ) : null}
        <Button
          label={ui.board.report}
          icon="document-text-outline"
          disabled={!reportReady}
          onPress={() => router.push(`/case/${caseId}/report`)}
        />
      </View>
    </SafeAreaView>
  );
}

type HintState = { targetId: Id; result: HintResult } | null;

function HintPanel({ content }: { content: CaseContent }) {
  const { definition } = content;
  const progress = useCaseProgress(definition);
  const [hint, setHint] = useState<HintState>(null);
  const target = getHintTarget(definition, progress);
  // A hint only applies while its target is still the current one.
  const current = hint && hint.targetId === target ? hint : null;
  const stage = current && current.result.code === 'valid' ? current.result.stage : 0;

  const ask = (next: 1 | 2 | 3) => {
    if (!target) return;
    const result = dispatch(definition, { type: 'requestHint', stage: next });
    setHint({ targetId: target, result });
  };

  const revealedLink = hint?.result.code === 'valid' && hint.result.stage === 3;

  return (
    <View style={styles.hintCard}>
      <View style={styles.hintHeader}>
        <Ionicons name="bulb-outline" size={22} color={colors.brass} />
        <Text style={[type.heading, styles.flex]}>{ui.board.hint.title}</Text>
        <Text style={type.meta}>{ui.board.hint.used(progress.hintsUsed)}</Text>
      </View>
      {revealedLink && !current ? <Text style={type.body}>{ui.board.hint.revealed}</Text> : null}
      {!target ? (
        <Text style={[type.body, styles.muted]}>{ui.board.hint.none}</Text>
      ) : (
        <>
          {current?.result.code === 'valid' && current.result.stage >= 1 ? (
            <HintBody result={current.result} content={content} />
          ) : null}
          {stage === 0 ? (
            <Button label={ui.board.hint.ask} variant="secondary" onPress={() => ask(1)} />
          ) : null}
          {stage === 1 ? (
            <Button label={ui.board.hint.more} variant="secondary" onPress={() => ask(2)} />
          ) : null}
          {stage === 2 ? (
            <Button label={ui.board.hint.reveal} variant="secondary" onPress={() => ask(3)} />
          ) : null}
        </>
      )}
    </View>
  );
}

function HintBody({ result, content }: { result: HintResult; content: CaseContent }) {
  const t = caseText(content);
  if (result.code !== 'valid') return null;
  if (result.stage === 1) return <Text style={type.body}>{t(result.nudgeKey)}</Text>;
  if (result.stage === 2) {
    return (
      <View style={styles.hintFacts}>
        <Text style={type.label}>{ui.board.hint.focus}</Text>
        {result.factIds.map((id) => {
          const fact = content.definition.facts.find((f) => f.id === id);
          return (
            <Text key={id} style={type.body}>
              • {fact ? `${fact.evidenceId}: ${t(fact.textKey)}` : id}
            </Text>
          );
        })}
      </View>
    );
  }
  return null;
}

function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  muted: {
    color: colors.ivoryMuted,
  },
  flex: {
    flex: 1,
  },
  chain: {
    gap: 0,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rail: {
    alignItems: 'center',
    width: 32,
  },
  node: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brass,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.brassDim,
  },
  deductionCard: {
    flex: 1,
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  status: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 1,
    color: colors.brass,
    textTransform: 'uppercase',
  },
  deductionTitle: {
    ...type.heading,
    fontFamily: fonts.serifBold,
  },
  sources: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sourceChip: {
    minHeight: minTouch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
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
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.brassDim,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  actionCard: {
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: colors.brass,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  revealedCard: {
    borderColor: colors.brassDim,
  },
  revealedRow: {
    gap: spacing.md,
  },
  hintCard: {
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  hintFacts: {
    gap: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.abyss,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  footerHint: {
    textAlign: 'center',
  },
});
