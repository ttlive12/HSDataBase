/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as echarts from '../../../../ec-canvas/echarts';

const app = getApp();

function generatePieChartOptions(rankArray, topN = 20) {
  // 排序并获取前N项数据
  const sortedRankArray = rankArray.sort((a, b) => b.popularityPercent - a.popularityPercent);
  const topItems = sortedRankArray.slice(0, topN);

  // 计算前N项的总百分比
  const topPercentSum = topItems.reduce((sum, item) => sum + item.popularityPercent, 0);

  // 准备饼图数据
  const pieData = topItems.map((item) => ({
    name: item.zhName,
    value: item.popularityPercent,
    itemStyle: {
      color: class2Color[item.class],
      borderColor: '#ffffff', // 设置分割线颜色为白色
      borderWidth: 2, // 设置分割线宽度
    },
    popularityNum: item.popularityNum,
  }));

  // 如果总百分比小于100，添加“其他”项
  if (topPercentSum < 100) {
    pieData.push({
      name: '其他',
      value: 100 - topPercentSum,
      itemStyle: {
        color: 'black',
        borderColor: '#ffffff', // 设置分割线颜色为白色
        borderWidth: 2, // 设置分割线宽度
      },
      popularityNum: 0,
    });
  }

  // 生成ECharts选项
  return {
    title: {
      subtext: '卡组分布图', // 标题文本
      left: 'center', // 标题位置
      subtextStyle: {
        color: '#333333', // 副标题字体颜色
        fontSize: 16, // 副标题字体大小
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        if (params.name === '其他') {
          return `${params.name} : ${params.value.toFixed(1)}%`;
        } else {
          return `${params.name} : ${params.value}% (${params.data.popularityNum})`;
        }
      },
    },
    series: [
      {
        name: '流行度',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: pieData,
      },
    ],
  };
}

function generateClassPieChartOptions(rankArray) {
  // 合并相同class的数据
  const classDataMap = {};

  rankArray.forEach((item) => {
    if (!classDataMap[item.class]) {
      classDataMap[item.class] = {
        className: item.class,
        name: class2Zh[item.class],
        totalPercent: 0,
        totalNum: 0,
      };
    }
    classDataMap[item.class].totalPercent += item.popularityPercent;
    classDataMap[item.class].totalNum += item.popularityNum;
  });

  // 准备饼图数据
  const pieData = Object.values(classDataMap).map((item) => ({
    name: item.name,
    value: item.totalPercent,
    itemStyle: {
      color: class2Color[item.className],
      borderColor: '#ffffff', // 设置分割线颜色为白色
      borderWidth: 2, // 设置分割线宽度
    },
    popularityNum: item.totalNum,
  }));

  // 生成ECharts选项
  return {
    title: {
      subtext: '职业分布图', // 标题文本
      left: 'center', // 标题位置
      subtextStyle: {
        color: '#333333', // 副标题字体颜色
        fontSize: 16, // 副标题字体大小
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `${params.name} : ${params.value.toFixed(1)}% (${params.data.popularityNum})`;
      },
    },
    series: [
      {
        name: '流行度',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: pieData.sort((a, b) => b.value - a.value),
      },
    ],
  };
}

Component({
  properties: {
    data: {
      type: Array,
      value: [],
      observer: function (newVal) {
        app.globalData.rankData = newVal;
        this.setData({
          isShow: false,
        });
        wx.nextTick(() => {
          if (newVal.length) {
            this.setData({
              isShow: true,
            });
          }
        });
      },
    },
  },
  data: {
    isShow: false,
    ec: {
      onInit: function (canvas, width, height, dpr) {
        const pieChart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr,
        });
        const data = app.globalData.rankData ? app.globalData.rankData : [];
        canvas.setChart(pieChart);
        pieChart.setOption(generatePieChartOptions(data));
        return pieChart;
      },
    },
    ec2: {
      onInit: function (canvas, width, height, dpr) {
        const pieChart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr,
        });
        const data = app.globalData.rankData ? app.globalData.rankData : [];
        canvas.setChart(pieChart);
        pieChart.setOption(generateClassPieChartOptions(data));
        return pieChart;
      },
    },
  },
});

const class2Color = {
  shaman: '#0070de',
  priest: '#e6e6e6',
  hunter: '#abd473',
  rogue: '#f5eb65',
  warlock: '#9482c9',
  mage: '#69ccf0',
  warrior: '#c79c6e',
  druid: '#ff7d0a',
  paladin: '#f58cba',
  deathknight: '#c41f3b',
  demonhunter: '#a330c9',
};

const class2Zh = {
  shaman: '萨满',
  priest: '牧师',
  hunter: '猎人',
  rogue: '潜行者',
  warlock: '术士',
  mage: '法师',
  warrior: '战士',
  druid: '德鲁伊',
  paladin: '圣骑士',
  deathknight: '死亡骑士',
  demonhunter: '恶魔猎手',
};
