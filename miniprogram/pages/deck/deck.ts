import { getDecksData } from "@/api/index";
import { rankType } from "@/api/type";
import { class2Img } from "@/constants";
import { Deck } from "@/modal/decksData";

Page({
  data: {
    currentType: "top_legend" as rankType,
    class2Img,
    data: {} as Record<rankType, Deck[]>,
  },

  onLoad() {
    this.initializeRankBar();
  },

  onShow() {
    this.updateTabBarSelection();
  },

  initializeRankBar() {
    this.getData();
  },

  async getData() {
    try {
      const { data } = await getDecksData();
      this.setData({
        data: this.sortDecksByRank(data),
        loading: false,
      });
    } catch (error) {
      console.error("获取卡组数据失败:", error);
      this.setData({ loading: false });
      wx.showToast({
        title: "数据加载失败",
        icon: "none",
      });
    }
  },

  updateTabBarSelection() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  handleRankChange(
    e: WechatMiniprogram.CustomEvent<{ currentType: rankType }>
  ) {
    this.setData({
      currentType: e.detail.currentType,
    });
  },

  sortDecksByRank(
    decksByRank: Record<rankType, Deck[]>
  ): Record<rankType, Deck[]> {
    const sortedDecks: Record<rankType, Deck[]> = {} as Record<
      rankType,
      Deck[]
    >;

    (Object.entries(decksByRank) as [rankType, Deck[]][]).forEach(
      ([rank, decks]) => {
        const columns: [Deck[], Deck[]] = [[], []];
        const heights: [number, number] = [0, 0];

        decks.forEach((deck: Deck) => {
          const height = deck.legendaryCardNum * 26 + 61.67;
          const columnIndex = heights[0] <= heights[1] ? 0 : 1;

          columns[columnIndex].push(deck);
          heights[columnIndex] += height;
        });

        sortedDecks[rank] = [...columns[0], ...columns[1]];
      }
    );

    return sortedDecks;
  },
  handleJump(e: WechatMiniprogram.TouchEvent) {
    const deckData = e.currentTarget.dataset.data;
    wx.setStorageSync<Deck>("deckData", deckData);
    wx.navigateTo({
      url: `/pages/deck-detail/deck-detail?currentType=${this.data.currentType}`,
    });
  },
});
