export type ClassTypes =
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
  ClimbingSpeed: Number;
  class: ClassTypes;
  enName: String;
  popularityNum: Number;
  popularityPercent: Number;
  winrate: Number;
  zhName: String;
}

export interface CardData {
  cardClass: Uppercase<ClassTypes>;
  cost: Number; // 法力值
  dbfId: Number;
  flavor: String; // 趣闻
  id: String;
  name: String;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGEND";
  set: String; // 拓展包
  spellSchool?: String; // 法术类型
  text: String; // 卡牌描述
  type: String; // 卡牌类型  MINION ｜ SPELL
  attack?: Number; //攻击力
  health?: Number; //生命值
}
