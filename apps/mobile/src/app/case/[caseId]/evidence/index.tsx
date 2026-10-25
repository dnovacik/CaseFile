import { getAvailableEvidenceIds } from '@casefile/engine';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackHeader } from '@/components/BackHeader';
import { CompareTray } from '@/components/CompareTray';
import { EvidenceCard } from '@/components/EvidenceCard';
import { FilterChips } from '@/components/FilterChips';
import { artFor, caseText, getCase } from '@/content/cases';
import { evidenceFilters, matchesFilter, type EvidenceFilter } from '@/content/evidence';
import { ui } from '@/i18n/en';
import { useCaseProgress } from '@/state/progress';
import { colors, spacing, type } from '@/theme';

export default function EvidenceWorkspace() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const content = getCase(caseId);
  if (!content) return null;
  return <Workspace caseId={caseId} />;
}

function Workspace({ caseId }: { caseId: string }) {
  const content = getCase(caseId)!;
  const { definition } = content;
  const t = caseText(content);
  const progress = useCaseProgress(definition);
  const [filter, setFilter] = useState<EvidenceFilter>('all');

  const available = new Set(getAvailableEvidenceIds(definition, progress));
  const items = definition.evidence.filter(
    (e) => available.has(e.id) && matchesFilter(e.type, filter),
  );

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <View style={styles.header}>
        <BackHeader
          backLabel={ui.evidence.back}
          fallbackHref={`/case/${caseId}`}
          right={
            <Pressable
              onPress={() => router.push(`/case/${caseId}/board`)}
              accessibilityRole="button"
              accessibilityLabel={`${ui.board.title}, ${ui.evidence.discoveries(
                progress.discoveredRelationshipIds.length,
                progress.unlockedDeductionIds.length,
              )}`}
              style={styles.boardButton}
            >
              <Ionicons name="git-network-outline" size={18} color={colors.brass} />
              <Text style={[type.label, { color: colors.brass }]}>{ui.board.open}</Text>
              <Text style={type.meta}>
                {ui.evidence.discoveries(
                  progress.discoveredRelationshipIds.length,
                  progress.unlockedDeductionIds.length,
                )}
              </Text>
            </Pressable>
          }
        />
        <Text style={type.title} accessibilityRole="header">
          {t(definition.titleKey)}
        </Text>
        <Text style={[type.heading, styles.subtitle]}>{ui.evidence.title}</Text>
      </View>
      <View style={styles.filters}>
        <FilterChips options={evidenceFilters} value={filter} onChange={setFilter} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={<Text style={[type.body, styles.empty]}>{ui.evidence.empty}</Text>}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <EvidenceCard
              evidence={item}
              title={t(item.titleKey)}
              art={artFor(item.assetIds?.[0])}
              inspected={progress.inspectedEvidenceIds.includes(item.id)}
              onPress={() => router.push(`/case/${caseId}/evidence/${item.id}`)}
            />
          </View>
        )}
      />
      <CompareTray caseId={caseId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  boardButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.brassDim,
  },
  subtitle: {
    color: colors.ivoryMuted,
  },
  filters: {
    paddingVertical: spacing.md,
  },
  grid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  column: {
    gap: spacing.md,
  },
  cell: {
    flex: 1,
    // Keep a lone last card at half width instead of stretching across the row.
    maxWidth: '50%',
  },
  empty: {
    textAlign: 'center',
    color: colors.ivoryMuted,
    paddingVertical: spacing.xxl,
  },
});
