import request from "./request";
import { RankDataResponse, CardData, rankType } from "./type";

/***
 * 获取排行数据
 * @returns RankDataResponse
 */
export const getRankDatas = async () => {
  return await request<RankDataResponse>({
    url: "https://ilw6383kw0.hzh.sealos.run/getRankData",
    method: "GET",
    showLoading: true,
  });
};

/***
 * 获取卡牌数据
 * @returns RankDataResponse
 */
export const getCardDatas = async () => {
  return await request<CardData[]>({
    url:
      "https://api.hearthstonejson.com/v1/latest/zhCN/cards.collectible.json",
    method: "GET",
    showLoading: true,
  });
};

/**
 * 获取具体卡组数据
 */
export const getDeckDataDetail = async ({ DeckName, rank }: {
  DeckName: String,
  rank: rankType
}) => {
  return await request<string>({
    url: `https://www.hsguru.com/card-stats?archetype=${DeckName}&rank=${rank}`,
    method: "GET",
    showLoading: true,
  });
};

/**
 * 获取推荐卡组数据
 */
export const getDecksData = async ({ rank }: {
  rank: rankType
}) => {
  return await request<string>({
    url: `https://www.hsguru.com/decks/?format=2&rank=${rank}`,
    method: "GET",
    showLoading: true,
  });
};
