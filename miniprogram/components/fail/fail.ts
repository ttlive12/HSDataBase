// components/fail/fail.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    reload() {
      wx.reLaunch({
        url: "/pages/home/home",
      });
    },
  },
});
