import { getRankData } from "@/api/index";
import { RankDatas, rankType } from "@/api/type";
import { dataTypes } from "@/constants";

Component({
  data: {
    dataTypes: dataTypes,
    currentType: "top_legend" as rankType,
    rankData: {} as RankDatas,
    updateTime: "",
  },
  lifetimes: {
    async attached() {
      const data = await getRankData();
      this.setData({
        ...data,
      });
    },
  },
  methods: {
    handleSwitch(e: WechatMiniprogram.TouchEvent) {
      this.setData({
        currentType: e.currentTarget.dataset.type,
      });
    },
  },
});
