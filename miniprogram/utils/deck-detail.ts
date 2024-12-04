import { rankType } from "@/api/type";
import { getDeckDetails } from "@/api/index";

type PageInstance = WechatMiniprogram.Page.Instance<
  Record<string, any>,
  Record<string, any>
>;

export class DeckDetailHelper {
  static async fetchDeckDetail(id: string) {
    try {
      const deckDetailsResponse = await getDeckDetails(Number(id));
      return {
        deckDetails: deckDetailsResponse.data,
      };
    } catch (error) {
      console.error("Failed to fetch deck detail:", error);
      throw error;
    }
  }

  static initializeRankBar(page: PageInstance, currentType: rankType) {
    const rankBar = page.selectComponent("#rankBar");
    if (rankBar) {
      rankBar.setCurrentType(currentType);
    }
  }

  static copyDeckCode(deckcode: string) {
    wx.setClipboardData({
      data: deckcode,
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
  }
}
