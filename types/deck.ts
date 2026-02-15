export type Card = {
  id: string;
  question: string;
  answer: string;
};

export type Deck = {
  id: string;
  title: string;
  createdAt: string;
  cards: Card[];
};
