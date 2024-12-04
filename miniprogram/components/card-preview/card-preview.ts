Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    cardId: {
      type: String,
      value: ''
    }
  },

  data: {
    isLoading: true
  },

  observers: {
    'show': function(show) {
      // 每次显示时重置加载状态
      if (show) {
        this.setData({ isLoading: true });
      }
    }
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    },

    onImageLoad() {
      // 高质量图片加载完成后，隐藏加载状态
      this.setData({ isLoading: false });
    }
  }
});
