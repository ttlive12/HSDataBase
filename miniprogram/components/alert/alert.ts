Component({
  properties: {
    message: {
      type: String,
      value: "",
    },
    title: {
      type: String,
      value: "",
    },
  },
  data: {},
  methods: {
    handleShow() {
      wx.showModal({
        title: this.data.title,
        content: this.data.message,
        showCancel: false,
        confirmText: "知道了",
      });
    },
  },
});
