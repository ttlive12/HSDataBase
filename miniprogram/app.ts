import EventBus from "@/utils/eventBus";
import { IAppOption } from "typings";

App<IAppOption>({
  globalData: {
    eventBus: new EventBus()
  },
  async onLaunch() {},
});
