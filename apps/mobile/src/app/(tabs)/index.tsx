import type { CaseProgress } from '@casefile/engine';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { CaseCard } from '@/components/CaseCard';
import { Pill } from '@/components/Pill';
import { SegmentedControl } from '@/components/SegmentedControl';
import { artFor, cases, upcomingCases, useCaseText, type CaseContent } from '@/content/cases';
import { useUi, type UiStrings } from '@/i18n';
import { useCaseProgress } from '@/state/progress';
import { colors, fonts, spacing, type } from '@/theme';

type Filter = 'all' | 'available' | 'upcoming';

export default function CaseLibrary() {
  const ui = useUi();
  const [filter, setFilter] = useState<Filter>('all');
  const filters = [
    { value: 'all', label: ui.library.filters.all },
    { value: 'available', label: ui.library.filters.available },
    { value: 'upcoming', label: ui.library.filters.upcoming },
  ] as const;
  const insets = useSafeAreaInsets();
  const showAvailable = filter !== 'upcoming';
  const showUpcoming = filter !== 'available';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.xl }]}>
        <Image
          source={require('@/assets/images/library-header.webp')}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          accessible={false}
        />
        <LinearGradient
          colors={['rgba(16,19,24,0.25)', 'rgba(16,19,24,0.55)', colors.abyss]}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.appName} accessibilityRole="header">
          {ui.appName}
        </Text>
        <Text style={styles.appSubtitle}>{ui.appSubtitle}</Text>
        <Text style={styles.tagline}>{ui.tagline}</Text>
      </View>

      <View style={styles.content}>
        <SegmentedControl options={filters} value={filter} onChange={setFilter} />
        {showAvailable
          ? cases.map((content, index) => (
              <PlayableCaseCard key={content.definition.id} content={content} number={index + 1} />
            ))
          : null}
        {showUpcoming
          ? upcomingCases.map((upcoming) => (
              <CaseCard
                key={upcoming.number}
                number={upcoming.number}
                title={ui.library.upcomingTitles[upcoming.number]}
                art={artFor(upcoming.assetId)}
                subtitle={ui.library.comingSoon}
                locked
              />
            ))
          : null}
      </View>
    </ScrollView>
  );
}

function PlayableCaseCard({ content, number }: { content: CaseContent; number: number }) {
  const { definition } = content;
  const t = useCaseText(content);
  const ui = useUi();
  const progress = useCaseProgress(definition);
  const presentation = definition.presentation;
  const initialEvidence = definition.evidence.filter((e) => e.initial).length;

  const meta = [
    ...(presentation
      ? [
          {
            icon: 'time-outline' as const,
            label: ui.library.minutes(
              presentation.estimatedMinutes.min,
              presentation.estimatedMinutes.max,
            ),
          },
        ]
      : []),
    { icon: 'document-text-outline' as const, label: ui.library.evidenceItems(initialEvidence) },
  ];

  return (
    <CaseCard
      number={number}
      title={t(definition.titleKey)}
      subtitle={presentation ? t(presentation.briefing.locationKey) : undefined}
      art={artFor(presentation?.cardAssetId)}
      highlighted={progress.status !== 'solved'}
      badges={
        <View style={styles.badges}>
          {presentation ? <Pill label={ui.difficulty[presentation.difficulty]} /> : null}
          <StatusPill status={progress.status} />
        </View>
      }
      meta={meta}
      footer={
        <Button
          label={actionLabel(ui, progress.status)}
          icon="arrow-forward"
          onPress={() => router.push(`/case/${definition.id}`)}
        />
      }
    />
  );
}

function StatusPill({ status }: { status: CaseProgress['status'] }) {
  const ui = useUi();
  if (status === 'new') return null;
  return (
    <Pill
      label={ui.library.status[status]}
      icon={status === 'solved' ? 'checkmark-circle' : 'ellipse-outline'}
      tone="muted"
    />
  );
}

function actionLabel(ui: UiStrings, status: CaseProgress['status']): string {
  if (status === 'active') return ui.library.resume;
  if (status === 'solved') return ui.library.replay;
  return ui.library.start;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  header: {
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  appName: {
    ...type.display,
    letterSpacing: 6,
    textAlign: 'center',
  },
  appSubtitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 8,
    color: colors.ivory,
    textAlign: 'center',
  },
  tagline: {
    ...type.body,
    marginTop: spacing.lg,
    opacity: 0.85,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
