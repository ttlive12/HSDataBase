// pages/home/components/header/header.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {},

  lifetimes: {
    attached() {
      this.getCurrentDayAndMonthProgress();
    },
  },
  methods: {
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
