import Ionicons from '@expo/vector-icons/Ionicons';
import { isEvidenceAvailable } from '@casefile/engine';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackHeader } from '@/components/BackHeader';
import { CompareTray } from '@/components/CompareTray';
import { FactChip } from '@/components/FactChip';
import { artFor, caseText, getCase, type CaseContent } from '@/content/cases';
import { evidenceIcon } from '@/content/evidence';
import { ui } from '@/i18n/en';
import { dispatch, useCaseProgress, useProgressStore, useSelectedFacts } from '@/state/progress';
import { colors, fonts, radii, spacing, type } from '@/theme';

export default function EvidenceDetail() {
  const { caseId, evidenceId } = useLocalSearchParams<{ caseId: string; evidenceId: string }>();
  const content = getCase(caseId);
  if (!content) return null;
  return <Detail content={content} evidenceId={evidenceId} />;
}

function Detail({ content, evidenceId }: { content: CaseContent; evidenceId: string }) {
  const { definition } = content;
  const t = caseText(content);
  const progress = useCaseProgress(definition);
  const selected = useSelectedFacts(definition.id);
  const toggleFact = useProgressStore((state) => state.toggleFact);
  const evidence = definition.evidence.find((e) => e.id === evidenceId);
  const available = evidence !== undefined && isEvidenceAvailable(definition, progress, evidenceId);
  const inspected = progress.inspectedEvidenceIds.includes(evidenceId);

  // Opening evidence is inspecting it. The engine rejects anything not yet available.
  useEffect(() => {
    if (available && !inspected) {
      dispatch(definition, { type: 'inspectEvidence', evidenceId });
    }
  }, [available, inspected, definition, evidenceId]);

  const header = (
    <BackHeader backLabel={ui.evidence.title} fallbackHref={`/case/${definition.id}/evidence`} />
  );

  if (!evidence || !available) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.padded}>
          {header}
          <Text style={[type.body, styles.unavailable]}>
            {ui.compare.results.not_availableBody}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const art = artFor(evidence.assetIds?.[0]);
  const isPortrait = evidence.type === 'testimony';
  const facts = definition.facts.filter((f) => f.evidenceId === evidence.id);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {header}
        <View style={styles.titleRow}>
          {isPortrait && art ? (
            <Image source={art} style={styles.portrait} contentFit="cover" accessible={false} />
          ) : null}
          <View style={styles.titleText}>
            <View style={styles.badges}>
              <View style={styles.idTag}>
                <Text style={styles.idText}>{evidence.id}</Text>
              </View>
              <Ionicons name={evidenceIcon[evidence.type]} size={16} color={colors.brass} />
              <Text style={type.meta}>{ui.evidence.types[evidence.type]}</Text>
            </View>
            <Text style={type.title} accessibilityRole="header">
              {t(evidence.titleKey)}
            </Text>
          </View>
        </View>

        {!isPortrait && art ? (
          // The body text below describes every clue in the image, so the image itself is
          // decorative for screen readers.
          <Image
            source={art}
            // Phone photos are portrait; object and document shots are landscape.
            style={[styles.media, { aspectRatio: evidence.type === 'photograph' ? 3 / 4 : 3 / 2 }]}
            contentFit="cover"
            accessible={false}
          />
        ) : null}

        <View style={styles.card}>
          <Text style={type.body}>{t(evidence.bodyKey)}</Text>
        </View>

        <View style={styles.facts}>
          <Text style={type.heading}>{ui.evidence.facts}</Text>
          <Text style={type.meta}>{ui.evidence.factsHint}</Text>
          {facts.map((fact) => (
            <FactChip
              key={fact.id}
              text={t(fact.textKey)}
              selected={selected.includes(fact.id)}
              onPress={() => toggleFact(definition.id, fact.id)}
            />
          ))}
        </View>
      </ScrollView>
      <CompareTray caseId={definition.id} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  padded: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  unavailable: {
    color: colors.ivoryMuted,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  portrait: {
    width: 88,
    height: 88,
    borderRadius: radii.md,
  },
  titleText: {
    flex: 1,
    gap: spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  media: {
    width: '100%',
    borderRadius: radii.lg,
  },
  card: {
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  facts: {
    gap: spacing.md,
  },
});
