import { getRankDatas } from "@/api/index";
import { rankType } from "@/api/type";
import { dataTypes, class2Img } from "@/constants";
import { No1, No2, up, win, hand } from "@/assets/index";
import { Rank, RankData } from "@/modal/rankData";

Component({
  data: {
    dataTypes: dataTypes,
    currentType: "top_legend" as rankType,
    rankData: {} as RankData,
    firstDeckData: {} as Rank,
    secondDeckData: {} as Rank,
    class2Img,
    images: {
      No1,
      No2,
      up,
      win,
      hand,
    },
  },
  lifetimes: {
    async attached() {
      const data = await getRankDatas();
      this.setData(
        {
          rankData: data.data,
        },
        this.onUpdateData
      );
    },
  },
  methods: {
    handleRankChange(e: WechatMiniprogram.CustomEvent) {
      this.setData(
        {
          currentType: e.detail.currentType,
        },
        this.onUpdateData
      );
    },
    onUpdateData() {
      this.setData({
        firstDeckData: this.data.rankData[this.data.currentType][0],
        secondDeckData: this.data.rankData[this.data.currentType][1],
      });
    },
    handleJump(e: WechatMiniprogram.TouchEvent) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/deck-stats/deck-stats?id=${id}`,
      });
    },
  },
});
