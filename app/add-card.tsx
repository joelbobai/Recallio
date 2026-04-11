import { useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';

import { useDecks } from '@/context/DeckContext';

export default function AddCardScreen() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const { addCard } = useDecks();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const answerRef = useRef<TextInput>(null);

  function validate(): boolean {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Missing field', 'Add both a question and answer.');
      return false;
    }
    return true;
  }

  async function onSave() {
    if (!validate()) return;
    setIsSaving(true);
    await addCard({ deckId, question: question.trim(), answer: answer.trim() });
    setIsSaving(false);
    router.replace({ pathname: '/deck/[id]', params: { id: deckId } });
  }

  async function onSaveAndAddAnother() {
    if (!validate()) return;
    setIsSaving(true);
    await addCard({ deckId, question: question.trim(), answer: answer.trim() });
    setIsSaving(false);
    // Reset form and focus question field for the next card.
    setQuestion('');
    setAnswer('');
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
        returnKeyType="next"
        onSubmitEditing={() => answerRef.current?.focus()}
        blurOnSubmit={false}
      />

      <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Answer</Text>
      <TextInput
        ref={answerRef}
        value={answer}
        onChangeText={setAnswer}
        placeholder="Plants convert light into chemical energy."
        placeholderTextColor={isDark ? '#9FA8B8' : '#7A8392'}
        style={[styles.input, styles.answerInput, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textLight : styles.textDark]}
        multiline
      />

      <Pressable style={[styles.button, isSaving && styles.buttonDisabled]} onPress={onSave} disabled={isSaving}>
        <Text style={styles.buttonText}>Save card</Text>
      </Pressable>

      <Pressable
        style={[styles.secondaryButton, isSaving && styles.buttonDisabled]}
        onPress={onSaveAndAddAnother}
        disabled={isSaving}>
        <Text style={[styles.secondaryButtonText, isDark ? styles.textLight : styles.textDark]}>Save & Add Another</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 18,
    gap: 8,
  },
  lightBackground: { backgroundColor: '#F0F2F5' },
  darkBackground: { backgroundColor: '#101115' },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 10,
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
    marginTop: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#94A0B2',
  },
  secondaryButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  textDark: { color: '#121212' },
  textLight: { color: '#F5F6F8' },
});
