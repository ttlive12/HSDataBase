import request from "./request";
import { IGetDeckCardStatsData } from "../modal/deckCardStats";
import { IGetDecksData } from "../modal/decksData";
import { IGetRanksData } from "../modal/rankData";

/***
 * 获取排行数据
 * @returns RankDataResponse
 */
export const getRankDatas = async () => {
  return await request<IGetRanksData>({
    url: "https://zzyixzgjmqpx.sealoshzh.site/getRanksData",
    method: "GET",
    showLoading: true,
  });
};

/**
 * 获取具体卡组数据
 */
export const getDeckCardStatsData = async (deckName: string) => {
  return await request<IGetDeckCardStatsData>({
    url: `https://zzyixzgjmqpx.sealoshzh.site/getDeckCardStats?deckName=${deckName}`,
    method: "GET",
    showLoading: true,
  });
};

/**
 * 获取推荐卡组数据
 */
export const getDecksData = async () => {
  return await request<IGetDecksData>({
    url: `https://zzyixzgjmqpx.sealoshzh.site/getDecksData`,
    method: "GET",
    showLoading: true,
  });
};
