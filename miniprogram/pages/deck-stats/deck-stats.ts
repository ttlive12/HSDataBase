import { getDeckCardStatsData } from "@/api/index";
import { rankType } from "@/api/type";
import { CardInfo } from "@/modal/deckCardStats";

Page({
  data: {
    data: {} as Record<rankType, CardInfo[]>,
    currentType: "top_legend" as rankType,
  },
  async onLoad(options: Record<string, string>) {
    const data = await getDeckCardStatsData(options.id);
    this.setData({ data: data.data });
  },
  handleRankChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({
      currentType: e.detail.currentType,
    });
  },
});
