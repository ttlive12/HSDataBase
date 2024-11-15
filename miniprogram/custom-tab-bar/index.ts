Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/home/home",
        text: "排行",
      },
      {
        pagePath: "/pages/deck/deck",
        text: "卡组",
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
