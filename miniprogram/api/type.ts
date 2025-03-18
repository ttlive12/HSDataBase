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

export type rankType = 'diamond_4to1' | 'diamond_to_legend' | 'top_5k' | 'top_legend';

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

export interface RequestOption {
  url: string;
  showLoading?: boolean;
  showError?: boolean;
  method?: 'GET' | 'POST';
  data?: any;
  header?: any;
  varLabs?: varLabs;
  maxRetries?: number;
  priority?: number;
  ignoreOffline?: boolean;
}

export interface BatchRequestItem {
  path: string;
  params?: Record<string, any>;
  priority?: number;
}

export interface OfflineRequest {
  options: RequestOption;
  timestamp: number;
}
