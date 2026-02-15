import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, useColorScheme, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { Flashcard } from '@/components/Flashcard';
import { QuizControls } from '@/components/QuizControls';
import { useDecks } from '@/context/DeckContext';

function shuffleArray<T>(input: T[]): T[] {
  const shuffled = [...input];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
}

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getDeckById } = useDecks();
  const deck = getDeckById(id);
  const isDark = useColorScheme() === 'dark';

  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const cards = useMemo(() => {
    if (!deck) {
      return [];
    }

    return shuffleEnabled ? shuffleArray(deck.cards) : deck.cards;
  }, [deck, shuffleEnabled]);

  const currentCard = cards[cardIndex];
  const isFinished = cardIndex >= cards.length && cards.length > 0;

  function onAnswer(isCorrect: boolean) {
    if (isCorrect) {
      setCorrectCount((value) => value + 1);
    }

    setIsFlipped(false);
    setCardIndex((value) => value + 1);
  }

  function restartQuiz() {
    setCardIndex(0);
    setCorrectCount(0);
    setIsFlipped(false);
  }

  if (!deck || deck.cards.length === 0) {
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
          <Text style={[styles.scoreTitle, isDark ? styles.textLight : styles.textDark]}>Quiz complete</Text>
          <Text style={[styles.scoreValue, isDark ? styles.textLight : styles.textDark]}>
            {correctCount}/{cards.length} correct
          </Text>
          <Text style={[styles.scoreSubtitle, isDark ? styles.mutedDark : styles.mutedLight]}>{percentage}% score</Text>
        </View>
        <Pressable style={styles.restartButton} onPress={restartQuiz}>
          <Text style={styles.restartText}>Restart Quiz</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.screen, isDark ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.quizHeader}>
        <Text style={[styles.progressText, isDark ? styles.mutedDark : styles.mutedLight]}>
          Card {cardIndex + 1} / {cards.length}
        </Text>
        <View style={styles.shuffleRow}>
          <Text style={[styles.shuffleText, isDark ? styles.textLight : styles.textDark]}>Shuffle</Text>
          <Switch value={shuffleEnabled} onValueChange={setShuffleEnabled} />
        </View>
      </View>

      <Flashcard
        question={currentCard.question}
        answer={currentCard.answer}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped((value) => !value)}
      />

      <QuizControls onCorrect={() => onAnswer(true)} onIncorrect={() => onAnswer(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 18,
    gap: 18,
  },
  lightBackground: { backgroundColor: '#F0F2F5' },
  darkBackground: { backgroundColor: '#101115' },
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
  scoreCard: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  cardLight: { backgroundColor: '#FFFFFF' },
  cardDark: { backgroundColor: '#1E1F25' },
  scoreTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  scoreSubtitle: {
    fontSize: 16,
  },
  restartButton: {
    backgroundColor: '#2F80ED',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
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
