/// <reference path="./types/index.d.ts" />

import { CardData } from "@/api/type";

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo;
    cardDatas: CardData[];
  };
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
}
