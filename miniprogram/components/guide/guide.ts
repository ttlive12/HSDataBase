import { IAppOption } from 'typings';

const app = getApp<IAppOption>();

Component({
  properties: {},

  data: {
    guidePosition: null as any, // 引导框的位置
    guideContent: '', // 当前引导的内容
    isGuideVisible: false, // 是否显示引导层
  },
  lifetimes: {
    attached() {
      app.globalData.eventBus.on('showSetting', () => {
        this.setData({
          isGuideVisible: false,
        });
        wx.setStorageSync('guide', true);
      });
    },
  },
  methods: {
    // 初始化引导
    startGuide(position: any, content: string) {
      this.setData({
        isGuideVisible: true,
        guidePosition: position,
        guideContent: content,
      });
    },
    finish() {
      wx.setStorageSync('guide', true);
      this.setData({
        isGuideVisible: false,
      });
    },
  },
});
