import { rankType } from "../api/type";

export interface CardInfo {
  id: string;
  cost: number;
  name: string;
  rarity: string;
  mulliganImpact: string;
  drawnImpact: string;
  keptImpact: string;
  mulliganImpactColor: string;
  drawnImpactColor: string;
  keptImpactColor: string;
}

export type IGetDeckCardStatsData = {
  success: boolean;
  data: Record<rankType, CardInfo[]>;
};

