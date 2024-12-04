import { rankType } from "@/api/type";
import { CardInfo } from "./deckCardStats";
import { Deck } from "./decksData";
import { class2Img } from "@/constants";

export interface DeckStatsData {
  data: Record<rankType, CardInfo[]>;
  decksData: Record<rankType, Deck[]>;
  currentType: rankType;
  popularityNum: string;
  class2Img: typeof class2Img;
  showCardImg: boolean;
  cardId: string;
  zhName?: string;
  sortType: "mulliganImpact" | "drawnImpact" | "keptImpact";
  sortOrder: "asc" | "desc";
}

export interface PageOptions {
  id: string;
  zhName: string;
  currentType: rankType;
}
