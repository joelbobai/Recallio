import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';

import { useDecks } from '@/context/DeckContext';

export default function AddCardScreen() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const { addCard } = useDecks();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();

  async function onSave() {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Missing field', 'Add both a question and answer.');
      return;
    }

    await addCard({
      deckId,
      question: question.trim(),
      answer: answer.trim(),
    });

    router.replace({ pathname: '/deck/[id]', params: { id: deckId } });
  }

  return (
    <View style={[styles.screen, isDark ? styles.darkBackground : styles.lightBackground]}>
      <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Question</Text>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="What is photosynthesis?"
        placeholderTextColor={isDark ? '#9FA8B8' : '#7A8392'}
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textLight : styles.textDark]}
        multiline
      />

      <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Answer</Text>
      <TextInput
        value={answer}
        onChangeText={setAnswer}
        placeholder="Plants convert light into chemical energy."
        placeholderTextColor={isDark ? '#9FA8B8' : '#7A8392'}
        style={[styles.input, styles.answerInput, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textLight : styles.textDark]}
        multiline
      />

      <Pressable style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>Save card</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 18,
  },
  lightBackground: { backgroundColor: '#F0F2F5' },
  darkBackground: { backgroundColor: '#101115' },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  answerInput: {
    minHeight: 100,
  },
  inputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CFD5DE',
  },
  inputDark: {
    backgroundColor: '#1E1F25',
    borderColor: '#313645',
  },
  button: {
    backgroundColor: '#2F80ED',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  textDark: {
    color: '#121212',
  },
  textLight: {
    color: '#F5F6F8',
  },
});
