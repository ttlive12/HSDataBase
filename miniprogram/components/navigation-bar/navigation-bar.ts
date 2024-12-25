import { IAppOption } from "typings";
const app = getApp<IAppOption>();
const eventBus = app.globalData.eventBus;
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
    period: "default",
    radioDecks: "1",
    wild: false,
    guidePositions: [] as any[], // 存储所有目标元素的位置
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
        isDevtools,
        ios: !isAndroid,
        innerPaddingRight: `padding-right: ${
          windowInfo.windowWidth - rect.left
        }px`,
        leftWidth: `width: ${windowInfo.windowWidth - rect.left}px`,
        safeAreaTop:
          isDevtools || isAndroid
            ? `height: calc(var(--height) + ${
                windowInfo.safeArea.top || 40
              }px); padding-top: ${windowInfo.safeArea.top || 40}px`
            : ``,
      });
      // if (!wx.getStorageSync("guide")) {
      //   nextTick(() => {
      //     if (!this.data.setting) return;
      //     wx.createSelectorQuery()
      //       .in(this)
      //       .select("#setting")
      //       .boundingClientRect((res) => {
      //         const guide = this.selectComponent("#guide");
      //         guide.startGuide(
      //           {
      //             left: res.left,
      //             top: res.top,
      //             width: res.width,
      //             height: res.height,
      //           },
      //           "点击进入设置"
      //         );
      //       })
      //       .exec();
      //   });
      // }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onShow(e: any) {
      const data = wx.getStorageSync("rank-type") || "1";
      const wild = wx.getStorageSync("wild") || false;
      const period = wx.getStorageSync("period") || "default";
      const show = Boolean(e && e.type);
      if (show) {
        wx.reportEvent("click_setting", {});
        app.globalData.eventBus.emit("showSetting");
      }
      this.setData({ show, radio: data, wild, period });
    },
    onClose() {
      this.setData({ show: false });
    },
    onChange(event: any) {
      wx.setStorageSync("rank-type", event.detail);
      this.setData({
        radio: event.detail,
      });
      eventBus.emit("setting");
    },
    onChangePeriod(event: any) {
      wx.setStorageSync("period", event.detail);
      this.setData({
        period: event.detail,
      });
      eventBus.emit("setting");
    },
    handleSwitch() {
      wx.setStorageSync("wild", !this.data.wild);
      this.setData({ rotate: true });
      setTimeout(() => {
        this.setData({
          wild: !this.data.wild,
        });
      }, 200);
      setTimeout(() => {
        this.setData({ rotate: false });
      }, 400);
      eventBus.emit("setting");
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
