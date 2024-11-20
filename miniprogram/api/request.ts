import { RequestOption } from "./type";

const BaseUrl = "https://wcshxupboocw.sealosbja.site";

const request = <T>(options: RequestOption): Promise<T> => {
  if (options && options.showLoading) {
    wx.showLoading({
      title: "加载中",
    });
  }
  const { url, data, header } = options;

  return new Promise<T>((resolve, reject) => {
    wx.request({
      url: BaseUrl + url,
      data,
      header,
      success(res) {
        resolve(res.data as T);
      },
      fail(err) {
        if (options && options.showError) {
          wx.showToast({
            title:
              err.errMsg !== null && err.errMsg !== undefined
                ? err.errMsg
                : "系统错误",
            duration: 2000,
          });
        }
        reject(err);
      },
      complete() {
        if (options && options.showLoading) {
          wx.hideLoading();
        }
      },
    });
  });
};

export default request;
