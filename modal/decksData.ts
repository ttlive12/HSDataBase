import { rankType } from '../api/type';

export interface Card {
  dbfId: number;
  id: string;
  rarity: string;
  name: string;
  cost: number;
  num: number;
}

export interface Deck {
  deck_id: string;
  archetype_id: number;
  cards: Card[];
  class: string;
  dust: number;
  totalGames: number;
  winrate: number;
  name: string;
  deckcode: string;
}

export interface IGetDecksData {
  success: boolean;
  data: Record<
    rankType,
    {
      data: Deck[];
      pagination: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
      };
    }
  >;
}
