import { getDecksData } from "@/api/index";
import { rankType } from "@/api/type";
import { getDeckStatsDivs, parseDeckStatsHtml } from "./tools";

Page({
  data: {
    currentType: "top_legend" as rankType,
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
    const temp = getDeckStatsDivs(data);
    console.log(parseDeckStatsHtml(temp[1]));
  },
});
