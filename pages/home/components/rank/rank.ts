import { IAppOption } from 'typings';

import { getRankDatas } from '@/api/index';
import { rankType } from '@/api/type';
import { No1, No2, up, win, hand } from '@/assets/index';
import { dataTypes, class2Img } from '@/constants';
import { Rank, RankData } from '@/modal/rankData';

Component({
  data: {
    dataTypes: dataTypes,
    currentType: 'TOP_1000_LEGEND' as rankType,
    rankData: {} as RankData,
    firstDeckData: {} as Rank,
    secondDeckData: {} as Rank,
    class2Img,
    showData: {},
    images: {
      No1,
      No2,
      up,
      win,
      hand,
    },
    wild: false,
    source: 'cn',
    period: 'default',
  },
  observers: {
    'rankData, currentType': function (rankData, currentType: rankType) {
      const showData = rankData[currentType]?.map((item: any) => ({
        ...item,
        pct_of_total: item.pct_of_total.toFixed(1),
        winrate: item.winrate.toFixed(1),
      }));
      if (!showData) {
        return;
      }
      this.setData({
        showData,
        firstDeckData: showData[0] || {},
        secondDeckData: showData[1] || {},
      });
    },
  },
  lifetimes: {
    async attached() {
      const app = getApp<IAppOption>();
      const eventBus = app.globalData.eventBus;
      eventBus.on('setting', async () => {
        if (
          this.data.wild !== (wx.getStorageSync('wild') || false) ||
          this.data.source !== (wx.getStorageSync('source') || 'cn') ||
          this.data.period !== (wx.getStorageSync('period') || 'default')
        ) {
          const data = await getRankDatas();
          this.setData({
            rankData: data.data,
            wild: wx.getStorageSync('wild') || false,
            source: wx.getStorageSync('source') || 'cn',
            period: wx.getStorageSync('period') || 'default',
          });
        }
      });
      const data = await getRankDatas();
      this.setData({
        rankData: data.data,
        wild: wx.getStorageSync('wild') || false,
        source: wx.getStorageSync('source') || 'cn',
      });
    },
  },
  methods: {
    handleRankChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({
        currentType: e.detail.currentType,
      });
    },
    handleJump(e: WechatMiniprogram.TouchEvent) {
      const data = e.currentTarget.dataset.data;
      wx.navigateTo({
        url: `/pages/deck-stats/deck-stats?id=${data.archetype_id}&name=${data.name}&currentType=${this.data.currentType}`,
      });
    },
  },
});
