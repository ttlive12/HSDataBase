/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { IGetArenaCardRank, IGetArenaData } from '@/modal/arena';
import { IGetDeckDetailData } from '@/modal/deckDetails';
import { IGetModeResponse, IGetPlayerRequest, IGetPlayerResponse } from '@/modal/player';

import wxRequest from './request';
import { IGetDeckCardStatsData } from '../modal/deckCardStats';
import { IGetDecksData } from '../modal/decksData';
import { IGetRanksData } from '../modal/rankData';

const { request, all } = wxRequest;

/***
 * 获取排行数据
 * @returns RankDataResponse
 */
export const getRankDatas = async () => {
  const wild = wx.getStorageSync('wild') || false;
  return await request<IGetRanksData>({
    url: `/getRanksData?wild=${wild}`,
    method: 'GET',
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: 'rank',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: wild ? 'wild' : 'standard',
    },
  });
};

/**
 * 获取具体卡组数据
 */
export const getDeckCardStatsData = async (deckName: string) => {
  const wild = wx.getStorageSync('wild') || false;
  return await request<IGetDeckCardStatsData>({
    url: `/getDeckCardStats?deckName=${deckName}&wild=${wild}`,
    method: 'GET',
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: 'stats',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: wild ? 'wild' : 'standard',
    },
  });
};

/**
 * 获取推荐卡组数据
 */
export const getDecksData = async () => {
  const wild = wx.getStorageSync('wild') || false;
  const period = wx.getStorageSync('period') === 'past_day' ? '&period=past_day' : '';
  return await request<IGetDecksData>({
    url: `/getDecksData?wild=${wild}${period}`,
    method: 'GET',
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: 'rank',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: wild ? 'wild' : 'standard',
      wxdata_perf_extra_info2: period ? 'past_day' : 'default',
    },
  });
};

/**
 * 获取推荐卡组数据详情
 */
export const getDeckDetails = async (deckId: string, pre = false) => {
  const wild = wx.getStorageSync('wild') || false;
  return await request<IGetDeckDetailData>({
    url: `/getDeckDetails?deckId=${deckId}&wild=${wild}`,
    method: 'GET',
    showLoading: !pre,
    varLabs: {
      wxdata_perf_monitor_id: 'details',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: wild ? 'wild' : 'standard',
    },
  });
};

/**
 * 获取排行卡组数据详情
 */
export const getRankDetails = async (name: string) => {
  const wild = wx.getStorageSync('wild') || false;
  return await request<IGetDecksData>({
    url: `/getRankDetails?name=${name}&wild=${wild}`,
    method: 'GET',
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: 'rankData',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: wild ? 'wild' : 'standard',
    },
  });
};

/**
 * 批量获取卡组统计和排行详情
 * @param deckName 卡组名称
 */
export const getDeckStatsAndRankDetails = async (deckName: string) => {
  const wild = wx.getStorageSync('wild') || false;
  const [deckCardStats, rankDetails] = await all([
    wxRequest.get<IGetDeckCardStatsData>(`/getDeckCardStats?deckName=${deckName}&wild=${wild}`, {
      showLoading: true,
      varLabs: {
        wxdata_perf_monitor_id: 'stats',
        wxdata_perf_monitor_level: 1,
        wxdata_perf_extra_info1: wild ? 'wild' : 'standard',
      },
    }),
    wxRequest.get<IGetDecksData>(`/getRankDetails?name=${deckName}&wild=${wild}`, {
      showLoading: true,
      varLabs: {
        wxdata_perf_monitor_id: 'rankData',
        wxdata_perf_monitor_level: 1,
        wxdata_perf_extra_info1: wild ? 'wild' : 'standard',
      },
    }),
  ]);

  return {
    deckCardStats: deckCardStats,
    rankDetails: rankDetails,
  };
};

/**
 * 获取竞技场职业排名数据
 * @returns 职业胜率排名
 */
export const getJJCRank = async (): Promise<IGetArenaData> => {
  return await request<IGetArenaData>({
    url: '/getJJCRank',
    method: 'GET',
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: 'arenaRank',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: 'arena',
    },
  });
};

/**
 * 获取竞技场职业卡牌排名数据
 * @param className 职业英文名，小写(例如: mage)
 * @returns 卡牌排名数据
 */
export const getJJCCardRank = async (className: string): Promise<IGetArenaCardRank> => {
  return await request<IGetArenaCardRank>({
    url: `/getJJCCardRank?class=${className}`,
    method: 'GET',
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: 'arenaCardRank',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: 'arena',
    },
  });
};

/**
 * 获取玩家竞技场排名数据
 * @returns 玩家竞技场排名数据
 */
export const getModeData = async (): Promise<IGetModeResponse> => {
  return await request<IGetModeResponse>({
    url: 'https://webapi.blizzard.cn/hs-rank-api-server/api/v2/game/mode',
    method: 'GET',
    showLoading: false,
    varLabs: {
      wxdata_perf_monitor_id: 'modeData',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: 'arena',
    },
  });
};

/**
 * 获取玩家竞技场排名数据
 * @returns 玩家竞技场排名数据
 */
export const getPlayerRank = async (
  params: IGetPlayerRequest,
  showLoading = false
): Promise<IGetPlayerResponse> => {
  return await request<IGetPlayerResponse>({
    url: 'https://webapi.blizzard.cn/hs-rank-api-server/api/game/ranks',
    method: 'GET',
    showLoading,
    varLabs: {
      wxdata_perf_monitor_id: 'playerRank',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: 'arena',
    },
    params,
  });
};

interface IGetConfigResponse {
  success: boolean;
  data: {
    update_time: string;
    [key: string]: string;
  };
}

/**
 * 获取配置
 */
export const getConfig = async () => {
  return await request<IGetConfigResponse>({
    url: '/getConfigData',
    method: 'GET',
    varLabs: {
      wxdata_perf_monitor_id: 'config',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: 'config',
    },
  });
};
