import { StyleSheet, Text, useColorScheme, View } from 'react-native';

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDark ? styles.lightText : styles.darkText]}>{title}</Text>
      <Text style={[styles.description, isDark ? styles.mutedDark : styles.mutedLight]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  lightContainer: {
    backgroundColor: '#F5F6F8',
  },
  darkContainer: {
    backgroundColor: '#1D1E24',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  darkText: {
    color: '#121212',
  },
  lightText: {
    color: '#F5F6F8',
  },
  mutedLight: {
    color: '#5D6672',
  },
  mutedDark: {
    color: '#ABB2C0',
  },
});
