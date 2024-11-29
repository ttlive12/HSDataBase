import { getDeckDetails } from "@/api/index";
import { rankType } from "@/api/type";
import { OpponentInfo } from "@/modal/deckDetails";
import { Deck } from "@/modal/decksData";
import { class2Img } from "@/constants";

Page({
  data: {
    deckData: {} as Deck,
    deckDetails: {} as Record<rankType, OpponentInfo[]>,
    id: "",
    currentType: "top_legend" as rankType,
    class2Img,
    showCardImg: false,
    cardId: "",
  },
  async onLoad(options: Record<string, string>) {
    const rankBar = this.selectComponent("#rankBar");
    if (rankBar) {
      rankBar.setCurrentType(options.currentType);
    }
    const deckData = wx.getStorageSync<Deck>("deckData");
    const deckDetails = await getDeckDetails(Number(deckData.deckId));
    this.setData({
      deckData,
      deckDetails: enhanceOpponentInfo(deckDetails.data),
      currentType: options.currentType as rankType,
    });
  },
  showCardImg(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    this.setData({ showCardImg: true, cardId: id });
  },
  onCloseImg() {
    this.setData({ showCardImg: false });
  },
  handleRankChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({
      currentType: e.detail.currentType,
    });
  },
  handleCopy() {
    wx.setClipboardData({
      data: this.data.deckData.deckcode,
      success: () => {
        wx.showToast({
          title: "复制成功",
          icon: "success",
        });
      },
      fail: () => {
        wx.showToast({
          title: "复制失败",
          icon: "none",
        });
      },
    });
  },
  onShareAppMessage() {},
  onShareTimeline() {},
});

function getColor(valueParam: number) {
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
}

function enhanceOpponentInfo(
  opponents: Record<rankType, OpponentInfo[]>
): Record<rankType, (OpponentInfo & { color: string })[]> {
  const enhanced: Record<rankType, (OpponentInfo & { color: string })[]> = {
    diamond_4to1: [],
    diamond_to_legend: [],
    top_10k: [],
    top_legend: [],
  };

  for (const rank of Object.keys(opponents) as rankType[]) {
    enhanced[rank] = opponents[rank].map((opponent) => ({
      ...opponent,
      color: getColor(opponent.winrate),
    }));
  }

  return enhanced;
}
