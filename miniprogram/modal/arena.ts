export interface ArenaData {
  class: string;
  win_rate: number;
}

export interface IGetArenaData {
  success: boolean;
  data: Array<ArenaData>;
}

export interface CardInfo {
  dbf_id: number;
  included_count: number;
  included_popularity: number;
  included_winrate: number;
  winrate_when_played: number;
  cost: number;
  id: string;
  name: string;
  rarity: string;
}

export interface IGetArenaCardRank {
  success: boolean;
  data: Array<CardInfo>;
}
