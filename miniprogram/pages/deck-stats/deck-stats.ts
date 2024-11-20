import { getDeckCardStatsData, getRankDetails } from "@/api/index";
import { rankType } from "@/api/type";
import { CardInfo } from "@/modal/deckCardStats";
import { Deck } from "@/modal/decksData";
import { class2Img } from "@/constants";

Page({
  data: {
    data: {} as Record<rankType, CardInfo[]>,
    decksData: {} as Record<rankType, Deck[]>,
    currentType: "top_legend" as rankType,
    popularityNum: "0",
    class2Img,
  },
  async onLoad(options: Record<string, string>) {
    const rankBar = this.selectComponent("#rankBar");
    if (rankBar) {
      rankBar.setCurrentType(options.currentType);
    }
    const data = await getDeckCardStatsData(options.id);
    const decksData = await getRankDetails(options.id);
    this.setData({
      data: data.data,
      decksData: decksData.data,
      zhName: options.zhName,
      currentType: options.currentType as rankType,
    });
  },
  handleRankChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({
      currentType: e.detail.currentType,
    });
  },
  handleJump(e: WechatMiniprogram.TouchEvent) {
    const deckData = e.currentTarget.dataset.data;
    wx.setStorageSync<Deck>("deckData", deckData);
    wx.navigateTo({
      url: `/pages/deck-detail/deck-detail?currentType=${this.data.currentType}`,
    });
  },
});
