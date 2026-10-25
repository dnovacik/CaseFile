import Ionicons from '@expo/vector-icons/Ionicons';
import type { Evidence } from '@casefile/engine';
import type { ImageSource } from 'expo-image';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { evidenceIcon } from '@/content/evidence';
import { ui } from '@/i18n/en';
import { colors, fonts, radii, spacing, type } from '@/theme';

type Props = {
  evidence: Evidence;
  title: string;
  art?: ImageSource;
  inspected: boolean;
  /** How many of this item's facts are currently picked for comparison. */
  selectedCount?: number;
  onPress: () => void;
};

export function EvidenceCard({
  evidence,
  title,
  art,
  inspected,
  selectedCount = 0,
  onPress,
}: Props) {
  const status = inspected ? ui.evidence.status.inspected : ui.evidence.status.new;
  const typeLabel = ui.evidence.types[evidence.type];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[
        evidence.id,
        title,
        typeLabel,
        status,
        selectedCount > 0 ? ui.evidence.selectedInCard(selectedCount) : null,
      ]
        .filter(Boolean)
        .join(', ')}
      style={({ pressed }) => [
        styles.card,
        selectedCount > 0 && styles.cardSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.thumb}>
        {art ? (
          <Image
            source={art}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            accessible={false}
          />
        ) : (
          <Ionicons name={evidenceIcon[evidence.type]} size={40} color={colors.brassDim} />
        )}
        <View style={styles.idTag}>
          <Text style={styles.idText}>{evidence.id}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.status}>
          <Ionicons
            name={inspected ? 'checkmark-circle' : 'ellipse'}
            size={14}
            color={inspected ? colors.ivoryMuted : colors.brass}
          />
          <Text style={[styles.statusText, !inspected && { color: colors.brass }]}>{status}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={type.meta}>{typeLabel}</Text>
        {selectedCount > 0 ? (
          <View style={styles.status}>
            <Ionicons name="checkmark-circle" size={14} color={colors.brass} />
            <Text style={[styles.statusText, { color: colors.brass }]}>
              {ui.evidence.selectedInCard(selectedCount)}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.slate,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: colors.brass,
  },
  pressed: {
    opacity: 0.85,
  },
  thumb: {
    height: 110,
    backgroundColor: colors.slateRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idTag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(16,19,24,0.85)',
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  idText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ivory,
  },
  body: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    lineHeight: 16,
    color: colors.ivoryMuted,
  },
  title: {
    ...type.label,
    fontFamily: fonts.sansSemiBold,
  },
});
