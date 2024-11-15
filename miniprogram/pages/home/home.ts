Page({
  data: {},
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      });
    }
    const rank = this.selectComponent("#rank");
    if (rank) {
      rank.onShow();
    }
  },
});
