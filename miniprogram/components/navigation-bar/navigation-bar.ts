import { IAppOption } from "typings";

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
      value: "HS",
    },
    subTitle: {
      type: String,
      value: "",
    },
    back: {
      type: Boolean,
      value: false,
    },
    setting: {
      type: Boolean,
      value: false,
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    displayStyle: "",
    show: false,
    radio: "1",
    safeAreaTop: `height: calc(var(--height) + 48px); padding-top: 48px`,
  },
  lifetimes: {
    attached() {
      const rect = wx.getMenuButtonBoundingClientRect();

      // 获取窗口信息
      const windowInfo = wx.getWindowInfo();
      // 获取设备信息
      const deviceInfo = wx.getDeviceInfo();

      const isAndroid = deviceInfo.platform === "android";
      const isDevtools = deviceInfo.platform === "devtools";

      this.setData({
        ios: !isAndroid,
        innerPaddingRight: `padding-right: ${
          windowInfo.windowWidth - rect.left
        }px`,
        leftWidth: `width: ${windowInfo.windowWidth - rect.left}px`,
        safeAreaTop:
          isDevtools || isAndroid
            ? `height: calc(var(--height) + ${windowInfo.safeArea.top}px); padding-top: ${windowInfo.safeArea.top}px`
            : ``,
      });

      this.getCurrentDayAndMonthProgress();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onShow() {
      const data = wx.getStorageSync("rank-type") || "1";
      this.setData({ show: true, radio: data });
    },
    onClose() {
      this.setData({ show: false });
      const app = getApp<IAppOption>();
      const eventBus = app.globalData.eventBus;
      eventBus.emit("setting");
    },
    onChange(event: any) {
      wx.setStorageSync("rank-type", event.detail);
      this.setData({
        radio: event.detail,
      });
    },
    handleBack() {
      wx.navigateBack();
    },
    handleBackHome() {
      wx.switchTab({
        url: "/pages/home/home",
      });
    },
    getCurrentDayAndMonthProgress() {
      const now = new Date();
      const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000); // UTC+8

      const year = beijingTime.getUTCFullYear();
      const month = beijingTime.getUTCMonth(); // 月份从0开始

      const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
      const firstDayOfNextMonth = new Date(Date.UTC(year, month + 1, 1));
      const currentDay = beijingTime.getUTCDate();
      const totalDaysInMonth =
        (firstDayOfNextMonth.getTime() - firstDayOfMonth.getTime()) /
        (1000 * 60 * 60 * 24);
      const monthProgress = (currentDay / totalDaysInMonth) * 100;

      // 计算当前月份是第几赛季
      const baseYear = 2024;
      const baseMonth = 10;
      const baseSeason = 133;

      const monthsSinceBase = (year - baseYear) * 12 + month - baseMonth;
      const currentSeason = baseSeason + monthsSinceBase;

      this.setData({
        currentMouth: month + 1,
        currentDay: currentDay,
        monthProgress: monthProgress.toFixed(0),
        currentSeason: currentSeason,
      });
    },
  },
});
