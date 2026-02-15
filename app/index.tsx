import { Link, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { DeckItem } from '@/components/DeckItem';
import { EmptyState } from '@/components/EmptyState';
import { useDecks } from '@/context/DeckContext';

export default function DeckListScreen() {
  const { decks, isLoading } = useDecks();
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.screen, isDark ? styles.screenDark : styles.screenLight]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>Your flashcard decks</Text>
          <Link href="/add-deck" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>+ New Deck</Text>
            </Pressable>
          </Link>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : decks.length === 0 ? (
          <EmptyState
            title="No decks yet"
            description="Create your first deck to start studying offline."
          />
        ) : (
          decks.map((deck) => (
            <DeckItem key={deck.id} deck={deck} onPress={() => router.push({ pathname: '/deck/[id]', params: { id: deck.id } })} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  screenLight: { backgroundColor: '#F0F2F5' },
  screenDark: { backgroundColor: '#101115' },
  content: {
    padding: 18,
    gap: 10,
  },
  header: {
    marginBottom: 10,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  textDark: { color: '#121212' },
  textLight: { color: '#F5F6F8' },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#2F80ED',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
