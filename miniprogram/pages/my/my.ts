import { arenaIcon } from '@/constants';

Page({
  data: {
    // environmentIcon,
    arenaIcon,
  },
  onLoad() {
    // 页面初始化
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
      });
    }
  },
  // 跳转到环境分析页面
  navigateToEnvironment() {
    wx.navigateTo({
      url: '/pages/environment/environment',
    });
  },
  // 跳转到竞技场页面
  navigateToArena() {
    wx.navigateTo({
      url: '/pages/arena/arena',
    });
  },
  // 跳转到玩家排行页面
  navigateToPlayerRank() {
    wx.navigateTo({
      url: '/pages/player-rank/player-rank',
    });
  },
  onShareAppMessage() {},
  onShareTimeline() {},
});
