import Ionicons from '@expo/vector-icons/Ionicons';
import {
  RELATION_TYPES,
  type Fact,
  type Id,
  type RelationType,
  type ResultCode,
} from '@casefile/engine';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { AccessibilityInfo, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { FactChip } from '@/components/FactChip';
import { getCase, useCaseText, type CaseContent } from '@/content/cases';
import { useUi } from '@/i18n';
import { dispatch, useCaseProgress, useProgressStore, useSelectedFacts } from '@/state/progress';
import { colors, fonts, minTouch, radii, spacing, type } from '@/theme';

const relationIcon: Record<RelationType, 'link-outline' | 'shuffle-outline' | 'time-outline'> = {
  supports: 'link-outline',
  contradicts: 'shuffle-outline',
  same_event: 'time-outline',
};

type Outcome = { code: ResultCode; deductionIds: string[] };

export default function CompareSheet() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const content = getCase(caseId);
  if (!content) return null;
  return <Compare content={content} />;
}

function Compare({ content }: { content: CaseContent }) {
  const ui = useUi();
  const { definition } = content;
  const selected = useSelectedFacts(definition.id);
  const clearSelection = useProgressStore((state) => state.clearSelection);
  const toggleFact = useProgressStore((state) => state.toggleFact);
  // No relationship is preselected; the player has to choose.
  const [relation, setRelation] = useState<RelationType | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  // Once analyzed, keep showing the compared pair even though a valid link clears the selection.
  const [analyzedPair, setAnalyzedPair] = useState<Id[] | null>(null);
  const pair = analyzedPair ?? selected;

  const facts = pair.map((id) => definition.facts.find((f) => f.id === id)).filter((f) => !!f);

  const change = (factId: Id) => {
    toggleFact(definition.id, factId);
    setRelation(null);
  };

  const analyze = () => {
    if (!relation || facts.length !== 2) return;
    setAnalyzedPair([facts[0]!.id, facts[1]!.id]);
    const result = dispatch(definition, {
      type: 'linkFacts',
      factIds: [facts[0]!.id, facts[1]!.id],
      relation,
    });
    const deductionIds = result.code === 'valid' ? result.unlockedDeductionIds : [];
    if (result.code === 'valid') clearSelection(definition.id);
    setOutcome({ code: result.code, deductionIds });
    AccessibilityInfo.announceForAccessibility(ui.compare.results[result.code]);
  };

  const close = () => router.back();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={type.title} accessibilityRole="header">
            {ui.compare.title}
          </Text>
          <Pressable
            onPress={close}
            accessibilityRole="button"
            accessibilityLabel={ui.compare.close}
            hitSlop={8}
            style={styles.close}
          >
            <Ionicons name="close" size={28} color={colors.brass} />
          </Pressable>
        </View>

        {facts.length === 0 ? <Text style={type.body}>{ui.compare.missing}</Text> : null}

        {facts.length === 1 ? (
          <>
            <FactCard fact={facts[0]!} label={ui.compare.factA} content={content} />
            <FactPicker
              content={content}
              exclude={facts[0]!.id}
              onPick={(id) => toggleFact(definition.id, id)}
            />
          </>
        ) : null}

        {facts.length === 2 ? (
          <>
            <Text style={[type.body, styles.muted]}>{ui.compare.intro}</Text>
            {facts.map((fact, index) => (
              <FactCard
                key={fact.id}
                fact={fact}
                label={index === 0 ? ui.compare.factA : ui.compare.factB}
                content={content}
                onChange={outcome ? undefined : () => change(fact.id)}
              />
            ))}

            {outcome ? (
              <Result outcome={outcome} content={content} />
            ) : (
              <>
                <Text style={type.heading}>{ui.compare.question}</Text>
                <View accessibilityRole="radiogroup" style={styles.options}>
                  {RELATION_TYPES.map((value) => {
                    const checked = relation === value;
                    const copy = ui.compare.relations[value];
                    return (
                      <Pressable
                        key={value}
                        onPress={() => setRelation(value)}
                        accessibilityRole="radio"
                        accessibilityState={{ checked }}
                        accessibilityLabel={`${copy.label}. ${copy.description}`}
                        style={[styles.option, checked && styles.optionChecked]}
                      >
                        <Ionicons name={relationIcon[value]} size={24} color={colors.brass} />
                        <View style={styles.optionText}>
                          <Text style={[type.label, styles.optionLabel]}>{copy.label}</Text>
                          <Text style={type.meta}>{copy.description}</Text>
                        </View>
                        <Ionicons
                          name={checked ? 'radio-button-on' : 'radio-button-off'}
                          size={22}
                          color={checked ? colors.brass : colors.ivoryMuted}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
          </>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {outcome ? (
          outcome.code === 'valid' ? (
            <Button label={ui.compare.done} onPress={close} />
          ) : (
            <Button label={ui.compare.tryAgain} variant="secondary" onPress={close} />
          )
        ) : facts.length === 2 ? (
          <Button
            label={ui.compare.analyze}
            icon="sparkles-outline"
            onPress={analyze}
            disabled={relation === null}
            accessibilityHint={relation ? undefined : ui.compare.question}
          />
        ) : (
          <Button label={ui.compare.close} variant="secondary" onPress={close} />
        )}
      </View>
    </SafeAreaView>
  );
}

function FactCard({
  fact,
  label,
  content,
  onChange,
}: {
  fact: Fact;
  label: string;
  content: CaseContent;
  onChange?: () => void;
}) {
  const t = useCaseText(content);
  const ui = useUi();
  const source = content.definition.evidence.find((e) => e.id === fact.evidenceId);
  return (
    <View style={styles.factCard}>
      <View style={styles.factHeader}>
        <Text style={styles.factLabel}>{label}</Text>
        <View style={styles.idTag}>
          <Text style={styles.idText}>{fact.evidenceId}</Text>
        </View>
        {onChange ? (
          <Pressable
            onPress={onChange}
            accessibilityRole="button"
            accessibilityLabel={`${ui.compare.change} ${label}`}
            hitSlop={8}
            style={styles.change}
          >
            <Text style={[type.label, { color: colors.brass }]}>{ui.compare.change}</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={type.body}>{t(fact.textKey)}</Text>
      {source ? <Text style={type.meta}>{t(source.titleKey)}</Text> : null}
    </View>
  );
}

/** Every fact from inspected evidence, grouped by source, so Fact B can come from anywhere. */
function FactPicker({
  content,
  exclude,
  onPick,
}: {
  content: CaseContent;
  exclude: Id;
  onPick: (factId: Id) => void;
}) {
  const t = useCaseText(content);
  const ui = useUi();
  const { definition } = content;
  const progress = useCaseProgress(definition);
  const sources = definition.evidence.filter((e) => progress.inspectedEvidenceIds.includes(e.id));
  return (
    <View style={styles.picker}>
      <Text style={type.heading}>{ui.compare.chooseB}</Text>
      <Text style={type.meta}>{ui.compare.chooseBHint}</Text>
      {sources.map((evidence) => {
        const facts = definition.facts.filter(
          (f) => f.evidenceId === evidence.id && f.id !== exclude,
        );
        if (facts.length === 0) return null;
        return (
          <View key={evidence.id} style={styles.group}>
            <View style={styles.groupHeader}>
              <View style={styles.idTag}>
                <Text style={styles.idText}>{evidence.id}</Text>
              </View>
              <Text style={[type.label, styles.groupTitle]}>{t(evidence.titleKey)}</Text>
            </View>
            {facts.map((fact) => (
              <FactChip
                key={fact.id}
                text={t(fact.textKey)}
                selected={false}
                onPress={() => onPick(fact.id)}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}

function Result({ outcome, content }: { outcome: Outcome; content: CaseContent }) {
  const t = useCaseText(content);
  const ui = useUi();
  const valid = outcome.code === 'valid';
  const deductions = outcome.deductionIds
    .map((id) => content.definition.deductions.find((d) => d.id === id))
    .filter((d) => !!d);
  return (
    <View style={[styles.result, valid && styles.resultValid]} accessibilityLiveRegion="polite">
      <View style={styles.resultHeader}>
        <Ionicons
          name={valid ? 'checkmark-circle' : 'help-circle-outline'}
          size={26}
          color={valid ? colors.brass : colors.ivoryMuted}
        />
        <Text style={type.heading}>{ui.compare.results[outcome.code]}</Text>
      </View>
      <Text style={type.body}>{ui.compare.results[`${outcome.code}Body`]}</Text>
      {deductions.map((deduction) => (
        <View key={deduction.id} style={styles.deduction}>
          <Text style={type.overline}>{ui.compare.newDeductions}</Text>
          <Text style={[type.heading, { color: colors.brass }]}>{t(deduction.titleKey)}</Text>
          <Text style={type.body}>{t(deduction.descriptionKey)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  close: {
    width: minTouch,
    height: minTouch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: {
    color: colors.ivoryMuted,
  },
  factCard: {
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: colors.brassDim,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  factLabel: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    lineHeight: 26,
    color: colors.brass,
  },
  idTag: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  idText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ivory,
  },
  change: {
    marginLeft: 'auto',
    minHeight: minTouch,
    justifyContent: 'center',
  },
  picker: {
    gap: spacing.md,
  },
  group: {
    gap: spacing.sm,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  groupTitle: {
    flex: 1,
    fontFamily: fonts.sansSemiBold,
  },
  options: {
    gap: spacing.md,
  },
  option: {
    minHeight: minTouch + 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.slate,
  },
  optionChecked: {
    borderColor: colors.brass,
    backgroundColor: colors.slateRaised,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontFamily: fonts.sansSemiBold,
  },
  result: {
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  resultValid: {
    borderColor: colors.brass,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deduction: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
