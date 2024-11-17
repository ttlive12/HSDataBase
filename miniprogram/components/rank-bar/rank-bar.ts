import { rankType } from "@/api/type";
import { dataTypes } from "@/constants";
Component({
  data: {
    currentType: "top_legend" as rankType,
    dataTypes,
  },
  methods: {
    emitEvent() {
      this.triggerEvent("rankChange", {
        currentType: this.data.currentType,
      });
    },
    handleSwitch(e: WechatMiniprogram.TouchEvent) {
      this.setData(
        {
          currentType: e.currentTarget.dataset.type,
        },
        this.emitEvent
      );
    },
  },
});
