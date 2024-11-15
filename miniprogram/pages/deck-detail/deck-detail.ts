import { getDeckDataDetail } from "@/api/index";
import { rankType } from "@/api/type";
import { CardInfoShow, combineCardData, parseHtml } from "./util";

// pages/deckDetail/deck-detail.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardDatas: [] as CardInfoShow[],
    id: "",
    arr: [1, 2, 3, 45],
    currentType: "top_legend" as rankType,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options: Record<string, string>) {
    const id = options.id ? options.id : "Elemental+Mage";
    const rankBar = this.selectComponent("#rankBar");
    this.setData(
      {
        id,
        currentType: rankBar.getCurrentType(),
      },
      this.getData
    );
  },
  async getData() {
    const html = await getDeckDataDetail({
      DeckName: this.data.id,
      rank: this.data.currentType,
    });
    this.setData({ cardDatas: combineCardData(parseHtml(html)) });
  },
  handleRankChange(e: WechatMiniprogram.CustomEvent) {
    this.setData(
      {
        currentType: e.detail.currentType,
      },
      this.getData
    );
  },
});
