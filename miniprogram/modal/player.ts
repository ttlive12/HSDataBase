export type ModeTypes =
  | 'arena'
  | 'battlegrounds'
  | 'battlegroundsduo'
  | 'wild'
  | 'standard'
  | 'twist'
  | 'mercenaries';

export interface IGetModeResponse {
  code: number;
  message: string;
  data: {
    game_modes: {
      mode_name: ModeTypes;
      cn_mode_name: string;
    }[];
    season_map: {
      [key in ModeTypes]: {
        season_id: number;
        season: string;
      }[];
    };
  };
}

export interface IGetPlayerResponse {
  code: number;
  message: string;
  data: {
    list: {
      position: number;
      battle_tag: string;
    }[];
    total: number;
  };
}

export interface IGetPlayerRequest {
  mode_name: ModeTypes;
  season_id: number;
  page: number;
  page_size: 25;
}
