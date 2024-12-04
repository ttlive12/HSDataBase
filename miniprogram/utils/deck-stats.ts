import { rankType } from "@/api/type";
import { getDeckCardStatsData, getRankDetails } from "@/api/index";
import { CardInfo } from "@/modal/deckCardStats";
import { Deck } from "@/modal/decksData";

type PageInstance = WechatMiniprogram.Page.Instance<
  Record<string, any>,
  Record<string, any>
>;

export class DeckStatsHelper {
  static async fetchDeckData(id: string) {
    try {
      const [cardStatsRes, decksRes] = await Promise.all([
        getDeckCardStatsData(id),
        getRankDetails(id),
      ]);

      return {
        cardStats: cardStatsRes.data as Record<rankType, CardInfo[]>,
        decksData: decksRes.data as Record<rankType, Deck[]>,
      };
    } catch (error) {
      console.error("Failed to fetch deck data:", error);
      throw error;
    }
  }

  static initializeRankBar(page: PageInstance, currentType: rankType) {
    const rankBar = page.selectComponent("#rankBar");
    if (rankBar) {
      rankBar.setCurrentType(currentType);
    }
  }
}
