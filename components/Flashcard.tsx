import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, useColorScheme } from 'react-native';

type FlashcardProps = {
  question: string;
  answer: string;
  isFlipped: boolean;
  onFlip: () => void;
};

export function Flashcard({ question, answer, isFlipped, onFlip }: FlashcardProps) {
  const animation = useRef(new Animated.Value(0)).current;
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    Animated.spring(animation, {
      toValue: isFlipped ? 180 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }, [animation, isFlipped]);

  const frontInterpolate = animation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <Pressable onPress={onFlip} style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          styles.face,
          isDark ? styles.cardDark : styles.cardLight,
          { transform: [{ rotateY: frontInterpolate }] },
        ]}>
        <Text style={[styles.label, isDark ? styles.mutedDark : styles.mutedLight]}>Question</Text>
        <Text style={[styles.text, isDark ? styles.textLight : styles.textDark]}>{question}</Text>
        <Text style={[styles.hint, isDark ? styles.mutedDark : styles.mutedLight]}>Tap to reveal answer</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          styles.face,
          styles.back,
          isDark ? styles.cardDark : styles.cardLight,
          { transform: [{ rotateY: backInterpolate }] },
        ]}>
        <Text style={[styles.label, isDark ? styles.mutedDark : styles.mutedLight]}>Answer</Text>
        <Text style={[styles.text, isDark ? styles.textLight : styles.textDark]}>{answer}</Text>
        <Text style={[styles.hint, isDark ? styles.mutedDark : styles.mutedLight]}>Tap to show question</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: '100%',
  },
  card: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    gap: 14,
  },
  back: {
    transform: [{ rotateY: '180deg' }],
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  cardDark: {
    backgroundColor: '#1F2026',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
  },
  textDark: {
    color: '#121212',
  },
  textLight: {
    color: '#F5F6F8',
  },
  mutedLight: {
    color: '#566070',
  },
  mutedDark: {
    color: '#A9B2C1',
  },
});
