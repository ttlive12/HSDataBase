import { IAppOption } from 'typings';

import { getRankDatas } from '@/api/index';
import { rankType } from '@/api/type';
import { RankData } from '@/modal/rankData';

Page({
  async onLoad() {
    const app = getApp<IAppOption>();
    const eventBus = app.globalData.eventBus;
    eventBus.on('setting', async () => {
      if (this.data.wild !== (wx.getStorageSync('wild') || false)) {
        const data = await getRankDatas();
        this.setData({
          rankData: data.data,
          wild: wx.getStorageSync('wild') || false,
        });
      }
    });
    const data = await getRankDatas();
    this.setData({
      rankData: data.data,
      wild: wx.getStorageSync('wild') || false,
    });
  },
  data: {
    rankData: {} as RankData,
    currentType: 'top_legend' as rankType,
    wild: false,
  },
  handleRankChange(e: WechatMiniprogram.CustomEvent<{ currentType: rankType }>) {
    if (e.detail.currentType !== this.data.currentType) {
      this.setData({
        currentType: e.detail.currentType,
      });
    }
  },
  onShareAppMessage() {},
  onShareTimeline() {},
});
