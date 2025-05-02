import { ErrorType } from 'wx-request-plus';

// pages/fail/fail.ts
Page({
  reload() {
    wx.reLaunch({
      url: '/pages/home/home',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: Record<string, string>) {
    let message = options.message || '未知错误';
    switch (message) {
      case ErrorType.TIMEOUT:
        message = '请求超时';
        break;
      case ErrorType.NETWORK:
        message = '网络错误';
        break;
      case ErrorType.CANCEL:
        message = '请求取消';
        break;
      case ErrorType.CLIENT:
        message = '服务器错误';
        break;
      case ErrorType.SERVER:
        message = '服务器错误';
        break;
      case ErrorType.OFFLINE:
        message = '离线错误';
        break;
      case ErrorType.UNKNOWN:
        message = '未知错误';
        break;
      default:
        message = '出错了';
    }
    this.setData({ message });
  },
});
