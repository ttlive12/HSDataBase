import { getRankDatas } from "@/api/index";
import { rankType } from "@/api/type";
import { dataTypes, class2Img } from "@/constants";
import { No1, No2, up, win, hand } from "@/assets/index";
import { Rank, RankData } from "@/modal/rankData";
import { computeCompositeScores, rankDecks } from "@/utils/rank";

Component({
  data: {
    dataTypes: dataTypes,
    currentType: "top_legend" as rankType,
    rankData: {} as RankData,
    firstDeckData: {} as Rank,
    secondDeckData: {} as Rank,
    class2Img,
    showData: {},
    images: {
      No1,
      No2,
      up,
      win,
      hand,
    },
  },
  observers: {
    "rankData, currentType": function (rankData, currentType: rankType) {
      const weight: Record<rankType, { win: number; pick: number }> = {
        top_legend: { win: 0.6, pick: 0.4 },
        top_10k: { win: 0.65, pick: 0.35 },
        diamond_to_legend: { win: 0.75, pick: 0.25 },
        diamond_4to1: { win: 0.7, pick: 0.3 },
      };
      const decksWithScores = computeCompositeScores(
        rankData[currentType],
        weight[currentType].win,
        weight[currentType].pick,
      );
      const rankedDecks = rankDecks(decksWithScores);
      this.setData({
        showData: rankedDecks,
        firstDeckData: rankedDecks[0],
        secondDeckData: rankedDecks[1],
      });
    },
  },
  lifetimes: {
    async attached() {
      const data = await getRankDatas();
      this.setData({
        rankData: data.data,
      });
    },
  },
  methods: {
    handleRankChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({
        currentType: e.detail.currentType,
      });
    },
    handleJump(e: WechatMiniprogram.TouchEvent) {
      const data = e.currentTarget.dataset.data;
      wx.navigateTo({
        url: `/pages/deck-stats/deck-stats?id=${data.name}&zhName=${data.zhName}&currentType=${this.data.currentType}`,
      });
    },
  },
});
