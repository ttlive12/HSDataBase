import { rankType } from "@/api/type";
import {
  DeckDetailData,
  DeckDetailOptions,
  EnhancedOpponentInfo,
} from "@/modal/deck-detail";
import { DeckDetailHelper } from "@/utils/deck-detail";
import { getDeckDetails } from "@/api/index";
import { Deck } from "@/modal/decksData";
import { class2Img } from "@/constants";
import { OpponentInfo } from "@/modal/deckDetails";

const DeckDetailPageNew = {
  getColor(valueParam: number) {
    const value = valueParam - 50;
    if (value <= -20) {
      return "rgb(255, 0, 0)";
    } else if (value >= 20) {
      return "rgb(0, 200, 0)";
    } else {
      const ratio = (value + 20) / 40;
      const red = Math.round(255 * (1 - ratio));
      const green = Math.round(200 * ratio);
      return `rgb(${red}, ${green}, 0)`;
    }
  },

  enhanceOpponentInfo(
    data: Record<rankType, OpponentInfo[]>
  ): Record<rankType, EnhancedOpponentInfo[]> {
    const result: Record<rankType, EnhancedOpponentInfo[]> = {} as Record<
      rankType,
      EnhancedOpponentInfo[]
    >;

    Object.entries(data).forEach(([rank, opponents]) => {
      result[rank as rankType] = opponents.map((opponent) => ({
        ...opponent,
        color: this.getColor(opponent.winrate),
      }));
    });

    return result;
  },
};

Page({
  data: {
    deckData: {} as Deck,
    deckDetails: {} as Record<rankType, EnhancedOpponentInfo[]>,
    currentType: "top_legend" as rankType,
    class2Img,
    showCardImg: false,
    cardId: "",
    id: "",
  } as DeckDetailData,

  async onLoad(options: Record<string, string>) {
    const pageOptions = {
      currentType: (options.currentType || "top_legend") as rankType,
      id: options.id,
    };
    await this.initializePage(pageOptions);
  },

  async initializePage(options: DeckDetailOptions) {
    DeckDetailHelper.initializeRankBar(this, options.currentType);
    this.setData({
      currentType: options.currentType,
      id: options.id || "",
    });
    await this.fetchDeckDetail();
  },

  async fetchDeckDetail() {
    try {
      const deckData = wx.getStorageSync<Deck>("deckData");
      const deckDetailsResponse = await getDeckDetails(Number(deckData.deckId));

      const enhancedDetails = DeckDetailPageNew.enhanceOpponentInfo(
        deckDetailsResponse.data
      );

      this.setData({
        deckData,
        deckDetails: enhancedDetails,
      });
    } catch (error) {
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

  handleCopy() {
    if (this.data.deckData.deckcode) {
      DeckDetailHelper.copyDeckCode(this.data.deckData.deckcode);
    }
  },

  onShareAppMessage() {},

  onShareTimeline() {},
});
