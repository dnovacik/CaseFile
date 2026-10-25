import Ionicons from '@expo/vector-icons/Ionicons';
import type { ImageSource } from 'expo-image';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, spacing, type } from '@/theme';

type Props = {
  number: number;
  title: string;
  art?: ImageSource;
  /** Overline pills, e.g. difficulty and status. */
  badges?: ReactNode;
  subtitle?: string;
  meta?: { icon: keyof typeof Ionicons.glyphMap; label: string }[];
  /** Rendered under the details, e.g. the start button on a playable case. */
  footer?: ReactNode;
  locked?: boolean;
  highlighted?: boolean;
};

export function CaseCard({
  number,
  title,
  art,
  badges,
  subtitle,
  meta = [],
  footer,
  locked = false,
  highlighted = false,
}: Props) {
  // A plain container: the footer button (if any) is the only control, so screen readers
  // don't meet a button nested inside another button.
  return (
    <View style={[styles.card, highlighted && styles.highlighted]}>
      {art ? (
        <Image
          source={art}
          style={[StyleSheet.absoluteFill, locked && styles.lockedArt]}
          contentFit="cover"
          contentPosition="right"
          accessible={false}
        />
      ) : null}
      <LinearGradient
        colors={[colors.slate, 'rgba(27,34,43,0.85)', 'rgba(27,34,43,0)']}
        locations={[0, 0.45, 0.8]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={[styles.number, locked && styles.dim]}>
            {String(number).padStart(2, '0')}
          </Text>
          {badges}
          {locked ? (
            <View style={styles.lock}>
              <Ionicons
                name="lock-closed"
                size={18}
                color={colors.ivoryMuted}
                accessibilityLabel="Locked"
              />
            </View>
          ) : null}
        </View>
        <Text style={[styles.title, locked && styles.dim]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {meta.length > 0 ? (
          <View style={styles.metaRow}>
            {meta.map((item) => (
              <View key={item.label} style={styles.metaItem}>
                <Ionicons name={item.icon} size={16} color={colors.brass} />
                <Text style={type.meta}>{item.label}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 150,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.slate,
    overflow: 'hidden',
  },
  highlighted: {
    borderColor: colors.brass,
  },
  lockedArt: {
    opacity: 0.45,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  number: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
    lineHeight: 34,
    color: colors.brass,
  },
  title: {
    ...type.heading,
    fontFamily: fonts.serifBold,
    maxWidth: '75%',
  },
  subtitle: {
    ...type.meta,
    color: colors.ivory,
    maxWidth: '75%',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.lg,
    rowGap: spacing.xs,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footer: {
    marginTop: spacing.md,
  },
  lock: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(16,19,24,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dim: {
    color: colors.ivoryMuted,
  },
});
