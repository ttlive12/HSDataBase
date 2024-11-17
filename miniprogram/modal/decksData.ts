import { rankType } from "../api/type";

export type Card = {
  dbfId: number;
  cost: number;
  id: string;
  rarity: string;
  name: string;
};

export type Deck = {
  deckId: string;
  rank: string;
  cards: Card[];
  class: string;
  createdAt: string;
  deckcode: string;
  dust: number;
  games: number;
  name: string;
  winrate: number;
  legendaryCardNum: number;
  zhName: string;
  order: number;
};

export type IGetDecksData = {
  success: boolean;
  data: Record<rankType, Deck[]>;
};
