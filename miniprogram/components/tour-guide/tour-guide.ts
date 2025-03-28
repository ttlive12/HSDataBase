interface TourStep {
  target?: string; // 目标元素的类名
  title: string; // 引导标题
  content: string; // 引导内容
  placement?: 'top' | 'bottom' | 'left' | 'right'; // 提示框位置
  rect?: WechatMiniprogram.BoundingClientRectCallbackResult; // 直接传入的位置信息
}

Component({
  properties: {
    steps: {
      type: Array,
      value: [] as TourStep[],
    },
    storageKey: {
      type: String,
      value: '',
    },
    targetRect: {
      type: Object,
      value: {},
    },
  },

  data: {
    currentStep: 0,
    show: false,
    currentStepData: null as TourStep | null,
    targetRect: null as WechatMiniprogram.BoundingClientRectCallbackResult | null,
    // 用于存储 properties 的副本，以便在方法中访问
    stepsData: [] as TourStep[],
    storageKeyData: '',
    targetRectData: null as WechatMiniprogram.BoundingClientRectCallbackResult | null,
  },

  observers: {
    steps: function (steps) {
      this.setData({ stepsData: steps });
    },
    storageKey: function (storageKey) {
      this.setData({ storageKeyData: storageKey });
    },
    targetRect: function (targetRect) {
      this.setData({ targetRectData: targetRect });
    },
  },

  lifetimes: {
    attached() {
      // 等待所有属性传递完毕
      setTimeout(() => {
        this.checkAndShow();
      }, 500);
    },
  },

  methods: {
    checkAndShow() {
      const { storageKeyData, stepsData } = this.data;
      if (!storageKeyData) return;

      if (!stepsData || stepsData.length === 0) return;

      const hasSeen = wx.getStorageSync(storageKeyData);
      if (!hasSeen) {
        this.startTour();
      }
    },

    startTour() {
      this.setData(
        {
          show: true,
          currentStep: 0,
        },
        () => {
          this.updateCurrentStep();
        }
      );
    },

    updateCurrentStep() {
      const { currentStep, stepsData, targetRectData } = this.data;
      if (currentStep >= stepsData.length) {
        this.endTour();
        return;
      }

      const step = stepsData[currentStep];

      // 先获取位置信息，后更新步骤数据，避免中间态
      let rect = null;

      // 优先使用步骤中提供的位置信息
      if (step.rect) {
        rect = step.rect;
      }
      // 其次使用属性中的位置信息
      else if (targetRectData) {
        rect = targetRectData;
      }
      // 如果没有找到位置信息，使用默认位置
      else {
        // 立即创建默认高亮位置，但不设置到 data 中
        wx.getSystemInfo({
          success: (res) => {
            rect = {
              left: res.windowWidth / 2 - 150,
              top: res.windowHeight / 3,
              width: 300,
              height: 100,
              right: res.windowWidth / 2 + 150,
              bottom: res.windowHeight / 3 + 100,
              id: '',
              dataset: {} as any,
            } as WechatMiniprogram.BoundingClientRectCallbackResult;

            // 一次性更新所有相关数据，避免中间状态
            this.setData({
              currentStepData: step,
              targetRect: rect,
            });
          },
        });
        return;
      }

      // 一次性更新所有相关数据，避免中间状态
      this.setData({
        currentStepData: step,
        targetRect: rect,
      });
    },

    nextStep() {
      const { currentStep, stepsData } = this.data;
      if (currentStep < stepsData.length - 1) {
        this.setData({ currentStep: currentStep + 1 });
        this.updateCurrentStep();
      } else {
        this.endTour();
      }
    },

    prevStep() {
      const { currentStep } = this.data;
      if (currentStep > 0) {
        this.setData({ currentStep: currentStep - 1 });
        this.updateCurrentStep();
      }
    },

    endTour() {
      const { storageKeyData } = this.data;
      this.setData({ show: false });
      if (storageKeyData) {
        wx.setStorageSync(storageKeyData, true);
      }
      this.triggerEvent('end');
    },

    skipTour() {
      this.endTour();
    },
  },
});
