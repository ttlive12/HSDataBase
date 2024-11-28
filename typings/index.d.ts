/// <reference path="./types/index.d.ts" />
import EventBus from "@/utils/eventBus";
interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo;
    eventBus: EventBus;
  };
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
}
