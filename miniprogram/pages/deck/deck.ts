import { getDecksData } from "@/api/index";
import { rankType } from "@/api/type";
import { parseData, IDecksData } from "./tools";
import { class2Img } from "@/constants";
Page({
  data: {
    currentType: "top_legend" as rankType,
    deckDatas: [] as IDecksData[],
    class2Img
  },
  onLoad() {
    const rankBar = this.selectComponent("#rankBar")
    this.setData(
      {
        currentType: rankBar.getCurrentType(),
      },
      () => {
        if (rankBar) {
          rankBar.onShow();
        }
        this.getData();
      }
    );
  },
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
      });
    }
    const rankBar = this.selectComponent("#rankBar");
    if (rankBar.getCurrentType() === this.data.currentType) return;
    this.setData(
      {
        currentType: rankBar.getCurrentType(),
      },
      () => {
        if (rankBar) {
          rankBar.onShow();
        }
        this.getData();
      }
    );
  },
  async getData() {
    const data = await getDecksData({
      rank: this.data.currentType,
    });
    this.setData({
      deckDatas: parseData(data)
    })
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
