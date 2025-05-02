export type ClassTypes =
  | 'shaman'
  | 'priest'
  | 'hunter'
  | 'rogue'
  | 'warlock'
  | 'mage'
  | 'warrior'
  | 'druid'
  | 'paladin'
  | 'deathknight'
  | 'demonhunter';

export type rankType =
  | 'TOP_1000_LEGEND'
  | 'DIAMOND_FOUR_THROUGH_DIAMOND_ONE'
  | 'LEGEND'
  | 'DIAMOND_THROUGH_LEGEND'
  | 'PLATINUM';

export interface varLabs {
  wxdata_perf_monitor_id?: string;
  wxdata_perf_monitor_level?: number;
  wxdata_perf_error_code?: number;
  wxdata_perf_error_msg?: string;
  wxdata_perf_cost_time?: number;
  wxdata_perf_extra_info1?: string;
  wxdata_perf_extra_info2?: string;
  wxdata_perf_extra_info3?: string;
}
