import Constants from 'expo-constants';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SegmentedControl } from '@/components/SegmentedControl';
import { localeNames, locales, useLocale, useLocaleStore, useUi } from '@/i18n';
import { motionPreferences, usePreferencesStore } from '@/state/preferences';
import { colors, spacing, type } from '@/theme';

const languageOptions = locales.map((value) => ({ value, label: localeNames[value] }));

export default function Settings() {
  const ui = useUi();
  const locale = useLocale();
  const setLocale = useLocaleStore((state) => state.setLocale);
  const sound = usePreferencesStore((state) => state.sound);
  const setSound = usePreferencesStore((state) => state.setSound);
  const motion = usePreferencesStore((state) => state.motion);
  const setMotion = usePreferencesStore((state) => state.setMotion);

  const soundOptions = [
    { value: 'off', label: ui.settings.soundOptions.off },
    { value: 'on', label: ui.settings.soundOptions.on },
  ] as const;
  const motionOptions = motionPreferences.map((value) => ({
    value,
    label: ui.settings.motionOptions[value],
  }));

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={type.title} accessibilityRole="header">
          {ui.settings.title}
        </Text>
        <View style={styles.section}>
          <Text style={type.overline}>{ui.settings.language}</Text>
          <SegmentedControl
            label={ui.settings.language}
            options={languageOptions}
            value={locale}
            onChange={setLocale}
          />
        </View>
        <View style={styles.section}>
          <Text style={type.overline}>{ui.settings.sound}</Text>
          <SegmentedControl
            label={ui.settings.sound}
            options={soundOptions}
            value={sound ? 'on' : 'off'}
            onChange={(value) => setSound(value === 'on')}
          />
          <Text style={[type.meta, styles.hint]}>{ui.settings.soundHint}</Text>
        </View>
        <View style={styles.section}>
          <Text style={type.overline}>{ui.settings.motion}</Text>
          <SegmentedControl
            label={ui.settings.motion}
            options={motionOptions}
            value={motion}
            onChange={setMotion}
          />
          <Text style={[type.meta, styles.hint]}>{ui.settings.motionHint}</Text>
        </View>
        <Text style={type.meta}>{ui.settings.version(Constants.expoConfig?.version ?? '—')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  hint: {
    color: colors.ivoryMuted,
  },
});
