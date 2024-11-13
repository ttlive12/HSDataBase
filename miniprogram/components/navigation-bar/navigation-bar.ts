Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "",
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    displayStyle: "",
  },
  lifetimes: {
    attached() {
      const rect = wx.getMenuButtonBoundingClientRect();
      wx.getSystemInfo({
        success: (res) => {
          const isAndroid = res.platform === "android";
          const isDevtools = res.platform === "devtools";
          this.setData({
            ios: !isAndroid,
            innerPaddingRight: `padding-right: ${
              res.windowWidth - rect.left
            }px`,
            leftWidth: `width: ${res.windowWidth - rect.left}px`,
            safeAreaTop:
              isDevtools || isAndroid
                ? `height: calc(var(--height) + ${res.safeArea.top}px); padding-top: ${res.safeArea.top}px`
                : ``,
          });
        },
      });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
  },
});
