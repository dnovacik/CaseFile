import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Pill } from '@/components/Pill';
import { SegmentedControl } from '@/components/SegmentedControl';
import { artFor, getCase, useCaseText, useTotalCases } from '@/content/cases';
import { useUi } from '@/i18n';
import { useCaseProgress } from '@/state/progress';
import { colors, fonts, minTouch, radii, spacing, type } from '@/theme';

type Tab = 'briefing' | 'people';

export default function Briefing() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const content = getCase(caseId);
  if (!content) return <NotFound />;
  return <BriefingView caseId={caseId} />;
}

function BriefingView({ caseId }: { caseId: string }) {
  const content = getCase(caseId)!;
  const { definition } = content;
  const t = useCaseText(content);
  const ui = useUi();
  const progress = useCaseProgress(definition);
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('briefing');
  const tabs = [
    { value: 'briefing', label: ui.briefing.tabs.briefing },
    { value: 'people', label: ui.briefing.tabs.people },
  ] as const;

  const presentation = definition.presentation;
  const number = content.number;
  const totalCases = useTotalCases();
  const initialEvidence = definition.evidence.filter((e) => e.initial).length;
  const keyDeductions = definition.deductions.filter((d) => d.mandatory).length;
  const begin =
    progress.status === 'active'
      ? ui.briefing.resume
      : progress.status === 'solved'
        ? ui.briefing.review
        : ui.briefing.begin;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={[styles.hero, { paddingTop: insets.top }]}>
          {presentation?.briefing.assetId ? (
            <Image
              source={artFor(presentation.briefing.assetId)}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              accessible={false}
            />
          ) : null}
          <LinearGradient
            colors={['rgba(16,19,24,0.55)', 'rgba(16,19,24,0)', colors.abyss]}
            locations={[0, 0.35, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroBar}>
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              accessibilityRole="button"
              accessibilityLabel={ui.briefing.back}
              hitSlop={8}
              style={styles.back}
            >
              <Ionicons name="chevron-back" size={24} color={colors.brass} />
              <Text style={styles.backLabel}>{ui.briefing.back}</Text>
            </Pressable>
            <Text style={type.meta}>{ui.briefing.caseOf(number, totalCases)}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            {presentation ? <Pill label={ui.difficulty[presentation.difficulty]} /> : null}
            {presentation ? (
              <View style={styles.minutes}>
                <Ionicons name="time-outline" size={16} color={colors.brass} />
                <Text style={type.meta}>
                  {ui.library.minutes(
                    presentation.estimatedMinutes.min,
                    presentation.estimatedMinutes.max,
                  )}
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={type.title} accessibilityRole="header">
            {t(definition.titleKey)}
          </Text>
          {presentation ? (
            <Text style={styles.location}>{t(presentation.briefing.locationKey)}</Text>
          ) : null}

          <View style={styles.stats}>
            <Stat
              icon="document-text-outline"
              value={initialEvidence}
              label={ui.briefing.evidence}
            />
            <Stat icon="git-network-outline" value={keyDeductions} label={ui.briefing.deductions} />
            <Stat
              icon="people-outline"
              value={definition.people?.length ?? 0}
              label={ui.briefing.people}
            />
          </View>

          <SegmentedControl options={tabs} value={tab} onChange={setTab} />

          {tab === 'briefing' && presentation ? (
            <>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="reader-outline" size={22} color={colors.brass} />
                  <Text style={type.heading}>{ui.briefing.incidentReport}</Text>
                </View>
                <Row label={ui.briefing.date} value={t(presentation.briefing.dateKey)} />
                <Row label={ui.briefing.location} value={t(presentation.briefing.locationKey)} />
                <Text style={[type.body, styles.summary]}>
                  {t(presentation.briefing.summaryKey)}
                </Text>
              </View>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="locate-outline" size={22} color={colors.brass} />
                  <Text style={[type.heading, { color: colors.brass }]}>
                    {ui.briefing.objective}
                  </Text>
                </View>
                {presentation.briefing.objectiveKeys.map((key, index) => (
                  <View key={key} style={styles.objective}>
                    <View style={styles.objectiveNumber}>
                      <Text style={styles.objectiveNumberText} maxFontSizeMultiplier={1.4}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={[type.body, styles.objectiveText]}>{t(key)}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {tab === 'people' ? (
            <View style={styles.people}>
              {(definition.people ?? []).map((person) => (
                <View
                  key={person.id}
                  style={styles.person}
                  accessible
                  accessibilityLabel={`${t(person.nameKey)}, ${t(person.roleKey)}`}
                >
                  {person.assetId ? (
                    <Image
                      source={artFor(person.assetId)}
                      style={styles.portrait}
                      contentFit="cover"
                    />
                  ) : null}
                  <View style={styles.personText}>
                    <Text style={styles.personName}>{t(person.nameKey)}</Text>
                    <Text style={type.meta}>{t(person.roleKey)}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          label={begin}
          icon="arrow-forward"
          onPress={() => router.push(`/case/${caseId}/evidence`)}
        />
      </View>
    </View>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number | string;
  label: string;
}) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${value} ${label}`}>
      <Ionicons name={icon} size={22} color={colors.brass} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={[type.meta, styles.rowLabel]}>{label}</Text>
      <Text style={[type.body, styles.rowValue]}>{value}</Text>
    </View>
  );
}

function NotFound() {
  const ui = useUi();
  return (
    <SafeAreaView style={[styles.screen, styles.notFound]}>
      <Text style={type.body}>{ui.notFound}</Text>
      <Button label={ui.briefing.back} variant="secondary" onPress={() => router.replace('/')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  hero: {
    minHeight: 300,
  },
  heroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  back: {
    minHeight: minTouch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingRight: spacing.sm,
  },
  backLabel: {
    ...type.label,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    marginTop: -spacing.xl,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  minutes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  location: {
    ...type.body,
    color: colors.ivoryMuted,
    marginTop: -spacing.md,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  statValue: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    lineHeight: 22,
    color: colors.ivory,
  },
  statLabel: {
    ...type.meta,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowLabel: {
    width: 88,
  },
  rowValue: {
    flex: 1,
  },
  summary: {
    marginTop: spacing.xs,
  },
  objective: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  objectiveNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  objectiveNumberText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.abyss,
  },
  objectiveText: {
    flex: 1,
  },
  people: {
    gap: spacing.md,
  },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  portrait: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
  },
  personText: {
    flex: 1,
    gap: 2,
  },
  personName: {
    ...type.heading,
    fontFamily: fonts.serifBold,
  },
  cta: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.abyss,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  notFound: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
  },
});
