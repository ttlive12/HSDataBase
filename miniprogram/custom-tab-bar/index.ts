Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/home/home",
        text: "排行榜",
        icon: "/assets/rank.svg",
        selectIcon: "/assets/rank_orange.svg",
      },
      {
        pagePath: "/pages/deck/deck",
        text: "卡组推荐",
        icon: "/assets/deck.svg",
        selectIcon: "/assets/deck_orange.svg",
      },
      {
        pagePath: "/pages/my/my",
        text: "环境",
        icon: "/assets/env.svg",
        selectIcon: "/assets/env_orange.svg",
      },
    ],
  },
  methods: {
    switchTab(e: any) {
      const data = e.currentTarget.dataset;
      const index = data.index;
      const url = data.path;

      // 更新 selected
      this.setData({
        selected: index,
      });
      // 切换页面
      wx.switchTab({ url });
    },
  },
});
