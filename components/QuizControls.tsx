import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type QuizControlsProps = {
  onCorrect: () => void;
  onIncorrect: () => void;
  /** Controls are locked until the card has been flipped at least once. */
  isFlipped: boolean;
};

export function QuizControls({ onCorrect, onIncorrect, isFlipped }: QuizControlsProps) {
  function handleCorrect() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onCorrect();
  }

  function handleIncorrect() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onIncorrect();
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, styles.incorrect, !isFlipped && styles.buttonDisabled]}
        onPress={handleIncorrect}
        disabled={!isFlipped}>
        <Text style={styles.buttonText}>Incorrect</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.correct, !isFlipped && styles.buttonDisabled]}
        onPress={handleCorrect}
        disabled={!isFlipped}>
        <Text style={[styles.buttonText, styles.correctText]}>Correct</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  incorrect: {
    backgroundColor: '#D9534F',
  },
  correct: {
    backgroundColor: '#8FD694',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  correctText: {
    color: '#122117',
  },
});
