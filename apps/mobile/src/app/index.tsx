import { SCHEMA_VERSION } from '@casefile/engine';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

const serif = Platform.select({ ios: 'Georgia', default: 'serif' });

export default function CaseLibrary() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/library-header.webp')}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          accessible={false}
        />
        <LinearGradient
          colors={['rgba(16,19,24,0.2)', 'rgba(16,19,24,0.5)', colors.abyss]}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView edges={['top']} style={styles.titleBlock}>
          <Text style={styles.title} accessibilityRole="header">
            CASEFILE
          </Text>
          <Text style={styles.subtitle}>FIVE MINUTES</Text>
          <Text style={styles.tagline}>Real evidence. Real reasoning.</Text>
        </SafeAreaView>
      </View>
      <View style={styles.content}>
        <Text style={styles.body}>Case library coming soon.</Text>
      </View>
      <SafeAreaView edges={['bottom']}>
        <Text style={styles.footer}>Engine schema v{SCHEMA_VERSION}</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  header: {
    height: 340,
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 24,
  },
  title: {
    color: colors.brass,
    fontFamily: serif,
    fontSize: 44,
    letterSpacing: 6,
  },
  subtitle: {
    color: colors.ivory,
    fontSize: 15,
    letterSpacing: 8,
  },
  tagline: {
    color: colors.ivory,
    fontSize: 15,
    marginTop: 16,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  body: {
    color: colors.ivory,
    fontSize: 16,
    opacity: 0.7,
  },
  footer: {
    color: colors.ivory,
    fontSize: 12,
    opacity: 0.4,
    textAlign: 'center',
    paddingBottom: 16,
  },
});
