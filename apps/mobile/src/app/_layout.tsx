import {
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { loadPacksAtLaunch, refreshPacks } from '@/content/live';
import { useReduceMotion } from '@/state/motion';
import { startPersistence } from '@/storage/persistence';
import { colors } from '@/theme';

// Keep the splash screen up until the fonts are ready, so text never flashes in a fallback face.
void SplashScreen.preventAutoHideAsync();

// Installed case packs join the bundled cases first, so saves for pack cases restore too.
loadPacksAtLaunch();

// Restore saved progress synchronously before the first render, so the library never shows a stale
// state. A storage failure must not block play; progress then lasts for the session only.
try {
  startPersistence();
} catch (e) {
  console.warn('[storage] Could not load saved progress', e);
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const ready = loaded || error !== null;
  const reduceMotion = useReduceMotion();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // New case packs install in the background and switch on only while no case is open.
  useEffect(() => {
    const isCalm = () => !pathnameRef.current.startsWith('/case/');
    void refreshPacks(isCalm);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refreshPacks(isCalm);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.abyss },
          // Reduced motion swaps slides for a cross-fade, which doesn't move anything on screen.
          animation: reduceMotion ? 'fade' : 'default',
        }}
      >
        <Stack.Screen
          name="case/[caseId]/compare"
          options={{ presentation: 'modal', animation: reduceMotion ? 'fade' : 'default' }}
        />
      </Stack>
    </>
  );
}
