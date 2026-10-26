import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SegmentedControl } from '@/components/SegmentedControl';
import { localeNames, locales, useLocale, useLocaleStore, useUi } from '@/i18n';
import { colors, spacing, type } from '@/theme';

const languageOptions = locales.map((value) => ({ value, label: localeNames[value] }));

export default function Settings() {
  const ui = useUi();
  const locale = useLocale();
  const setLocale = useLocaleStore((state) => state.setLocale);
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <Text style={type.title} accessibilityRole="header">
        {ui.settings.title}
      </Text>
      <View style={styles.section}>
        <Text style={type.overline}>{ui.settings.language}</Text>
        <SegmentedControl options={languageOptions} value={locale} onChange={setLocale} />
      </View>
      <View style={styles.card}>
        <Text style={type.body}>{ui.settings.placeholder}</Text>
      </View>
      <Text style={type.meta}>{ui.settings.version(Constants.expoConfig?.version ?? '—')}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.abyss,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.slate,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
  },
});
