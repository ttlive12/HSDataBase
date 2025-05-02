/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { IGetArenaCardRank, IGetArenaData } from '@/modal/arena';
import { IGetDeckDetailData } from '@/modal/deckDetails';
import { IGetModeResponse, IGetPlayerRequest, IGetPlayerResponse } from '@/modal/player';

import wxRequest from './request';
import { IGetDeckCardStatsData } from '../modal/deckCardStats';
import { IGetDecksData } from '../modal/decksData';
import { IGetRanksData } from '../modal/rankData';

const { request, all } = wxRequest;

const getMode = () => {
  return wx.getStorageSync('wild') ? 'RANKED_WILD' : 'RANKED_STANDARD';
};

const getSource = () => {
  return (wx.getStorageSync('source') || 'cn') === 'cn' ? 'REGION_CN' : 'ALL';
};

const getPeriod = () => {
  return (wx.getStorageSync('period') || 'default') === 'default' ? 'CURRENT_PATCH' : 'LAST_3_DAYS';
};

const generateUrl = (
  baseUrl: string,
  gameType = getMode(),
  source = getSource(),
  period = getPeriod()
) => {
  return `${baseUrl}?${gameType ? `GameType=${gameType}&` : ''}${period ? `TimeRange=${period}&` : ''}${source ? `Region=${source}` : ''}`;
};

/***
 * 获取排行数据
 * @returns RankDataResponse
 */
export const getRankDatas = async () => {
  return await request<IGetRanksData>({
    url: generateUrl('/decks/archetype-rankings'),
    method: 'GET',
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: 'rank',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: getMode(),
    },
  });
};

/**
 * 获取具体卡组数据
 */
export const getDeckCardStatsData = async (deckName: string) => {
  return await request<IGetDeckCardStatsData>({
    url: `/decks/getDeckCardStats?deckName=${deckName}&wild=${getMode()}`,
    method: 'GET',
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: 'stats',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: getMode(),
    },
  });
};

/**
 * 获取推荐卡组数据
 */
export const getDecksData = async () => {
  return await request<IGetDecksData>({
    url: generateUrl(`/decks/rankings`),
    method: 'GET',
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: 'rank',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: getMode(),
    },
  });
};

/**
 * 获取推荐卡组数据详情
 */
export const getDeckDetails = async (deckId: string, pre = false) => {
  return await request<IGetDeckDetailData>({
    url: generateUrl(`/decks/details/${deckId}`),
    method: 'GET',
    showLoading: !pre,
    varLabs: {
      wxdata_perf_monitor_id: 'details',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: getMode(),
    },
  });
};

/**
 * 获取排行卡组数据详情
 */
export const getRankDetails = async (name: string) => {
  return await request<IGetDecksData>({
    url: `/decks/getRankDetails?name=${name}&wild=${getMode()}`,
    method: 'GET',
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: 'rankData',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: getMode(),
    },
  });
};

/**
 * 批量获取卡组统计和排行详情
 * @param id 卡组类型id
 */
export const getDeckStatsAndRankDetails = async (id: string) => {
  const [deckCardStats, rankDetails] = await all([
    wxRequest.get<IGetDeckCardStatsData>(
      generateUrl(`/decks/archetype/${id}/mulligan`),
      {
        showLoading: true,
        varLabs: {
          wxdata_perf_monitor_id: 'stats',
          wxdata_perf_monitor_level: 1,
          wxdata_perf_extra_info1: getMode(),
        },
      }
    ),
    wxRequest.get<IGetDecksData>(generateUrl(`/decks/archetype/${id}/decks`), {
      showLoading: true,
      varLabs: {
        wxdata_perf_monitor_id: 'rankData',
        wxdata_perf_monitor_level: 1,
        wxdata_perf_extra_info1: getMode(),
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
    url: '/arena/class-ranking',
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
    url: `/arena/card-ranking?class=${className}`,
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
