import { rankType } from '../api/type';

export interface CardInfo {
  dbfId: number;
  cost: number;
  id: string;
  rarity: string;
  name: string;
  keep_percentage: number;
  opening_hand_winrate: number;
  winrate_when_drawn: number;
  winrate_when_played: number;
  rank: number;
}

export interface IGetDeckCardStatsData {
  success: boolean;
  data: Record<rankType, CardInfo[]>;
}
