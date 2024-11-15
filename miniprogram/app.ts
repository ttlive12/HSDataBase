import { IAppOption } from "typings";
import { getCardDatas } from "./api/index";

App<IAppOption>({
  globalData: {
    cardDatas: [],
  },
  async onLaunch() {
    const ans = await getCardDatas();
    this.globalData.cardDatas = ans;
  },
});
