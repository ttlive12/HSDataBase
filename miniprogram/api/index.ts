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
  return await request<IGetRanksData>({
    url: `/getRanksData?wild=${wx.getStorageSync("wild") || false}`,
    method: "GET",
    showLoading: true,
  });
};

/**
 * 获取具体卡组数据
 */
export const getDeckCardStatsData = async (deckName: string) => {
  return await request<IGetDeckCardStatsData>({
    url: `/getDeckCardStats?deckName=${deckName}&wild=${
      wx.getStorageSync("wild") || false
    }`,
    method: "GET",
    showLoading: true,
  });
};

/**
 * 获取推荐卡组数据
 */
export const getDecksData = async () => {
  const period =
    wx.getStorageSync("period") === "past_day" ? "&period=past_day" : "";
  return await request<IGetDecksData>({
    url: `/getDecksData?wild=${wx.getStorageSync("wild") || false}${period}`,
    method: "GET",
    showLoading: true,
  });
};

/**
 * 获取推荐卡组数据详情
 */
export const getDeckDetails = async (deckId: number) => {
  return await request<IGetDeckDetailData>({
    url: `/getDeckDetails?deckId=${deckId}&wild=${
      wx.getStorageSync("wild") || false
    }`,
    method: "GET",
    showLoading: true,
  });
};

/**
 * 获取排行卡组数据详情
 */
export const getRankDetails = async (name: string) => {
  return await request<IGetDecksData>({
    url: `/getRankDetails?name=${name}&wild=${
      wx.getStorageSync("wild") || false
    }`,
    method: "GET",
    showLoading: true,
  });
};
