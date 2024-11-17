import { ClassTypes, rankType } from "../api/type";

export interface Rank {
  ClimbingSpeed: Number;
  class: ClassTypes;
  name: String;
  popularityNum: Number;
  popularityPercent: Number;
  winrate: Number;
  zhName: String;
}
export type RankData = Record<rankType, Rank[]>;

export type IGetRanksData = {
  success: boolean;
  data: RankData;
};
