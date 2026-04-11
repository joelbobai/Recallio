import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { useDecks } from '@/context/DeckContext';

export default function DeckDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getDeckById, deleteDeck, deleteCard, updateDeck, updateCard } = useDecks();
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  const deck = getDeckById(id);

  // Inline deck rename state
  const [isRenamingDeck, setIsRenamingDeck] = useState(false);
  const [deckTitleDraft, setDeckTitleDraft] = useState('');

  // Inline card edit state
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  if (!deck) {
    return (
      <View style={[styles.screen, isDark ? styles.darkBackground : styles.lightBackground]}>
        <EmptyState title="Deck not found" description="This deck may have been removed." />
      </View>
    );
  }

  function onDeleteDeck() {
    Alert.alert('Delete deck?', `Remove "${deck!.title}" and all its cards?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDeck(deck!.id);
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
        onPress: () => deleteCard(deck!.id, cardId),
      },
    ]);
  }

  function startRenameDeck() {
    setDeckTitleDraft(deck!.title);
    setIsRenamingDeck(true);
  }

  async function commitRenameDeck() {
    const trimmed = deckTitleDraft.trim();
    if (trimmed && trimmed !== deck!.title) {
      await updateDeck(deck!.id, trimmed);
    }
    setIsRenamingDeck(false);
  }

  function startEditCard(cardId: string, question: string, answer: string) {
    setEditingCardId(cardId);
    setEditQuestion(question);
    setEditAnswer(answer);
  }

  async function commitEditCard() {
    if (!editingCardId) return;
    const q = editQuestion.trim();
    const a = editAnswer.trim();
    if (!q || !a) {
      Alert.alert('Missing field', 'Question and answer cannot be empty.');
      return;
    }
    await updateCard(deck!.id, editingCardId, q, a);
    setEditingCardId(null);
  }

  return (
    <View style={[styles.screen, isDark ? styles.darkBackground : styles.lightBackground]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Deck title — tap to rename */}
        {isRenamingDeck ? (
          <View style={styles.renameRow}>
            <TextInput
              value={deckTitleDraft}
              onChangeText={setDeckTitleDraft}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={commitRenameDeck}
              style={[
                styles.renameInput,
                isDark ? styles.renameInputDark : styles.renameInputLight,
                isDark ? styles.lightText : styles.darkText,
              ]}
            />
            <Pressable style={styles.renameConfirmButton} onPress={commitRenameDeck}>
              <Text style={styles.renameConfirmText}>Save</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={startRenameDeck} hitSlop={8}>
            <Text style={[styles.title, isDark ? styles.lightText : styles.darkText]}>{deck.title}</Text>
            <Text style={[styles.renameHint, isDark ? styles.mutedDark : styles.mutedLight]}>Tap to rename</Text>
          </Pressable>
        )}

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
          <Text style={styles.deleteDeckText}>Delete deck</Text>
        </Pressable>

        {deck.cards.length === 0 ? (
          <EmptyState title="No cards yet" description="Add a few cards and start your first quiz." />
        ) : (
          deck.cards.map((card, index) => (
            <View key={card.id} style={[styles.cardPreview, isDark ? styles.previewDark : styles.previewLight]}>
              <Text style={[styles.cardCount, isDark ? styles.mutedDark : styles.mutedLight]}>Card {index + 1}</Text>

              {editingCardId === card.id ? (
                /* ── Inline edit mode ── */
                <>
                  <TextInput
                    value={editQuestion}
                    onChangeText={setEditQuestion}
                    multiline
                    placeholder="Question"
                    placeholderTextColor={isDark ? '#9FA8B8' : '#7A8392'}
                    style={[styles.editInput, isDark ? styles.editInputDark : styles.editInputLight, isDark ? styles.lightText : styles.darkText]}
                  />
                  <TextInput
                    value={editAnswer}
                    onChangeText={setEditAnswer}
                    multiline
                    placeholder="Answer"
                    placeholderTextColor={isDark ? '#9FA8B8' : '#7A8392'}
                    style={[styles.editInput, isDark ? styles.editInputDark : styles.editInputLight, isDark ? styles.lightText : styles.darkText]}
                  />
                  <View style={styles.cardActions}>
                    <Pressable style={[styles.cardBtn, styles.cardBtnSave]} onPress={commitEditCard}>
                      <Text style={styles.cardBtnSaveText}>Save</Text>
                    </Pressable>
                    <Pressable style={[styles.cardBtn, styles.cardBtnCancel]} onPress={() => setEditingCardId(null)}>
                      <Text style={[styles.cardBtnCancelText, isDark ? styles.lightText : styles.darkText]}>Cancel</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                /* ── Read mode ── */
                <>
                  <Text style={[styles.question, isDark ? styles.lightText : styles.darkText]}>{card.question}</Text>
                  <Text style={[styles.answer, isDark ? styles.mutedDark : styles.mutedLight]}>{card.answer}</Text>
                  <View style={styles.cardActions}>
                    <Pressable
                      style={[styles.cardBtn, styles.cardBtnEdit]}
                      onPress={() => startEditCard(card.id, card.question, card.answer)}>
                      <Text style={styles.cardBtnEditText}>Edit</Text>
                    </Pressable>
                    <Pressable style={[styles.cardBtn, styles.cardBtnDelete]} onPress={() => onDeleteCard(card.id)}>
                      <Text style={styles.cardBtnDeleteText}>Delete</Text>
                    </Pressable>
                  </View>
                </>
              )}
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

  // Deck title / rename
  renameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  renameInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800',
    borderBottomWidth: 2,
    borderBottomColor: '#2F80ED',
    paddingVertical: 4,
  },
  renameInputLight: { backgroundColor: 'transparent' },
  renameInputDark: { backgroundColor: 'transparent' },
  renameConfirmButton: {
    backgroundColor: '#2F80ED',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  renameConfirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  renameHint: {
    fontSize: 11,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 4,
  },

  // Action buttons
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButton: { backgroundColor: '#2F80ED' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryButton: { backgroundColor: '#D7DEE9' },
  secondaryButtonText: { fontSize: 15, fontWeight: '700' },
  disabled: { opacity: 0.5 },

  // Delete deck
  deleteDeckButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#D9534F',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteDeckText: {
    color: '#D9534F',
    fontWeight: '700',
    fontSize: 14,
  },

  // Card preview
  cardPreview: {
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
    gap: 6,
  },
  previewLight: { backgroundColor: '#FFFFFF' },
  previewDark: { backgroundColor: '#1E1F25' },
  cardCount: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  question: { fontSize: 17, fontWeight: '700' },
  answer: { fontSize: 14 },

  // Card action buttons (Edit / Delete / Save / Cancel)
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  cardBtn: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  cardBtnEdit: { backgroundColor: '#2F80ED' },
  cardBtnEditText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  cardBtnDelete: { backgroundColor: '#FDE8E8' },
  cardBtnDeleteText: { color: '#D9534F', fontWeight: '700', fontSize: 13 },
  cardBtnSave: { backgroundColor: '#2F80ED' },
  cardBtnSaveText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  cardBtnCancel: { backgroundColor: '#EAECF0' },
  cardBtnCancelText: { fontWeight: '700', fontSize: 13 },

  // Inline edit inputs
  editInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    minHeight: 52,
    textAlignVertical: 'top',
  },
  editInputLight: { backgroundColor: '#F7F8FA', borderColor: '#CFD5DE' },
  editInputDark: { backgroundColor: '#14151A', borderColor: '#313645' },

  // Text colours
  darkText: { color: '#121212' },
  lightText: { color: '#F5F6F8' },
  mutedLight: { color: '#5C6675' },
  mutedDark: { color: '#ACB5C4' },
});
