import { Rank } from '@/modal/rankData';

// 计算数组的均值
function mean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

// 计算数组的标准差
function standardDeviation(values: number[], meanValue: number): number {
  if (values.length <= 1) {
    return 0;
  }
  const squaredDiffs = values.map((value) => Math.pow(value - meanValue, 2));
  const avgSquaredDiff = mean(squaredDiffs);
  return Math.sqrt(avgSquaredDiff);
}

// 使用 Z-score 标准化
function zScoreNormalization(values: number[]): number[] {
  const meanValue = mean(values);
  const stdDev = standardDeviation(values, meanValue);
  return values.map((value) => (stdDev === 0 ? 0 : (value - meanValue) / stdDev));
}

// 使用 Min-Max 标准化 (将值缩放到0-1之间)
function minMaxNormalization(values: number[]): number[] {
  if (values.length === 0) {
    return [];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (max === min) {
    return values.map(() => 0.5);
  }

  return values.map((value) => (value - min) / (max - min));
}

// 计算套牌的综合评分
export function computeCompositeScores(
  decks: Rank[],
  winWeight: number = 0.7,
  pickWeight: number = 0.3,
  normalizationMethod: 'zscore' | 'minmax' = 'zscore'
): Rank[] {
  if (decks.length === 0) {
    return [];
  }

  // 提取胜率和出场率数组
  const winRates = decks.map((deck) => deck.winrate);
  const pickRates = decks.map((deck) => deck.popularityPercent);

  // 标准化胜率和出场率
  let winRateNormalized: number[];
  let pickRateNormalized: number[];

  if (normalizationMethod === 'zscore') {
    winRateNormalized = zScoreNormalization(winRates);
    pickRateNormalized = zScoreNormalization(pickRates);
  } else {
    winRateNormalized = minMaxNormalization(winRates);
    pickRateNormalized = minMaxNormalization(pickRates);
  }

  // 计算综合评分
  decks.forEach((deck, index) => {
    const winNormalized = winRateNormalized[index];
    const pickNormalized = pickRateNormalized[index];

    // 综合评分 = 胜率权重 * 胜率标准化值 + 出场率权重 * 出场率标准化值
    const compositeScore = winWeight * winNormalized + pickWeight * pickNormalized;
    deck.compositeScore = compositeScore;
  });

  return decks;
}

// 根据综合评分对套牌进行排序
export function rankDecks(decks: Rank[]): Rank[] {
  // 按综合评分降序排列
  return [...decks].sort((a, b) => (b.compositeScore || 0) - (a.compositeScore || 0));
}

// 根据指定属性对套牌进行排序
export function sortDecksByProperty(
  decks: Rank[],
  property: keyof Rank,
  ascending: boolean = false
): Rank[] {
  return [...decks].sort((a, b) => {
    const valueA = a[property] as number;
    const valueB = b[property] as number;

    return ascending ? valueA - valueB : valueB - valueA;
  });
}

// 根据职业筛选套牌
export function filterDecksByClass(decks: Rank[], classType?: string): Rank[] {
  if (!classType) {
    return decks;
  }

  return decks.filter((deck) => deck.class === classType);
}

// 计算职业分布
export function calculateClassDistribution(decks: Rank[]): Record<string, number> {
  const distribution: Record<string, number> = {};

  decks.forEach((deck) => {
    if (!distribution[deck.class]) {
      distribution[deck.class] = 0;
    }
    distribution[deck.class]++;
  });

  return distribution;
}
