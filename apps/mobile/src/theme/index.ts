import { colors } from './colors';

export { colors };

export const fonts = {
  serif: 'CormorantGaramond_600SemiBold',
  serifBold: 'CormorantGaramond_700Bold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
} as const;

/** Minimum touch target from docs/UX.md. */
export const minTouch = 44;

/** Type scale. Body text never goes below 15 pt; all sizes scale with the system text size. */
export const type = {
  display: { fontFamily: fonts.serifBold, fontSize: 44, lineHeight: 48, color: colors.brass },
  title: { fontFamily: fonts.serifBold, fontSize: 34, lineHeight: 38, color: colors.ivory },
  heading: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 28, color: colors.ivory },
  body: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 24, color: colors.ivory },
  label: { fontFamily: fonts.sansMedium, fontSize: 15, lineHeight: 20, color: colors.ivory },
  meta: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 20, color: colors.ivoryMuted },
  overline: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 2,
    color: colors.brass,
  },
} as const;
