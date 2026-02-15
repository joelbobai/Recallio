import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';

import { useDecks } from '@/context/DeckContext';

export default function AddDeckScreen() {
  const [title, setTitle] = useState('');
  const { addDeck } = useDecks();
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  async function onSave() {
    const trimmed = title.trim();
    if (!trimmed) {
      Alert.alert('Title required', 'Please enter a deck title.');
      return;
    }

    await addDeck(trimmed);
    router.replace('/');
  }

  return (
    <View style={[styles.screen, isDark ? styles.darkBackground : styles.lightBackground]}>
      <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Deck title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Biology basics"
        placeholderTextColor={isDark ? '#9FA8B8' : '#7A8392'}
        style={[styles.input, isDark ? styles.inputDark : styles.inputLight, isDark ? styles.textLight : styles.textDark]}
      />
      <Pressable style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>Save deck</Text>
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
