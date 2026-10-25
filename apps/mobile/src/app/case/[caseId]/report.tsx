import Ionicons from '@expo/vector-icons/Ionicons';
import type { Id, ResultCode } from '@casefile/engine';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { AccessibilityInfo, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader } from '@/components/BackHeader';
import { Button } from '@/components/Button';
import { artFor, caseText, getCase, type CaseContent } from '@/content/cases';
import { ui } from '@/i18n/en';
import { dispatch, useCaseProgress } from '@/state/progress';
import { colors, fonts, minTouch, radii, spacing, type } from '@/theme';

export default function FinalReport() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const content = getCase(caseId);
  if (!content) return null;
  return <Report content={content} />;
}

function Report({ content }: { content: CaseContent }) {
  const { definition } = content;
  const t = caseText(content);
  const progress = useCaseProgress(definition);
  const insets = useSafeAreaInsets();
  const [answers, setAnswers] = useState<Record<Id, Id>>({});
  const [proofIds, setProofIds] = useState<Id[]>([]);
  const [feedback, setFeedback] = useState<Exclude<ResultCode, 'valid'> | null>(null);

  // Only inspected evidence can be offered as proof; deductions back it up on the board.
  const evidence = definition.evidence.filter((e) => progress.inspectedEvidenceIds.includes(e.id));
  const complete =
    definition.conclusions.every((c) => answers[c.id] !== undefined) && proofIds.length > 0;

  const toggleProof = (id: Id) =>
    setProofIds((current) =>
      current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
    );

  const submit = () => {
    const result = dispatch(definition, { type: 'submitReport', answers, proofIds });
    if (result.code === 'valid') {
      router.replace(`/case/${definition.id}/resolution`);
      return;
    }
    setFeedback(result.code);
    AccessibilityInfo.announceForAccessibility(ui.report.results[result.code]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackHeader backLabel={ui.report.back} fallbackHref={`/case/${definition.id}/board`} />
        <Text style={type.title} accessibilityRole="header">
          {t(definition.titleKey)}
        </Text>
        <Text style={[type.heading, styles.muted]}>{ui.report.title}</Text>
        <Text style={type.body}>{ui.report.intro}</Text>

        {definition.conclusions.map((conclusion, index) => (
          <View key={conclusion.id} style={styles.step}>
            <StepHeader number={index + 1} title={t(conclusion.questionKey)} />
            <View accessibilityRole="radiogroup" style={styles.choices}>
              {conclusion.choices.map((choice) => {
                const checked = answers[conclusion.id] === choice.id;
                const person = definition.people?.find((p) => p.id === choice.personId);
                return (
                  <Pressable
                    key={choice.id}
                    onPress={() => {
                      setAnswers((current) => ({ ...current, [conclusion.id]: choice.id }));
                      setFeedback(null);
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ checked }}
                    style={[styles.choice, checked && styles.checked]}
                  >
                    {person?.assetId ? (
                      <Image
                        source={artFor(person.assetId)}
                        style={styles.portrait}
                        contentFit="cover"
                        accessible={false}
                      />
                    ) : null}
                    <View style={styles.flex}>
                      <Text style={[type.label, styles.choiceLabel]}>{t(choice.labelKey)}</Text>
                      {person ? <Text style={type.meta}>{t(person.roleKey)}</Text> : null}
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
          </View>
        ))}

        <View style={styles.step}>
          <StepHeader number={definition.conclusions.length + 1} title={ui.report.evidenceStep} />
          <Text style={type.meta}>{ui.report.evidenceHint}</Text>
          <View style={styles.choices}>
            {evidence.map((item) => {
              const checked = proofIds.includes(item.id);
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    toggleProof(item.id);
                    setFeedback(null);
                  }}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  style={[styles.choice, checked && styles.checked]}
                >
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.id}</Text>
                  </View>
                  <Text style={[type.label, styles.flex]}>{t(item.titleKey)}</Text>
                  <Ionicons
                    name={checked ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={checked ? colors.brass : colors.ivoryMuted}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        {feedback ? (
          <View style={styles.feedback} accessibilityLiveRegion="polite">
            <Ionicons name="help-circle-outline" size={24} color={colors.ivoryMuted} />
            <Text style={[type.body, styles.flex]}>{ui.report.results[feedback]}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {!complete ? <Text style={[type.meta, styles.center]}>{ui.report.incomplete}</Text> : null}
        <Button
          label={ui.report.submit}
          icon="arrow-forward"
          disabled={!complete}
          onPress={submit}
        />
      </View>
    </SafeAreaView>
  );
}

function StepHeader({ number, title }: { number: number; title: string }) {
  return (
    <View style={styles.stepHeader}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <Text style={[type.heading, styles.flex]} accessibilityRole="header">
        {title}
      </Text>
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
  center: {
    textAlign: 'center',
  },
  step: {
    gap: spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.brass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: fonts.serifBold,
    fontSize: 20,
    color: colors.brass,
  },
  choices: {
    gap: spacing.sm,
  },
  choice: {
    minHeight: minTouch + 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.slate,
  },
  checked: {
    borderColor: colors.brass,
    backgroundColor: colors.slateRaised,
  },
  portrait: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
  },
  choiceLabel: {
    fontFamily: fonts.sansSemiBold,
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
  feedback: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.lg,
    backgroundColor: colors.slate,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.abyss,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
