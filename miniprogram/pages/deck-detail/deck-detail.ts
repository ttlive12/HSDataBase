import { getDeckDetails } from "@/api/index";
import { rankType } from "@/api/type";
import { OpponentInfo } from "@/modal/deckDetails";
import { Deck } from "@/modal/decksData";
import { class2Img } from "@/constants";
// @ts-ignore
import Dialog from "@vant/weapp/dialog/dialog";

interface VisitInfo {
  lastVisitDate: string; // 上次访问日期
  visitCount: number; // 今日访问次数
  blockTimestamp?: number; // 控制弹窗显示的时间戳，若在该时间之前，则不显示广告
}

let videoAd: WechatMiniprogram.RewardedVideoAd;

Page({
  data: {
    deckData: {} as Deck,
    deckDetails: {} as Record<rankType, OpponentInfo[]>,
    id: "",
    currentType: "top_legend" as rankType,
    class2Img,
    showCardImg: false,
    cardId: "",
  },
  async onLoad(options: Record<string, string>) {
    const rankBar = this.selectComponent("#rankBar");
    if (rankBar) {
      rankBar.setCurrentType(options.currentType);
    }
    const deckData = wx.getStorageSync<Deck>("deckData");
    const deckDetails = await getDeckDetails(Number(deckData.deckId));
    this.setData({
      deckData,
      deckDetails: enhanceOpponentInfo(deckDetails.data),
      currentType: options.currentType as rankType,
    });

    // 广告逻辑
    this.checkPageVisitAndShowDialog();
  },
  showCardImg(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    this.setData({ showCardImg: true, cardId: id });
  },
  onCloseImg() {
    this.setData({ showCardImg: false });
  },
  handleRankChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({
      currentType: e.detail.currentType,
    });
  },
  handleCopy() {
    wx.reportEvent("copy_code", {});
    const { deckcode, zhName } = this.data.deckData;
    wx.setClipboardData({
      data: `###${zhName}\n${deckcode}`,
      success: () => {
        wx.showToast({
          title: "复制成功",
          icon: "success",
        });
      },
      fail: () => {
        wx.showToast({
          title: "复制失败",
          icon: "none",
        });
      },
    });
  },
  // 检查访问记录并决定是否弹出广告
  checkPageVisitAndShowDialog: function () {
    const today = new Date().toISOString().split("T")[0]; // 获取当前日期，格式：yyyy-mm-dd
    const storageKey = "pageVisitInfo"; // 存储的 key
    let visitInfo: VisitInfo =
      wx.getStorageSync(storageKey) || ({} as VisitInfo);

    const { lastVisitDate, visitCount, blockTimestamp } = visitInfo;
    const currentTime = new Date().getTime();

    // 如果是同一天的访问，增加访问次数
    if (lastVisitDate === today) {
      visitInfo.visitCount = visitCount + 1;
    } else {
      // 如果是新的一天，重置访问次数
      visitInfo = {
        lastVisitDate: today,
        visitCount: 1,
        blockTimestamp: visitInfo.blockTimestamp, // 保留之前的blockTimestamp
      };
    }

    // 更新缓存
    wx.setStorageSync(storageKey, visitInfo);

    // 如果当前时间在拒绝或广告观看的时间窗口内，则不弹出广告
    if (blockTimestamp && currentTime < blockTimestamp) {
      return;
    }

    // 如果访问次数达到10次且需要弹出广告提示
    if (visitInfo.visitCount >= 10) {
      this.showAdDialog(visitInfo, currentTime);
    }
  },

  // 展示广告弹窗
  showAdDialog: function (visitInfo: VisitInfo, currentTime: number) {
    const fifthMinutesInMs = 5 * 60 * 1000; // 五分钟
    const thirtyMinutesInMs = 30 * 60 * 1000; // 半小时
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 三天
    const visitCount = visitInfo.visitCount;
    wx.reportEvent("ad_modal_mv", {
      page_nums: visitCount,
    });
    Dialog.confirm({
      message: `今天您已经查看了 ${visitCount} 个卡组了，看个广告支持一下吧~`,
      confirmButtonText: "好的",
      cancelButtonText: "残忍拒绝",
      cancelButtonColor: "#EE0A24",
      confirmButtonColor: "#000000",
    })
      .then(() => {
        // 用户点击了“好的”，展示广告
        if (wx.createRewardedVideoAd) {
          videoAd = wx.createRewardedVideoAd({
            adUnitId: "adunit-28756f75721e4cf2",
          });
          videoAd.onError((err) => {
            console.error("激励视频加载失败", err);
          });
          videoAd.onClose((res) => {
            if (res && res.isEnded) {
              // 完整观看广告，设置三天内不弹出广告
              wx.reportEvent("ad_full_watch", {
                page_nums: visitCount,
              });
              wx.showToast({
                icon: "none",
                title: "已清理三天内弹窗，感谢支持~",
              });
              visitInfo.blockTimestamp = currentTime + threeDaysInMs; // 完整观看广告，三天内不弹出广告
            } else {
              // 未完整观看广告，设置半小时内不弹出广告
              wx.showToast({
                icon: "none",
                title: "感谢支持~",
              });
              visitInfo.blockTimestamp = currentTime + thirtyMinutesInMs; // 半小时内不弹出广告
            }
            wx.setStorageSync("pageVisitInfo", visitInfo);
          });

          videoAd.show().catch(() => {
            // 失败重试
            videoAd
              .load()
              .then(() => videoAd.show())
              .catch((err) => {
                console.error("激励视频广告显示失败", err);
              });
          });
        }
      })
      .catch(() => {
        // 用户点击了“残忍拒绝”按钮
        wx.reportEvent("ad_refuse", {
          page_nums: visitCount,
        });
        visitInfo.blockTimestamp = currentTime + fifthMinutesInMs; // 五分钟内不再弹出广告
        wx.setStorageSync("pageVisitInfo", visitInfo);
      });
  },
  onShareAppMessage() {},
  onShareTimeline() {},
});

function getColor(valueParam: number) {
  const value = valueParam - 50;
  if (value <= -20) {
    return "rgb(255, 0, 0)";
  } else if (value >= 20) {
    return "rgb(0, 200, 0)";
  } else {
    const ratio = (value + 20) / 40;
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(200 * ratio);
    return `rgb(${red}, ${green}, 0)`;
  }
}

function enhanceOpponentInfo(
  opponents: Record<rankType, OpponentInfo[]>
): Record<rankType, (OpponentInfo & { color: string })[]> {
  const enhanced: Record<rankType, (OpponentInfo & { color: string })[]> = {
    diamond_4to1: [],
    diamond_to_legend: [],
    top_10k: [],
    top_legend: [],
  };

  for (const rank of Object.keys(opponents) as rankType[]) {
    enhanced[rank] = opponents[rank].map((opponent) => ({
      ...opponent,
      color: getColor(opponent.winrate),
    }));
  }

  return enhanced;
}
