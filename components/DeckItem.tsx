import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { Deck } from '@/types/deck';

type DeckItemProps = {
  deck: Deck;
  onPress: () => void;
};

export function DeckItem({ deck, onPress }: DeckItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, isDark ? styles.cardDark : styles.cardLight, pressed && styles.pressed]}>
      <View>
        <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>{deck.title}</Text>
        <Text style={[styles.subtitle, isDark ? styles.mutedDark : styles.mutedLight]}>
          {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  cardDark: {
    backgroundColor: '#1E1F24',
  },
  pressed: {
    opacity: 0.85,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
  },
  textLight: {
    color: '#F4F5F7',
  },
  textDark: {
    color: '#121212',
  },
  mutedLight: {
    color: '#5E6673',
  },
  mutedDark: {
    color: '#A9B1BC',
  },
});
