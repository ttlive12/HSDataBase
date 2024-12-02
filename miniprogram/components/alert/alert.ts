Component({
  properties: {
    title: {
      type: String,
      value: "",
    },
  },
  data: {
    show: false,
  },
  methods: {
    onClose() {
      this.setData({ show: false });
    },
    handleShow() {
      this.setData({
        show: true,
      });
      // wx.showModal({
      //   title: this.data.title,
      //   content: this.data.message,
      //   showCancel: false,
      //   confirmText: "知道了",
      // });
    },
  },
});
