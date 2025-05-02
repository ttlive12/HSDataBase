import { ClassTypes, rankType } from '../api/type';

export interface Rank {
  archetype_id: number;
  class: ClassTypes;
  createdAt: string;
  gameType: string;
  leagueRankRange: rankType;
  name: string;
  pct_of_class: number;
  pct_of_total: number;
  region: string;
  timeRange: string;
  total_games: number;
  updatedAt: string;
  winrate: number;
  compositeScore?: number;
}

export type ChartData = Record<rankType, Rank[]>;

export type RankData = Record<rankType, Rank[]>;

export interface IGetRanksData {
  success: boolean;
  data: RankData;
}
