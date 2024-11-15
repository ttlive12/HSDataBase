/**
 * 接入方法
 * <rank-bar id="rankBar" bind:rankChange="handleRankChange" />
 * handleRankChange(e: WechatMiniprogram.CustomEvent) {
      this.setData(
        {
          currentType: e.detail.currentType,
        }
      );
    },
 *  onLoad 生命周期
      const rankBar = this.selectComponent("#rankBar");
      this.setData(
        {
          currentType: rankBar.getCurrentType(),
        },
      );
 */

import { rankType } from "@/api/type";
import { dataTypes } from "@/constants";
Component({
  data: {
    currentType: "top_legend" as rankType,
    dataTypes,
  },
  lifetimes: {
    async attached() {
      const type = wx.getStorageSync("rankType");
      if (type) {
        this.setData({
          currentType: type,
        });
      }
    },
  },
  methods: {
    onShow() {
      this.setData({
        currentType: this.getCurrentType(),
      });
    },
    getCurrentType() {
      const type = wx.getStorageSync("rankType");
      if (type) {
        return type;
      }
      return this.data.currentType;
    },
    emitEvent() {
      this.triggerEvent("rankChange", {
        currentType: this.data.currentType,
      });
    },
    handleSwitch(e: WechatMiniprogram.TouchEvent) {
      wx.setStorageSync("rankType", e.currentTarget.dataset.type);
      this.setData(
        {
          currentType: e.currentTarget.dataset.type,
        },
        this.emitEvent
      );
    },
  },
});
