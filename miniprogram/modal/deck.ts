import { rankType } from "@/api/type";
import { Deck } from "./decksData";

export interface DeckPageData {
  allDecks: Record<rankType, Deck[]>;
  decks: Deck[];
  currentType: rankType;
  loading: boolean;
  showFilter: boolean;
  filterClass: string;
  filterKeyword: string;
  wild: boolean;
  period: "past_day" | "default";
}

export interface DeckPageOptions {
  currentType?: rankType;
  class?: string;
}
