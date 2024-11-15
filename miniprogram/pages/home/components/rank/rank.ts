import { getRankDatas } from "@/api/index";
import { DeckData, RankDatas, rankType } from "@/api/type";
import { dataTypes, class2Img } from "@/constants";
import { No1, No2, up, win, hand } from "@/assets/index";

Component({
  data: {
    dataTypes: dataTypes,
    currentType: "top_legend" as rankType,
    rankData: {} as RankDatas,
    updateTime: "",
    firstDeckData: {} as DeckData,
    secondDeckData: {} as DeckData,
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
      const rankBar = this.selectComponent("#rankBar");
      const data = await getRankDatas();
      // 更新 RankData 和 UpdateTime
      this.setData(
        {
          ...data,
          currentType: rankBar.getCurrentType(),
        },
        this.onUpdateData
      );
    },
  },
  methods: {
    onShow() {
      wx.nextTick(() => {
        const rankBar = this.selectComponent("#rankBar");
        if (rankBar.getCurrentType() === this.data.currentType) return;
        this.setData(
          {
            currentType: rankBar.getCurrentType(),
          },
          this.onUpdateData
        );
      });
    },
    handleRankChange(e: WechatMiniprogram.CustomEvent) {
      this.setData(
        {
          currentType: e.detail.currentType,
        },
        this.onUpdateData
      );
    },
    onUpdateData() {
      const rankBar = this.selectComponent("#rankBar");
      this.setData(
        {
          firstDeckData: this.data.rankData[this.data.currentType][0],
          secondDeckData: this.data.rankData[this.data.currentType][1],
        },
        () => {
          if (rankBar) {
            rankBar.onShow();
          }
        }
      );
    },
    handleJump(e: WechatMiniprogram.TouchEvent) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/deck-detail/deck-detail?id=${id}`,
      });
    },
  },
});
