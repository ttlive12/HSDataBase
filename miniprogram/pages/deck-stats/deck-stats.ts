import { rankType } from "@/api/type";
import { class2Img } from "@/constants";
import { DeckStatsData, PageOptions } from "@/modal/deck-stats";
import { CardInfo } from "@/modal/deckCardStats";
import { Deck } from "@/modal/decksData";
import { DeckStatsHelper } from "@/utils/deck-stats";

Page({
  data: {
    data: {} as Record<rankType, CardInfo[]>,
    decksData: {} as Record<rankType, Deck[]>,
    currentType: "top_legend" as rankType,
    popularityNum: "0",
    class2Img,
    showCardImg: false,
    cardId: "",
    zhName: "",
    sortType: "mulliganImpact" as
      | "mulliganImpact"
      | "drawnImpact"
      | "keptImpact",
    sortOrder: "desc" as "asc" | "desc",
  } as DeckStatsData,

  async onLoad(options: Record<string, string>) {
    await this.initializePage((options as unknown) as PageOptions);
  },

  async initializePage(options: PageOptions) {
    DeckStatsHelper.initializeRankBar(this, options.currentType);
    await this.fetchDeckData(options);
    this.setData({ currentType: options.currentType });
  },

  async fetchDeckData(options: PageOptions) {
    try {
      const { cardStats, decksData } = await DeckStatsHelper.fetchDeckData(
        options.id
      );

      this.setData({
        data: cardStats,
        decksData: decksData,
        zhName: options.zhName,
      });
    } catch (error) {
      console.error("Failed to fetch deck data:", error);
      wx.showToast({
        title: "获取数据失败",
        icon: "error",
      });
    }
  },

  handleRankChange(
    e: WechatMiniprogram.CustomEvent<{ currentType: rankType }>
  ) {
    const { currentType } = e.detail;
    this.setData({ currentType });
  },

  handleJump(e: WechatMiniprogram.TouchEvent) {
    const { data } = e.currentTarget.dataset;
    this.navigateToDeckDetail(data);
  },

  navigateToDeckDetail(deckData: Deck) {
    wx.navigateTo({
      url: `/pages/deck-detail/deck-detail?id=${deckData.deckId}&zhName=${deckData.zhName}&currentType=${this.data.currentType}`,
    });
  },

  showCardImg(e: WechatMiniprogram.TouchEvent) {
    const cardId = e.currentTarget.dataset.id;
    this.setData({
      showCardImg: true,
      cardId,
    });
  },

  onCloseImg() {
    this.setData({
      showCardImg: false,
      cardId: "",
    });
  },

  handleSort(e: WechatMiniprogram.TouchEvent) {
    const type = e.currentTarget.dataset.type as
      | "mulliganImpact"
      | "drawnImpact"
      | "keptImpact";
    const { currentType, sortType, sortOrder } = this.data;

    const getValue = (item: CardInfo, key: keyof CardInfo) => {
      const value = item[key];
      if (typeof value === "string") {
        return parseFloat(value.replace("%", "")) || 0;
      }
      return typeof value === "number" ? value : 0;
    };

    // 如果点击的是当前排序字段，切换排序顺序
    if (type === sortType) {
      const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
      this.setData({
        sortOrder: newSortOrder,
        [`data.${currentType}`]: [...this.data.data[currentType]].sort(
          (a, b) => {
            const aValue = getValue(a, type);
            const bValue = getValue(b, type);
            return newSortOrder === "asc" ? aValue - bValue : bValue - aValue;
          }
        ),
      });
    } else {
      // 如果点击的是新字段，设置为降序
      this.setData({
        sortType: type,
        sortOrder: "desc",
        [`data.${currentType}`]: [...this.data.data[currentType]].sort(
          (a, b) => {
            const aValue = getValue(a, type);
            const bValue = getValue(b, type);
            return bValue - aValue; // 降序排列
          }
        ),
      });
    }
  },

  onShareAppMessage() {},

  onShareTimeline() {},
});
