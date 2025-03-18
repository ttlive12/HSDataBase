import { IGetDeckDetailData } from '@/modal/deckDetails';

import request, { batchRequests } from './request';
import { BatchRequestItem, RequestOption } from './type';
import { IGetDeckCardStatsData } from '../modal/deckCardStats';
import { IGetDecksData } from '../modal/decksData';
import { IGetRanksData } from '../modal/rankData';

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
export const getDeckDetails = async (deckId: string, options?: Optional<RequestOption>) => {
  const wild = wx.getStorageSync('wild') || false;
  return await request<IGetDeckDetailData>({
    url: `/getDeckDetails?deckId=${deckId}&wild=${wild}`,
    method: 'GET',
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: 'details',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: wild ? 'wild' : 'standard',
    },
    ...options,
  });
};

/**
 * 获取排行卡组数据详情
 */
export const getRankDetails = async (name: string, options?: RequestOption) => {
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
    ...options,
  });
};

/**
 * 批量获取卡组统计和排行详情
 * @param deckName 卡组名称
 */
export const getDeckStatsAndRankDetails = async (deckName: string) => {
  const wild = wx.getStorageSync('wild') || false;

  const requests: BatchRequestItem[] = [
    {
      path: '/getDeckCardStats',
      params: { deckName, wild: String(wild) },
      priority: 5,
    },
    {
      path: '/getRankDetails',
      params: { name: deckName, wild: String(wild) },
      priority: 5,
    },
  ];

  const [deckCardStats, rankDetails] = await batchRequests<IGetDeckCardStatsData | IGetDecksData>(
    requests
  );

  return {
    deckCardStats: deckCardStats as IGetDeckCardStatsData,
    rankDetails: rankDetails as IGetDecksData,
  };
};

/**
 * 预加载卡组详情数据（用于提前缓存可能会被点击的卡组信息）
 * @param deckId 卡组ID
 * @param lowPriority 是否使用低优先级（默认为true，避免影响主要请求）
 */
export const preloadDeckDetails = async (deckId: string, lowPriority: boolean = true) => {
  const wild = wx.getStorageSync('wild') || false;

  // 使用较低的优先级，避免与用户当前需要的请求竞争
  const priority = lowPriority ? 1 : 3;

  try {
    await request<IGetDeckDetailData>({
      url: `/getDeckDetails?deckId=${deckId}&wild=${wild}`,
      method: 'GET',
      // 不显示加载提示和错误提示，保持静默操作
      showLoading: false,
      showError: false,
      priority,
      // 将请求标记为可以被忽略的，在网络不好时不会重试
      ignoreOffline: true,
      varLabs: {
        wxdata_perf_monitor_id: 'preload_details',
        wxdata_perf_monitor_level: 0,
        wxdata_perf_extra_info1: wild ? 'wild' : 'standard',
      },
    });
    console.log(`预加载卡组详情成功: ${deckId}`);
    return true;
  } catch (error) {
    console.log(`预加载卡组详情失败: ${deckId}`, error);
    return false;
  }
};
