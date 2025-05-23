import { ClassTypes, rankType } from '../api/type';

export interface Rank {
  ClimbingSpeed: number;
  class: ClassTypes;
  name: string;
  popularityNum: number;
  popularityPercent: number;
  winrate: number;
  zhName: string;
  compositeScore?: number;
}

export type ChartData = Record<rankType, Rank[]>;

export type RankData = Record<rankType, Rank[]>;

export interface IGetRanksData {
  success: boolean;
  data: RankData;
}
