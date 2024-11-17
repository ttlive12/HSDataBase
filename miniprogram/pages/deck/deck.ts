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
    const rankBar = this.selectComponent("#rankBar");
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
      }
    );
  },
  async getData() {
    const data = await getDecksData();
    this.setData({
      data: sortDecksByRank(data.data),
    });
  },
  handleRankChange(e: WechatMiniprogram.CustomEvent) {
    const rankBar = this.selectComponent("#rankBar");
    this.setData(
      {
        currentType: e.detail.currentType,
      },
      () => {
        if (rankBar) {
          rankBar.onShow();
        }
      }
    );
  },
});

function sortDecksByRank(
  decksByRank: Record<rankType, Deck[]>
): Record<rankType, Deck[]> {
  // 创建一个新的结果对象
  const sortedDecks: Record<rankType, Deck[]> = {} as Record<rankType, Deck[]>;

  // 遍历每个 rankType
  for (const rank in decksByRank) {
    const decks = decksByRank[rank as rankType];

    let arr1: Deck[] = [];
    let arr2: Deck[] = [];
    let heightSum1 = 0;
    let heightSum2 = 0;

    // 处理每个 rankType 下的 Deck[]，按照规则插入 arr1 和 arr2
    for (const deck of decks) {
      const h = deck.legendaryCardNum * 26 + 61.67;

      // 根据总高度决定将 deck 放入哪个数组
      if (heightSum1 <= heightSum2) {
        arr1.push(deck);
        heightSum1 += h;
      } else {
        arr2.push(deck);
        heightSum2 += h;
      }
    }

    // 合并 arr1 和 arr2，并将结果存入 sortedDecks
    sortedDecks[rank as rankType] = [...arr1, ...arr2];
  }

  return sortedDecks;
}
