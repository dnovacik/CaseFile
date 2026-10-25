import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ui } from '@/i18n/en';
import { colors, spacing, type } from '@/theme';

export default function Settings() {
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <Text style={type.title} accessibilityRole="header">
        {ui.settings.title}
      </Text>
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
  card: {
    backgroundColor: colors.slate,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
  },
});
