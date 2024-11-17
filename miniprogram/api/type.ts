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