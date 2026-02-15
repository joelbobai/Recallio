import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { loadDecks, saveDecks } from '@/storage/deckStorage';
import { Card, Deck } from '@/types/deck';

type AddCardInput = {
  deckId: string;
  question: string;
  answer: string;
};

type DeckContextValue = {
  decks: Deck[];
  isLoading: boolean;
  addDeck: (title: string) => Promise<Deck>;
  addCard: (input: AddCardInput) => Promise<Deck | undefined>;
  deleteDeck: (deckId: string) => Promise<void>;
  deleteCard: (deckId: string, cardId: string) => Promise<void>;
  getDeckById: (deckId: string) => Deck | undefined;
};

const DeckContext = createContext<DeckContextValue | undefined>(undefined);

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function DeckProvider({ children }: PropsWithChildren) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function hydrateDecks() {
      const storedDecks = await loadDecks();
      setDecks(storedDecks);
      setIsLoading(false);
    }

    hydrateDecks();
  }, []);

  async function persistDecks(nextDecks: Deck[]) {
    setDecks(nextDecks);
    await saveDecks(nextDecks);
  }

  async function addDeck(title: string): Promise<Deck> {
    const nextDeck: Deck = {
      id: createId(),
      title,
      createdAt: new Date().toISOString(),
      cards: [],
    };

    const nextDecks = [nextDeck, ...decks];
    await persistDecks(nextDecks);
    return nextDeck;
  }

  async function addCard(input: AddCardInput): Promise<Deck | undefined> {
    let updatedDeck: Deck | undefined;
    const nextDecks = decks.map((deck) => {
      if (deck.id !== input.deckId) {
        return deck;
      }

      const nextCard: Card = {
        id: createId(),
        question: input.question,
        answer: input.answer,
      };

      updatedDeck = {
        ...deck,
        cards: [...deck.cards, nextCard],
      };

      return updatedDeck;
    });

    await persistDecks(nextDecks);
    return updatedDeck;
  }

  async function deleteDeck(deckId: string): Promise<void> {
    const nextDecks = decks.filter((deck) => deck.id !== deckId);
    await persistDecks(nextDecks);
  }

  async function deleteCard(deckId: string, cardId: string): Promise<void> {
    const nextDecks = decks.map((deck) => {
      if (deck.id !== deckId) {
        return deck;
      }

      return {
        ...deck,
        cards: deck.cards.filter((card) => card.id !== cardId),
      };
    });

    await persistDecks(nextDecks);
  }

  function getDeckById(deckId: string) {
    return decks.find((deck) => deck.id === deckId);
  }

  const value = useMemo(
    () => ({ decks, isLoading, addDeck, addCard, deleteDeck, deleteCard, getDeckById }),
    [decks, isLoading],
  );

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
}

export function useDecks(): DeckContextValue {
  const contextValue = useContext(DeckContext);
  if (!contextValue) {
    throw new Error('useDecks must be used within DeckProvider');
  }

  return contextValue;
}
