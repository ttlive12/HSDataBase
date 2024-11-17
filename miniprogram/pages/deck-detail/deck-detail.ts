import { getDeckCardStatsData } from "@/api/index";
import { rankType } from "@/api/type";
import { CardInfo } from "@/modal/deckCardStats";

// pages/deckDetail/deck-detail.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {} as Record<rankType, CardInfo[]>,
    id: "",
    currentType: "top_legend" as rankType,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options: Record<string, string>) {
    const data = await getDeckCardStatsData(options.id);
    this.setData({ data: data.data });
    const rankBar = this.selectComponent("#rankBar");
    this.setData({
      currentType: rankBar.getCurrentType(),
    });
  },
  handleRankChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({
      currentType: e.detail.currentType,
    });
  },
});
