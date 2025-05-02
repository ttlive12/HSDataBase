import { getJJCCardRank } from '@/api/index';
import { ClassTypes } from '@/api/type';
import { class2Name } from '@/constants';
import { CardInfo } from '@/modal/arena';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    className: '',
    cardData: [] as CardInfo[],
    showCardImg: false,
    cardId: '',
    sortType: 'included_winrate',
    sortOrder: 'desc' as 'asc' | 'desc',
  },

  onLoad(options: { class: string }) {
    if (options.class) {
      this.setData({ className: class2Name[options.class as ClassTypes] });
      this.fetchCardData(options.class);
    }
  },

  onPullDownRefresh() {
    if (this.data.className) {
      this.fetchCardData(this.data.className).then(() => {
        wx.stopPullDownRefresh();
      });
    }
  },

  async fetchCardData(className: string) {
    const res = await getJJCCardRank(className);
    if (res.success && res.data.length > 0) {
      this.setData({
        cardData: res.data,
      });
    }
  },

  handleSort(e: WechatMiniprogram.TouchEvent) {
    const { type } = e.currentTarget.dataset;
    const { sortType, sortOrder, cardData } = this.data;

    if (type === sortType) {
      // 切换排序顺序
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      this.setData({
        sortOrder: newOrder,
        cardData: [...cardData].sort((a, b) => {
          const valueA = a[type as keyof CardInfo] as number;
          const valueB = b[type as keyof CardInfo] as number;
          return newOrder === 'asc' ? valueA - valueB : valueB - valueA;
        }),
      });
    } else {
      // 切换排序类型，默认降序
      this.setData({
        sortType: type,
        sortOrder: 'desc',
        cardData: [...cardData].sort((a, b) => {
          const valueA = a[type as keyof CardInfo] as number;
          const valueB = b[type as keyof CardInfo] as number;
          return valueB - valueA;
        }),
      });
    }
  },

  showCardImg(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;
    this.setData({
      showCardImg: true,
      cardId: id,
    });
  },

  onCloseImg() {
    this.setData({
      showCardImg: false,
      cardId: '',
    });
  },
});
