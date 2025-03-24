/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { IGetDeckDetailData } from '@/modal/deckDetails';

import wxRequest from './request';
import { IGetDeckCardStatsData } from '../modal/deckCardStats';
import { IGetDecksData } from '../modal/decksData';
import { IGetRanksData } from '../modal/rankData';

const { request, preRequest, all } = wxRequest;

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
export const getDeckDetails = async (deckId: string) => {
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
 * 预加载卡组详情数据（用于提前缓存可能会被点击的卡组信息）
 * @param deckId 卡组ID
 */
export const preloadDeckDetails = async (deckId: string) => {
  const wild = wx.getStorageSync('wild') || false;

  preRequest({
    url: `/getDeckDetails?deckId=${deckId}&wild=${wild}`,
    varLabs: {
      wxdata_perf_monitor_id: 'preload_details',
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: wild ? 'wild' : 'standard',
    },
    preloadKey: deckId,
    expireTime: 600000,
  });

  return true;
};
