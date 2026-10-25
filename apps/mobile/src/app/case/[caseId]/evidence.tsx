import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ui } from '@/i18n/en';
import { colors, spacing, type } from '@/theme';

/** Placeholder until the evidence workspace PR (feat(mobile): evidence inspection). */
export default function EvidenceWorkspace() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <Ionicons name="folder-open-outline" size={48} color={colors.brass} />
        <Text style={[type.heading, styles.center]} accessibilityRole="header">
          {ui.evidence.placeholderTitle}
        </Text>
        <Text style={[type.body, styles.center]}>{ui.evidence.placeholderBody}</Text>
      </View>
      <Button label={ui.evidence.back} variant="secondary" onPress={() => router.back()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.abyss,
    padding: spacing.lg,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  center: {
    textAlign: 'center',
  },
});
