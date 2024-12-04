import request from "./request";
import { IGetDeckCardStatsData } from "../modal/deckCardStats";
import { IGetDecksData } from "../modal/decksData";
import { IGetRanksData } from "../modal/rankData";
import { IGetDeckDetailData } from "@/modal/deckDetails";

/***
 * 获取排行数据
 * @returns RankDataResponse
 */
export const getRankDatas = async () => {
  const wild = wx.getStorageSync("wild") || false;
  return await request<IGetRanksData>({
    url: `/getRanksData?wild=${wild}`,
    method: "GET",
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: "rank",
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: wild ? "wild" : "standard",
    },
  });
};

/**
 * 获取具体卡组数据
 */
export const getDeckCardStatsData = async (deckName: string) => {
  const wild = wx.getStorageSync("wild") || false;
  return await request<IGetDeckCardStatsData>({
    url: `/getDeckCardStats?deckName=${deckName}&wild=${wild}`,
    method: "GET",
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: "stats",
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: wild ? "wild" : "standard",
    },
  });
};

/**
 * 获取推荐卡组数据
 */
export const getDecksData = async () => {
  const wild = wx.getStorageSync("wild") || false;
  const period =
    wx.getStorageSync("period") === "past_day" ? "&period=past_day" : "";
  return await request<IGetDecksData>({
    url: `/getDecksData?wild=${wild}${period}`,
    method: "GET",
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: "rank",
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: wild ? "wild" : "standard",
      wxdata_perf_extra_info2: period ? "past_day" : "default",
    },
  });
};

/**
 * 获取推荐卡组数据详情
 */
export const getDeckDetails = async (deckId: number) => {
  const wild = wx.getStorageSync("wild") || false;
  return await request<IGetDeckDetailData>({
    url: `/getDeckDetails?deckId=${deckId}&wild=${wild}`,
    method: "GET",
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: "details",
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: wild ? "wild" : "standard",
    },
  });
};

/**
 * 获取排行卡组数据详情
 */
export const getRankDetails = async (name: string) => {
  const wild = wx.getStorageSync("wild") || false;
  return await request<IGetDecksData>({
    url: `/getRankDetails?name=${name}&wild=${wild}`,
    method: "GET",
    showLoading: true,
    varLabs: {
      wxdata_perf_monitor_id: "rankData",
      wxdata_perf_monitor_level: 1,
      wxdata_perf_extra_info1: wild ? "wild" : "standard",
    },
  });
};
