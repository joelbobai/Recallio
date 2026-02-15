import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { useDecks } from '@/context/DeckContext';

export default function DeckDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getDeckById, deleteDeck, deleteCard } = useDecks();
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  const deck = getDeckById(id);

  if (!deck) {
    return (
      <View style={[styles.screen, isDark ? styles.darkBackground : styles.lightBackground]}>
        <EmptyState title="Deck not found" description="This deck may have been removed." />
      </View>
    );
  }

  function onDeleteDeck() {
    Alert.alert('Delete deck?', `Remove ${deck.title} and all cards?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDeck(deck.id);
          router.replace('/');
        },
      },
    ]);
  }

  function onDeleteCard(cardId: string) {
    Alert.alert('Delete card?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCard(deck.id, cardId);
        },
      },
    ]);
  }

  return (
    <View style={[styles.screen, isDark ? styles.darkBackground : styles.lightBackground]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, isDark ? styles.lightText : styles.darkText]}>{deck.title}</Text>
        <Text style={[styles.subtitle, isDark ? styles.mutedDark : styles.mutedLight]}>
          {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'}
        </Text>

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push({ pathname: '/add-card', params: { deckId: deck.id } })}>
            <Text style={styles.primaryButtonText}>Add Card</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.secondaryButton, deck.cards.length === 0 && styles.disabled]}
            onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: deck.id } })}
            disabled={deck.cards.length === 0}>
            <Text style={[styles.secondaryButtonText, isDark ? styles.lightText : styles.darkText]}>Start Quiz</Text>
          </Pressable>
        </View>

        <Pressable style={styles.deleteDeckButton} onPress={onDeleteDeck}>
          <Text style={styles.deleteText}>Delete deck</Text>
        </Pressable>

        {deck.cards.length === 0 ? (
          <EmptyState title="No cards yet" description="Add a few cards and start your first quiz." />
        ) : (
          deck.cards.map((card, index) => (
            <View key={card.id} style={[styles.cardPreview, isDark ? styles.previewDark : styles.previewLight]}>
              <Text style={[styles.cardCount, isDark ? styles.mutedDark : styles.mutedLight]}>Card {index + 1}</Text>
              <Text style={[styles.question, isDark ? styles.lightText : styles.darkText]}>{card.question}</Text>
              <Text style={[styles.answer, isDark ? styles.mutedDark : styles.mutedLight]}>{card.answer}</Text>
              <Pressable onPress={() => onDeleteCard(card.id)}>
                <Text style={styles.deleteText}>Delete card</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  lightBackground: { backgroundColor: '#F0F2F5' },
  darkBackground: { backgroundColor: '#101115' },
  content: {
    padding: 18,
    gap: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2F80ED',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#D7DEE9',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
  cardPreview: {
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
    gap: 4,
  },
  previewLight: {
    backgroundColor: '#FFFFFF',
  },
  previewDark: {
    backgroundColor: '#1E1F25',
  },
  cardCount: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  question: {
    fontSize: 18,
    fontWeight: '700',
  },
  answer: {
    fontSize: 14,
    marginBottom: 8,
  },
  darkText: { color: '#121212' },
  lightText: { color: '#F5F6F8' },
  mutedLight: { color: '#5C6675' },
  mutedDark: { color: '#ACB5C4' },
  deleteDeckButton: {
    alignSelf: 'flex-start',
  },
  deleteText: {
    color: '#D9534F',
    fontWeight: '700',
  },
});
