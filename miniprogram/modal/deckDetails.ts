import { ClassTypes, rankType } from "../api/type";

export interface OpponentInfo {
  class: ClassTypes | "total";
  winrate: number;
  total: number;
}

export type IGetDeckDetailData = {
  success: boolean;
  data: Record<rankType, OpponentInfo[]>;
};
