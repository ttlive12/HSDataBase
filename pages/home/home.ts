Page({
  data: {},
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      });
    }
    const navBar = this.selectComponent('#nav-bar');
    if (navBar) {
      navBar.onShow();
    }
  },
  onShareAppMessage() {},
  onShareTimeline() {},
});
