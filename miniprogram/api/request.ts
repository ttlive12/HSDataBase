import { RequestOption } from "./type";

const request = <T>(options: RequestOption): Promise<T> => {
  if (options?.showLoading) {
    wx.showLoading({
      title: "加载中",
    });
  }
  const { url, data, header } = options;
  
  return new Promise<T>((resolve, reject) => {
    wx.request({
      url,
      data,
      header,
      success(res) {
        resolve(res.data as T);
      },
      fail(err) {
        if (options?.showError) {
          wx.showToast({
            title: err.errMsg ?? "系统错误",
            duration: 2000,
          });
        }
        reject(err);
      },
      complete() {
        if (options?.showLoading) {
          wx.hideLoading();
        }
      },
    });
  });
};

export default request;
