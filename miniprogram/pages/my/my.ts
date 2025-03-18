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
        if (!data.success) {
          this.setData({
            success: false,
          });
          return;
        }
        this.setData({
          success: true,
          rankData: data.data,
          wild: wx.getStorageSync('wild') || false,
        });
      }
    });
    const data = await getRankDatas();
    if (!data.success) {
      this.setData({
        success: false,
      });
      return;
    }
    this.setData({
      success: true,
      rankData: data.data,
      wild: wx.getStorageSync('wild') || false,
    });
  },
  data: {
    success: true,
    rankData: {} as RankData,
    currentType: 'top_legend' as rankType,
    wild: false,
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
      });
    }
  },
  handleRankChange(e: WechatMiniprogram.CustomEvent<{ currentType: rankType }>) {
    this.setData({
      currentType: e.detail.currentType,
    });
  },
  onShareAppMessage() {},
  onShareTimeline() {},
});
