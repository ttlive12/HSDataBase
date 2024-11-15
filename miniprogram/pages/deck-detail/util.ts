import { IAppOption } from "typings";

const app = getApp<IAppOption>();

export interface CardInfo {
  dbfid: string;
  mulliganImpact: string;
  drawnImpact: string;
  keptImpact: string;
}

export interface CardInfoShow {
  id: string;
  cost: number;
  name: string;
  rarity: string;
  mulliganImpact: string;
  drawnImpact: string;
  keptImpact: string;
  mulliganImpactColor: string;
  drawnImpactColor: string;
  keptImpactColor: string;
}

export function parseHtml(htmlString: string): CardInfo[] {
  const result = [];
  const trMatches = htmlString.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g);
  if (trMatches) {
    for (const tr of trMatches) {
      const tdMatches = tr.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
      if (!tdMatches || tdMatches.length < 4) {
        continue;
      }
      let dbfid = "";
      let mulliganImpact = "";
      let drawnImpact = "";
      let keptImpact = "";
      const dbfidTd = tdMatches[0];
      const dbfidMatch = dbfidTd.match(/href="\/card\/(\d+)"/);
      if (dbfidMatch && dbfidMatch[1]) {
        dbfid = dbfidMatch[1];
      } else {
        continue;
      }
      const mulliganTd = tdMatches[1];
      const mulliganMatch = mulliganTd.match(
        /<span[^>]*class="basic-black-text"[^>]*>([\s\S]*?)<\/span>/
      );
      if (mulliganMatch && mulliganMatch[1]) {
        mulliganImpact = mulliganMatch[1].trim();
      }
      const drawnTd = tdMatches[2];
      const drawnMatch = drawnTd.match(
        /<span[^>]*class="basic-black-text"[^>]*>([\s\S]*?)<\/span>/
      );
      if (drawnMatch && drawnMatch[1]) {
        drawnImpact = drawnMatch[1].trim();
      }
      const keptTd = tdMatches[3];
      const keptMatch = keptTd.match(
        /<span[^>]*class="basic-black-text"[^>]*>([\s\S]*?)<\/span>/
      );
      if (keptMatch && keptMatch[1]) {
        keptImpact = keptMatch[1].trim();
      }
      result.push({
        dbfid,
        mulliganImpact,
        drawnImpact,
        keptImpact,
      });
    }
  }
  return result;
}

export function combineCardData(impactsArray: CardInfo[]): CardInfoShow[] {
  const cardMap: { [dbfId: string]: any } = {};
  const cardsArray = app.globalData.cardDatas;
  for (const card of cardsArray) {
    cardMap[card.dbfId.toString()] = card;
  }

  const result = [];

  for (const impact of impactsArray) {
    const dbfid = impact.dbfid;
    const card = cardMap[dbfid];
    if (card) {
      result.push({
        id: card.id,
        cost: card.cost,
        name: card.name,
        rarity: card.rarity,
        mulliganImpact: impact.mulliganImpact,
        drawnImpact: impact.drawnImpact,
        keptImpact: impact.keptImpact,
        mulliganImpactColor: getColor(Number(impact.mulliganImpact)),
        drawnImpactColor: getColor(Number(impact.drawnImpact)),
        keptImpactColor: getColor(Number(impact.keptImpact)),
      });
    } else {
      console.warn(`Card with dbfId ${dbfid} not found.`);
    }
  }

  return result;
}

function getColor(value: number): string {
  if (value <= -20) {
    return "rgb(255, 0, 0)"; // 红色
  } else if (value >= 20) {
    return "rgb(0, 255, 0)"; // 绿色
  } else {
    // 计算红色和绿色分量的比例
    const ratio = (value + 20) / 40; // 将值从[-20, 20]映射到[0, 1]
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(255 * ratio);
    return `rgb(${red}, ${green}, 0)`;
  }
}
