import { IAppOption } from 'typings';

import EventBus from '@/utils/eventBus';

App<IAppOption>({
  globalData: {
    eventBus: new EventBus(),
  },
  async onLaunch() {},
});
