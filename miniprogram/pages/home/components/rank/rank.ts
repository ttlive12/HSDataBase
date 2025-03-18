import { IAppOption } from 'typings';

import { getRankDatas } from '@/api/index';
import { rankType } from '@/api/type';
import { No1, No2, up, win, hand } from '@/assets/index';
import { dataTypes, class2Img } from '@/constants';
import { Rank, RankData } from '@/modal/rankData';
import { computeCompositeScores, rankDecks } from '@/utils/rank';

Component({
  data: {
    rankType: wx.getStorageSync('rank-type') || '1',
    dataTypes: dataTypes,
    currentType: 'top_legend' as rankType,
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
    success: true,
    wild: false,
  },
  observers: {
    'rankData, currentType, rankType': function (rankData, currentType: rankType, rankType) {
      const weight: Record<rankType, { win: number; pick: number }> = {
        top_legend: { win: 0.7, pick: 0.3 },
        top_5k: { win: 0.75, pick: 0.25 },
        diamond_to_legend: { win: 0.75, pick: 0.25 },
        diamond_4to1: { win: 0.8, pick: 0.2 },
      };
      const decksWithScores = computeCompositeScores(
        rankData[currentType],
        weight[currentType].win,
        weight[currentType].pick
      );
      const rankedDecks = rankType === '1' ? rankDecks(decksWithScores) : rankData[currentType];
      this.setData({
        showData: rankedDecks,
        firstDeckData: rankedDecks[0] || {},
        secondDeckData: rankedDecks[1] || {},
      });
    },
  },
  lifetimes: {
    async attached() {
      const app = getApp<IAppOption>();
      const eventBus = app.globalData.eventBus;
      eventBus.on('setting', async () => {
        this.setData({
          rankType: wx.getStorageSync('rank-type') || '1',
        });
        if (this.data.wild !== (wx.getStorageSync('wild') || false)) {
          const data = await getRankDatas();
          if (!data.success) {
            this.setData({
              success: false,
            });
            return;
          }
          this.setData({
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
        rankData: data.data,
        wild: wx.getStorageSync('wild') || false,
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
        url: `/pages/deck-stats/deck-stats?id=${data.name}&zhName=${data.zhName}&currentType=${this.data.currentType}`,
      });
    },
  },
});
