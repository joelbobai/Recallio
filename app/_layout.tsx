import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { DeckProvider } from '@/context/DeckContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DeckProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Decks' }} />
          <Stack.Screen name="add-deck" options={{ title: 'Create Deck' }} />
          <Stack.Screen name="deck/[id]" options={{ title: 'Deck Details' }} />
          <Stack.Screen name="add-card" options={{ title: 'Add Card' }} />
          <Stack.Screen name="quiz/[id]" options={{ title: 'Quiz' }} />
        </Stack>
        <StatusBar style="auto" />
      </DeckProvider>
    </ThemeProvider>
  );
}
