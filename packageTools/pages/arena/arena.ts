import { getJJCRank } from '@/api/index';
import { ClassTypes } from '@/api/type';
import { class2Name, class2Img } from '@/constants';
import { toLowerCase } from '@/utils/index';

Page({
  data: {
    classData: [] as { name: string; win_rate: number; img: string; class: ClassTypes }[],
  },

  onLoad() {
    this.fetchArenaData();
  },

  onPullDownRefresh() {
    this.fetchArenaData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async fetchArenaData() {
    const res = await getJJCRank();
    // 数据处理：添加职业中文名和图片
    const classData = res.data.map((item) => {
      const className = toLowerCase(item.class) as ClassTypes;
      return {
        name: class2Name[className],
        class: className,
        win_rate: item.win_rate,
        img: class2Img[className],
      };
    });

    // 按胜率排序
    classData.sort((a, b) => b.win_rate - a.win_rate);

    this.setData({
      classData,
    });
  },

  // 点击职业，跳转到卡牌排名页面
  onClassTap(e: WechatMiniprogram.TouchEvent) {
    const { className } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/packageTools/pages/arenaCards/arenaCards?class=${className}`,
    });
  },
});
