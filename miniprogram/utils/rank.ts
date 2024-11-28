import { Rank } from "@/modal/rankData";

// 计算数组的均值
function mean(values: number[]): number {
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

// 计算数组的标准差
function standardDeviation(values: number[], meanValue: number): number {
  const squaredDiffs = values.map((value) => Math.pow(value - meanValue, 2));
  const avgSquaredDiff = mean(squaredDiffs);
  return Math.sqrt(avgSquaredDiff);
}

// 使用 Z-score 标准化
function zScoreNormalization(values: number[]): number[] {
  const meanValue = mean(values);
  const stdDev = standardDeviation(values, meanValue);
  return values.map((value) =>
    stdDev === 0 ? 0 : (value - meanValue) / stdDev
  );
}

// 计算套牌的综合评分
export function computeCompositeScores(
  decks: Rank[],
  winWeight: number,
  pickWeight: number
): Rank[] {
  // 提取胜率和出场率数组
  const winRates = decks.map((deck) => deck.winrate);
  const pickRates = decks.map((deck) => deck.popularityPercent);

  // 标准化胜率和出场率
  const winRateZScores = zScoreNormalization(winRates);
  const pickRateZScores = zScoreNormalization(pickRates);

  // 计算综合评分
  decks.forEach((deck, index) => {
    const winZScore = winRateZScores[index];
    const pickZScore = pickRateZScores[index];

    // 综合评分 = 胜率权重 * 胜率Z-score + 出场率权重 * 出场率Z-score
    const compositeScore = winWeight * winZScore + pickWeight * pickZScore;
    deck.compositeScore = compositeScore;
  });

  return decks;
}

// 根据综合评分对套牌进行排序
export function rankDecks(decks: Rank[]): Rank[] {
  // 按综合评分降序排列
  return [...decks].sort(
    (a, b) => (b.compositeScore || 0) - (a.compositeScore || 0)
  );
}
