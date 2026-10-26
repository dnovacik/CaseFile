import Ionicons from '@expo/vector-icons/Ionicons';
import { resetCase } from '@casefile/engine';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { artFor, getCase, useCaseText, type CaseContent } from '@/content/cases';
import { caseRating } from '@/content/rating';
import { useUi } from '@/i18n';
import { useCaseProgress, useProgressStore } from '@/state/progress';
import { colors, fonts, radii, spacing, type } from '@/theme';

export default function Resolution() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const content = getCase(caseId);
  if (!content) return null;
  return <ResolutionView content={content} />;
}

function ResolutionView({ content }: { content: CaseContent }) {
  const { definition } = content;
  const t = useCaseText(content);
  const ui = useUi();
  const progress = useCaseProgress(definition);
  const setProgress = useProgressStore((state) => state.setProgress);
  const clearSelection = useProgressStore((state) => state.clearSelection);
  const insets = useSafeAreaInsets();

  // Arriving here unsolved (e.g. via a deep link) shouldn't spoil the case.
  if (progress.status !== 'solved') return <Redirect href={`/case/${definition.id}`} />;

  const stars = caseRating(progress);
  const missed = definition.deductions.filter(
    (d) => !d.mandatory && !progress.unlockedDeductionIds.includes(d.id),
  );
  const resolution = definition.presentation
    ? t(definition.presentation.resolutionKey).split('\n\n')
    : [];

  const replay = () => {
    setProgress(resetCase(definition));
    clearSelection(definition.id);
    // Return to the briefing already in the stack rather than pushing another copy.
    router.dismissTo(`/case/${definition.id}`);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
    >
      <View style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}>
        {definition.presentation?.cardAssetId ? (
          <Image
            source={artFor(definition.presentation.cardAssetId)}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            accessible={false}
          />
        ) : null}
        <LinearGradient
          colors={['rgba(16,19,24,0.4)', 'rgba(16,19,24,0.7)', colors.abyss]}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={type.title} accessibilityRole="header">
          {t(definition.titleKey)}
        </Text>
        <View style={styles.closedRow}>
          <View style={styles.closedBadge}>
            <Ionicons name="checkmark-circle" size={22} color={colors.onBrass} />
            <Text style={styles.closedText}>{ui.resolution.closed}</Text>
          </View>
          <View style={styles.stars} accessible accessibilityLabel={ui.resolution.rating(stars)}>
            {[1, 2, 3].map((n) => (
              <Ionicons
                key={n}
                name={n <= stars ? 'star' : 'star-outline'}
                size={28}
                color={colors.brass}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          {resolution.map((paragraph, index) => (
            <Text key={index} style={[type.body, index === 0 && styles.lead]}>
              {paragraph}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="link-outline" size={22} color={colors.brass} />
            <Text style={type.heading}>{ui.resolution.missedTitle}</Text>
          </View>
          {missed.length === 0 ? (
            <Text style={type.body}>{ui.resolution.missedNone}</Text>
          ) : (
            missed.map((deduction) => (
              <View key={deduction.id} style={styles.missed}>
                <Text style={[type.label, styles.missedTitle]}>{t(deduction.titleKey)}</Text>
                <Text style={type.meta}>{t(deduction.descriptionKey)}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="stats-chart-outline" size={22} color={colors.brass} />
            <Text style={type.heading}>{ui.resolution.statsTitle}</Text>
          </View>
          <View style={styles.stats}>
            <Stat icon="bulb-outline" value={progress.hintsUsed} label={ui.resolution.hints} />
            <Stat
              icon="close-circle-outline"
              value={progress.incorrectSubmissions}
              label={ui.resolution.wrongReports}
            />
          </View>
        </View>

        <Button
          label={ui.resolution.library}
          icon="arrow-forward"
          onPress={() => router.dismissTo('/')}
        />
        <Button label={ui.resolution.replay} variant="secondary" onPress={replay} />
      </View>
    </ScrollView>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
}) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${label}: ${value}`}>
      <Ionicons name={icon} size={24} color={colors.brass} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={type.meta}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  hero: {
    minHeight: 240,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  closedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  closedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.brass,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  closedText: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    lineHeight: 26,
    color: colors.onBrass,
  },
  stars: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  lead: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    lineHeight: 28,
    color: colors.brass,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  missed: {
    gap: 2,
  },
  missedTitle: {
    fontFamily: fonts.sansSemiBold,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    gap: spacing.xs,
  },
  statValue: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 24,
    lineHeight: 28,
    color: colors.ivory,
  },
});
