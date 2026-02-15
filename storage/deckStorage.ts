import AsyncStorage from '@react-native-async-storage/async-storage';

import { Deck } from '@/types/deck';

const DECK_STORAGE_KEY = 'recallio.decks';

export async function loadDecks(): Promise<Deck[]> {
  const rawDecks = await AsyncStorage.getItem(DECK_STORAGE_KEY);
  if (!rawDecks) {
    return [];
  }

  try {
    const parsedDecks: unknown = JSON.parse(rawDecks);
    if (!Array.isArray(parsedDecks)) {
      return [];
    }

    return parsedDecks as Deck[];
  } catch {
    return [];
  }
}

export async function saveDecks(decks: Deck[]): Promise<void> {
  await AsyncStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(decks));
}
