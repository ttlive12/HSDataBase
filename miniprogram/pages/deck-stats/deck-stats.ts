import { getDeckStatsAndRankDetails } from '@/api/index';
import { preloadDeckDetails } from '@/api/index';
import { rankType } from '@/api/type';
import { class2Img } from '@/constants';
import { CardInfo } from '@/modal/deckCardStats';
import { Deck } from '@/modal/decksData';

Page({
  data: {
    data: {} as Record<rankType, CardInfo[]>,
    decksData: {} as Record<rankType, Deck[]>,
    currentType: 'top_legend' as rankType,
    popularityNum: '0',
    class2Img,
    showCardImg: false,
    cardId: '',
    sortType: 'mulliganImpact' as 'mulliganImpact' | 'drawnImpact' | 'keptImpact',
    sortOrder: 'desc' as 'asc' | 'desc',
    loading: true,
  },
  showCardImg(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    this.setData({ showCardImg: true, cardId: id });
  },
  onCloseImg() {
    this.setData({ showCardImg: false });
  },
  async onLoad(options: Record<string, string>) {
    const rankBar = this.selectComponent('#rankBar');
    if (rankBar) {
      rankBar.setCurrentType(options.currentType);
    }
    const result = await getDeckStatsAndRankDetails(options.id);
    this.setData({
      data: result.deckCardStats.data,
      dataLength: Object.values(result.deckCardStats.data).flat().length,
      decksData: result.rankDetails.data,
      decksDataLength: Object.values(result.rankDetails.data).flat().length,
      zhName: options.zhName,
      currentType: options.currentType as rankType,
      loading: false,
    });

    this.preloadFirstDeckDetails();
  },

  // 预加载第一个可能会被点击的卡组详情
  preloadFirstDeckDetails() {
    const { currentType, decksData } = this.data;
    // 如果当前类型的卡组数据不存在或为空，则不执行预加载
    if (!decksData[currentType] || decksData[currentType].length === 0) {
      return;
    }
    // 获取第一个卡组作为预加载目标
    const firstDeck = decksData[currentType][0];
    preloadDeckDetails(firstDeck.deckId);
  },

  handleRankChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({
      currentType: e.detail.currentType,
    });

    // 当排行变化时，也预加载新类型下的第一个卡组
    this.preloadFirstDeckDetails();
  },
  handleJump(e: WechatMiniprogram.TouchEvent) {
    const deckData = e.currentTarget.dataset.data;
    wx.setStorageSync<Deck>('deckData', deckData);
    wx.navigateTo({
      url: `/pages/deck-detail/deck-detail?currentType=${this.data.currentType}`,
    });
  },
  handleSort(e: WechatMiniprogram.TouchEvent) {
    const type = e.currentTarget.dataset.type as 'mulliganImpact' | 'drawnImpact' | 'keptImpact';
    const { currentType, sortType, sortOrder } = this.data;

    const getValue = (item: CardInfo, key: keyof CardInfo) => {
      const value = item[key];
      if (typeof value === 'string') {
        return parseFloat(value.replace('%', '')) || 0;
      }
      return typeof value === 'number' ? value : 0;
    };

    // 如果点击的是当前排序字段，切换排序顺序
    if (type === sortType) {
      const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      this.setData({
        sortOrder: newSortOrder,
        [`data.${currentType}`]: [...this.data.data[currentType]].sort((a, b) => {
          const aValue = getValue(a, type);
          const bValue = getValue(b, type);
          return newSortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }),
      });
    } else {
      // 如果点击的是新字段，设置为降序
      this.setData({
        sortType: type,
        sortOrder: 'desc',
        [`data.${currentType}`]: [...this.data.data[currentType]].sort((a, b) => {
          const aValue = getValue(a, type);
          const bValue = getValue(b, type);
          return bValue - aValue; // 降序排列
        }),
      });
    }
  },
  onShareAppMessage() {},
  onShareTimeline() {},
});
