import { IAppOption } from 'typings';

import { getConfig } from '@/api/index';
const app = getApp<IAppOption>();
const eventBus = app.globalData.eventBus;

/**
 * 根据时间距离计算显示文本
 * @param updateTime ISO 格式的时间字符串，如 "2025-04-09T06:51:03.688Z"
 * @returns 格式化的显示文本
 */
function calculateShowTime(updateTime: string): string {
  // 解析更新时间
  const updateDateTime = new Date(updateTime);
  // 获取当前时间
  const currentDateTime = new Date();

  // 计算时间差（毫秒）
  const timeDiff = currentDateTime.getTime() - updateDateTime.getTime();
  // 转换为小时
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  // 根据规则确定显示文本
  if (hoursDiff < 0) {
    // 处理未来时间的情况
    return '刚刚';
  } else if (hoursDiff < 2) {
    return '一个小时内';
  } else if (hoursDiff < 3) {
    return '两个小时前';
  } else if (hoursDiff < 4) {
    return '三个小时前';
  } else if (hoursDiff < 5) {
    return '四个小时前';
  } else if (hoursDiff < 6) {
    return '五个小时前';
  } else if (hoursDiff < 7) {
    return '六个小时前';
  } else if (hoursDiff < 8) {
    return '七个小时前';
  } else if (hoursDiff < 9) {
    return '八个小时前';
  } else if (hoursDiff < 10) {
    return '九个小时前';
  } else {
    return '最近半天内';
  }
}

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
      value: 'HS',
    },
    subTitle: {
      type: String,
      value: '',
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
    displayStyle: '',
    show: false,
    radio: '1',
    period: 'default',
    radioDecks: '1',
    wild: false,
  },
  lifetimes: {
    attached() {
      const rect = wx.getMenuButtonBoundingClientRect();

      // 获取窗口信息
      const windowInfo = wx.getWindowInfo();
      // 获取设备信息
      const deviceInfo = wx.getDeviceInfo();

      const isAndroid = deviceInfo.platform === 'android' || deviceInfo.platform === 'windows';
      const isDevtools = deviceInfo.platform === 'devtools';
      const isHos = deviceInfo.platform === 'ohos';

      this.setData({
        isDevtools,
        ios: !isAndroid && !isHos,
        innerPaddingRight: `padding-right: ${windowInfo.windowWidth - rect.left}px`,
        leftWidth: `width: ${windowInfo.windowWidth - rect.left}px`,
        safeAreaTop:
          isDevtools || isAndroid || isHos
            ? `height: calc(var(--height) + ${
                windowInfo.safeArea.top || 40
              }px); padding-top: ${windowInfo.safeArea.top || 40}px`
            : ``,
      });

      wx.nextTick(() => {
        setTimeout(() => {
          getConfig().then((res) => {
            this.setData({
              updateTime: calculateShowTime(res.data.updateTime),
            });
          });
        }, 1000);
      });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onShow(e: WechatMiniprogram.TouchEvent) {
      const data = wx.getStorageSync('rank-type') || '1';
      const wild = wx.getStorageSync('wild') || false;
      const period = wx.getStorageSync('period') || 'default';
      const show = Boolean(e && e.type);
      if (show) {
        wx.reportEvent('click_setting', {});
        app.globalData.eventBus.emit('showSetting');
      }
      this.setData({ show, radio: data, wild, period });
    },
    onClose() {
      this.setData({ show: false });
    },
    onChange(event: WechatMiniprogram.CustomEvent<{ detail: string | number }>) {
      wx.setStorageSync('rank-type', event.detail);
      this.setData({
        radio: String(event.detail),
      });
      eventBus.emit('setting');
    },
    onChangePeriod(event: WechatMiniprogram.CustomEvent<{ detail: string | number }>) {
      wx.setStorageSync('period', event.detail);
      this.setData({
        period: String(event.detail),
      });
      eventBus.emit('setting');
    },
    handleSwitch() {
      wx.setStorageSync('wild', !this.data.wild);
      this.setData({ rotate: true });
      setTimeout(() => {
        this.setData({
          wild: !this.data.wild,
        });
      }, 200);
      setTimeout(() => {
        this.setData({ rotate: false });
      }, 400);
      eventBus.emit('setting');
    },
    handleBack() {
      wx.navigateBack();
    },
    handleBackHome() {
      wx.switchTab({
        url: '/pages/home/home',
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
        (firstDayOfNextMonth.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24);
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
