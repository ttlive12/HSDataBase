Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    cardId: {
      type: String,
      value: '',
    },
  },

  data: {
    isLoading: true,
  },

  observers: {
    show: function (show) {
      // 每次显示时重置加载状态
      if (show) {
        this.setData({ isLoading: true });
      }
    },
    cardId: function (cardId) {
      // 当cardId变化时重置加载状态
      if (cardId) {
        this.setData({ isLoading: true });
      }
    },
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    },
    onImageLoad() {
      this.setData({ isLoading: false });
    },
  },
});
