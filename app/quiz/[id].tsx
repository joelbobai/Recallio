import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, useColorScheme, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { Flashcard } from '@/components/Flashcard';
import { QuizControls } from '@/components/QuizControls';
import { useDecks } from '@/context/DeckContext';
import { Card } from '@/types/deck';

const permissionFreePracticeCards: Card[] = [
  {
    id: 'sample-1',
    question: 'What is Recallio?',
    answer: 'A flashcard app to practice and remember information.',
  },
  {
    id: 'sample-2',
    question: 'Do I need camera or location access to use this sample quiz?',
    answer: 'No. This practice mode works entirely offline with no permissions required.',
  },
  {
    id: 'sample-3',
    question: 'What is one effective memory strategy?',
    answer: 'Use active recall: answer a question before revealing the answer.',
  },
];

function shuffleArray<T>(input: T[]): T[] {
  const shuffled = [...input];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

function getMotivationalMessage(percentage: number): string {
  if (percentage === 100) return 'Perfect score! Outstanding work.';
  if (percentage >= 80) return 'Great job! You know this material well.';
  if (percentage >= 60) return 'Good effort. A bit more practice will get you there.';
  if (percentage >= 40) return 'Keep at it — review the cards and try again.';
  return "Don't give up. Every review makes the knowledge stick.";
}

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getDeckById } = useDecks();
  const deck = getDeckById(id);
  const isPermissionFreeMode = id === 'permission-free';
  const isDark = useColorScheme() === 'dark';

  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const cards = useMemo(() => {
    if (isPermissionFreeMode) {
      return shuffleEnabled ? shuffleArray(permissionFreePracticeCards) : permissionFreePracticeCards;
    }

    if (!deck) return [];

    return shuffleEnabled ? shuffleArray(deck.cards) : deck.cards;
  }, [deck, isPermissionFreeMode, shuffleEnabled]);

  const currentCard = cards[cardIndex];
  const isFinished = cardIndex >= cards.length && cards.length > 0;
  const progressPercent = cards.length > 0 ? (cardIndex / cards.length) * 100 : 0;

  function onAnswer(isCorrect: boolean) {
    if (isCorrect) setCorrectCount((v) => v + 1);
    setIsFlipped(false);
    setCardIndex((v) => v + 1);
  }

  function restartQuiz() {
    setCardIndex(0);
    setCorrectCount(0);
    setIsFlipped(false);
  }

  if ((!deck || deck.cards.length === 0) && !isPermissionFreeMode) {
    return (
      <View style={[styles.screen, isDark ? styles.darkBackground : styles.lightBackground]}>
        <EmptyState title="Not enough cards" description="Add cards to this deck before taking a quiz." />
      </View>
    );
  }

  if (isFinished) {
    const percentage = Math.round((correctCount / cards.length) * 100);

    return (
      <View style={[styles.screen, isDark ? styles.darkBackground : styles.lightBackground]}>
        <View style={[styles.scoreCard, isDark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.scoreTitle, isDark ? styles.textLight : styles.textDark]}>
            {isPermissionFreeMode ? 'Practice complete' : 'Quiz complete'}
          </Text>
          <Text style={[styles.scoreValue, isDark ? styles.textLight : styles.textDark]}>
            {correctCount}/{cards.length} correct
          </Text>
          <Text style={[styles.scorePercent, isDark ? styles.textLight : styles.textDark]}>{percentage}%</Text>
          <Text style={[styles.scoreMessage, isDark ? styles.mutedDark : styles.mutedLight]}>
            {getMotivationalMessage(percentage)}
          </Text>
        </View>
        <Pressable style={styles.restartButton} onPress={restartQuiz}>
          <Text style={styles.restartText}>Restart Quiz</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.screen, isDark ? styles.darkBackground : styles.lightBackground]}>
      {/* Progress bar */}
      <View style={[styles.progressTrack, isDark ? styles.progressTrackDark : styles.progressTrackLight]}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.quizHeader}>
        <Text style={[styles.progressText, isDark ? styles.mutedDark : styles.mutedLight]}>
          Card {cardIndex + 1} / {cards.length}
        </Text>
        <View style={styles.shuffleRow}>
          <Text style={[styles.shuffleText, isDark ? styles.textLight : styles.textDark]}>Shuffle</Text>
          <Switch
            value={shuffleEnabled}
            onValueChange={(value) => {
              setShuffleEnabled(value);
              setCardIndex(0);
              setCorrectCount(0);
              setIsFlipped(false);
            }}
          />
        </View>
      </View>

      <Flashcard
        question={currentCard.question}
        answer={currentCard.answer}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped((v) => !v)}
      />

      {/* Nudge shown only while card is still unflipped */}
      {!isFlipped && (
        <Text style={[styles.flipHint, isDark ? styles.mutedDark : styles.mutedLight]}>
          Tap the card to reveal the answer, then mark yourself.
        </Text>
      )}

      <QuizControls
        onCorrect={() => onAnswer(true)}
        onIncorrect={() => onAnswer(false)}
        isFlipped={isFlipped}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 18,
    gap: 16,
  },
  lightBackground: { backgroundColor: '#F0F2F5' },
  darkBackground: { backgroundColor: '#101115' },

  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressTrackLight: { backgroundColor: '#D4DBE5' },
  progressTrackDark: { backgroundColor: '#2A2D38' },
  progressFill: {
    height: '100%',
    backgroundColor: '#2F80ED',
    borderRadius: 2,
  },

  quizHeader: {
    gap: 8,
  },
  progressText: {
    fontSize: 15,
    fontWeight: '600',
  },
  shuffleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shuffleText: {
    fontSize: 16,
    fontWeight: '700',
  },

  flipHint: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
  },

  scoreCard: {
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  cardLight: { backgroundColor: '#FFFFFF' },
  cardDark: { backgroundColor: '#1E1F25' },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '800',
    marginTop: 4,
  },
  scorePercent: {
    fontSize: 20,
    fontWeight: '700',
    opacity: 0.7,
  },
  scoreMessage: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  restartButton: {
    backgroundColor: '#2F80ED',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  restartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  textDark: { color: '#121212' },
  textLight: { color: '#F5F6F8' },
  mutedLight: { color: '#5C6675' },
  mutedDark: { color: '#ACB5C4' },
});
