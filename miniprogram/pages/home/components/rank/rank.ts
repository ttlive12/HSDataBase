import { getRankData } from "@/api/index";
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
      const data = await getRankData();
      // 更新 RankData 和 UpdateTime
      this.setData(
        {
          ...data,
        },
        this.onUpdateData
      );
    },
  },
  methods: {
    handleSwitch(e: WechatMiniprogram.TouchEvent) {
      this.setData(
        {
          currentType: e.currentTarget.dataset.type,
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
  },
});
