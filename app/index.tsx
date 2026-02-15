import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import { DeckItem } from '@/components/DeckItem';
import { EmptyState } from '@/components/EmptyState';
import { useDecks } from '@/context/DeckContext';

type SortMode = 'newest' | 'oldest' | 'title' | 'cards';
type FilterMode = 'all' | 'ready' | 'empty';

export default function DeckListScreen() {
  const { decks, isLoading } = useDecks();
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [compactMode, setCompactMode] = useState(false);

  const stats = useMemo(() => {
    const totalDecks = decks.length;
    const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
    const averageCards = totalDecks === 0 ? 0 : Number((totalCards / totalDecks).toFixed(1));

    const largestDeck = decks.reduce((largest, deck) => {
      if (!largest || deck.cards.length > largest.cards.length) {
        return deck;
      }

      return largest;
    }, decks[0]);

    return {
      totalDecks,
      totalCards,
      averageCards,
      largestDeck,
    };
  }, [decks]);

  const visibleDecks = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    const filtered = decks.filter((deck) => {
      const matchesQuery = trimmedQuery.length === 0 || deck.title.toLowerCase().includes(trimmedQuery);
      const matchesFilter =
        filterMode === 'all' ||
        (filterMode === 'ready' && deck.cards.length > 0) ||
        (filterMode === 'empty' && deck.cards.length === 0);

      return matchesQuery && matchesFilter;
    });

    const sorted = [...filtered];

    if (sortMode === 'title') {
      sorted.sort((first, second) => first.title.localeCompare(second.title));
    } else if (sortMode === 'cards') {
      sorted.sort((first, second) => second.cards.length - first.cards.length);
    } else if (sortMode === 'oldest') {
      sorted.sort((first, second) => Date.parse(first.createdAt) - Date.parse(second.createdAt));
    } else {
      sorted.sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt));
    }

    return sorted;
  }, [decks, filterMode, searchQuery, sortMode]);

  const readyDecks = visibleDecks.filter((deck) => deck.cards.length > 0);

  function clearExploreControls() {
    setSearchQuery('');
    setSortMode('newest');
    setFilterMode('all');
    setCompactMode(false);
  }

  function startRandomQuiz() {
    if (readyDecks.length === 0) {
      return;
    }

    const randomDeck = readyDecks[Math.floor(Math.random() * readyDecks.length)];
    router.push({ pathname: '/quiz/[id]', params: { id: randomDeck.id } });
  }

  return (
    <View style={[styles.screen, isDark ? styles.screenDark : styles.screenLight]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>Your flashcard decks</Text>
          <View style={styles.headerButtons}>
            <Link href="/add-deck" asChild>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>+ New Deck</Text>
              </Pressable>
            </Link>
            <Pressable
              style={[styles.secondaryButton, readyDecks.length === 0 && styles.disabledButton]}
              onPress={startRandomQuiz}
              disabled={readyDecks.length === 0}>
              <Text style={styles.secondaryButtonText}>Random Quiz</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.panel, isDark ? styles.panelDark : styles.panelLight]}>
          <TextInput
            placeholder="Search decks..."
            placeholderTextColor={isDark ? '#8D96A5' : '#6A7382'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, isDark ? styles.searchInputDark : styles.searchInputLight]}
          />

          <View style={styles.segmentRow}>
            {[
              { label: 'Newest', value: 'newest' as const },
              { label: 'A-Z', value: 'title' as const },
              { label: 'Most Cards', value: 'cards' as const },
            ].map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setSortMode(option.value)}
                style={[styles.segmentButton, sortMode === option.value && styles.segmentButtonActive]}>
                <Text style={[styles.segmentText, sortMode === option.value && styles.segmentTextActive]}>{option.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.segmentRow}>
            {[
              { label: 'All', value: 'all' as const },
              { label: 'Ready', value: 'ready' as const },
              { label: 'Empty', value: 'empty' as const },
            ].map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setFilterMode(option.value)}
                style={[styles.segmentButton, filterMode === option.value && styles.segmentButtonActive]}>
                <Text style={[styles.segmentText, filterMode === option.value && styles.segmentTextActive]}>{option.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.controlRow}>
            <Text style={[styles.controlText, isDark ? styles.textLight : styles.textDark]}>Compact mode</Text>
            <Switch value={compactMode} onValueChange={setCompactMode} />
          </View>

          <Pressable style={styles.clearButton} onPress={clearExploreControls}>
            <Text style={styles.clearButtonText}>Reset search, sort, filter & layout</Text>
          </Pressable>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, isDark ? styles.panelDark : styles.panelLight]}>
            <Text style={[styles.statLabel, isDark ? styles.mutedDark : styles.mutedLight]}>Total Decks</Text>
            <Text style={[styles.statValue, isDark ? styles.textLight : styles.textDark]}>{stats.totalDecks}</Text>
          </View>
          <View style={[styles.statCard, isDark ? styles.panelDark : styles.panelLight]}>
            <Text style={[styles.statLabel, isDark ? styles.mutedDark : styles.mutedLight]}>Total Cards</Text>
            <Text style={[styles.statValue, isDark ? styles.textLight : styles.textDark]}>{stats.totalCards}</Text>
          </View>
          <View style={[styles.statCard, isDark ? styles.panelDark : styles.panelLight]}>
            <Text style={[styles.statLabel, isDark ? styles.mutedDark : styles.mutedLight]}>Avg / Deck</Text>
            <Text style={[styles.statValue, isDark ? styles.textLight : styles.textDark]}>{stats.averageCards}</Text>
          </View>
        </View>

        {stats.largestDeck ? (
          <Pressable
            onPress={() => router.push({ pathname: '/deck/[id]', params: { id: stats.largestDeck?.id } })}
            style={[styles.tipCard, isDark ? styles.panelDark : styles.panelLight]}>
            <Text style={[styles.tipTitle, isDark ? styles.textLight : styles.textDark]}>Largest deck</Text>
            <Text style={[styles.tipSubtitle, isDark ? styles.mutedDark : styles.mutedLight]}>
              {stats.largestDeck.title} • {stats.largestDeck.cards.length} cards
            </Text>
          </Pressable>
        ) : null}

        <Text style={[styles.summaryText, isDark ? styles.mutedDark : styles.mutedLight]}>
          Showing {visibleDecks.length} of {decks.length} decks
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : visibleDecks.length === 0 ? (
          <EmptyState
            title="No decks match"
            description="Try a different search or reset your filters to see every deck."
          />
        ) : (
          visibleDecks.map((deck) => (
            <DeckItem
              key={deck.id}
              compact={compactMode}
              deck={deck}
              onPress={() => router.push({ pathname: '/deck/[id]', params: { id: deck.id } })}
            />
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
    marginBottom: 2,
    gap: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
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
  secondaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#196A3A',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.45,
  },
  panel: {
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  panelLight: {
    backgroundColor: '#FFFFFF',
  },
  panelDark: {
    backgroundColor: '#1E1F25',
  },
  searchInput: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
  },
  searchInputLight: {
    borderColor: '#D4DBE5',
    color: '#121212',
  },
  searchInputDark: {
    borderColor: '#323643',
    color: '#F5F6F8',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#94A0B2',
    paddingVertical: 8,
    alignItems: 'center',
  },
  segmentButtonActive: {
    borderColor: '#2F80ED',
    backgroundColor: '#2F80ED',
  },
  segmentText: {
    fontWeight: '600',
    fontSize: 13,
    color: '#495261',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlText: {
    fontSize: 15,
    fontWeight: '600',
  },
  clearButton: {
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D9534F',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  tipCard: {
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  tipSubtitle: {
    fontSize: 14,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 4,
  },
});
