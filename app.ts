import { IAppOption } from 'typings';

import EventBus from '@/utils/eventBus';

App<IAppOption>({
  globalData: {
    eventBus: new EventBus(),
  },
  async onLaunch() {
    // 检查小程序版本更新
    // 版本更新检查
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      // 检查是否有新版本
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          // 有新版本
          console.info('发现新版本，正在下载...');
        }
      });

      // 新版本下载完成
      updateManager.onUpdateReady(() => {
        // 提示用户是否更新
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              // 用户确认更新，应用新版本并重启
              updateManager.applyUpdate();
            }
          },
        });
      });

      // 新版本下载失败
      updateManager.onUpdateFailed(() => {
        console.error('新版本下载失败，请检查网络后重试');
      });
    }
  },
});
