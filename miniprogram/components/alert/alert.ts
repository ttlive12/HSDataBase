import Dialog from "@/miniprogram_npm/@vant/weapp/dialog/dialog";

Component({
  options: {
    styleIsolation: "shared",
  },
  /**
   * 组件的属性列表
   */
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

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleShow() {
      Dialog.alert({
        message: this.data.message,
        confirmButtonText: "知道了",
        closeOnClickOverlay: true,
        context: this,
        title: this.data.title,
      });
    },
  },
});
