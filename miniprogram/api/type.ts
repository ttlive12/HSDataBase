export type classTypes =
  | "shaman"
  | "priest"
  | "hunter"
  | "rogue"
  | "warlock"
  | "mage"
  | "warrior"
  | "druid"
  | "paladin"
  | "deathknight"
  | "demonhunter";

export type rankType =
  | "diamond_4to1"
  | "diamond_to_legend"
  | "top_10k"
  | "top_legend";

export interface RequestOption {
  url: string;
  showLoading?: Boolean;
  showError?: Boolean;
  method?: "GET" | "POST";
  data?: any;
  header?: any;
}

export interface RankDataResponse {
  updateTime: string;
  rankData: RankDatas;
}

export type RankDatas = Record<rankType, DeckData[]>;

export interface DeckData {
  ClimbingSpeed: String;
  class: classTypes;
  enName: String;
  popularityNum: Number;
  popularityPercent: Number;
  winrate: String;
  zhName: String;
}
