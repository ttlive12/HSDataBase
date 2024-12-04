import { rankType } from "@/api/type";
import { Deck } from "./decksData";
import { OpponentInfo } from "./deckDetails";
import { ClassTypes } from "@/api/type";

export interface EnhancedOpponentInfo extends OpponentInfo {
  color: string;
}

export interface DeckDetailData {
  deckData: Deck;
  deckDetails: Record<rankType, EnhancedOpponentInfo[]>;
  currentType: rankType;
  class2Img: Record<`${ClassTypes}`, string>;
  showCardImg: boolean;
  cardId: string;
  id: string;
}

export interface DeckDetailOptions {
  currentType: rankType;
  id?: string;
}
