import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

type QuizControlsProps = {
  onCorrect: () => void;
  onIncorrect: () => void;
};

export function QuizControls({ onCorrect, onIncorrect }: QuizControlsProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <Pressable style={[styles.button, styles.incorrect]} onPress={onIncorrect}>
        <Text style={styles.buttonText}>Incorrect</Text>
      </Pressable>
      <Pressable style={[styles.button, styles.correct]} onPress={onCorrect}>
        <Text style={[styles.buttonText, isDark ? styles.darkText : styles.lightText]}>Correct</Text>
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  darkText: {
    color: '#122117',
  },
  lightText: {
    color: '#16391C',
  },
});
