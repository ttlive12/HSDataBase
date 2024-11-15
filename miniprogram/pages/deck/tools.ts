import { ClassTypes } from "@/api/type";
import { IAppOption } from "typings";

export interface IDecksData {
  cards: {
    cost: number
    id: string
    name: string
  }[];
  deckcode: string;
  dust: number;
  games: number;
  id: string;
  name: string;
  winrate: number;
  class: ClassTypes;
  height: number
}

const app = getApp<IAppOption>()

export function getDeckStatsDivs(html: string): string[] {
  const result: string[] = [];
  // Regular expression to match <div> tags with id starting with "deck_stats-"
  const divRegex = /<div[^>]*\bid\s*=\s*(['"])deck_stats-[^'"]*\1[^>]*>/g;
  let match;

  while ((match = divRegex.exec(html)) !== null) {
    const startIndex = match.index;
    let searchIndex = divRegex.lastIndex;

    let depth = 1;
    const divTagRegex = /<\/?div[^>]*>/g;
    divTagRegex.lastIndex = searchIndex;

    let tagMatch;
    let endIndex = -1;

    while ((tagMatch = divTagRegex.exec(html)) !== null) {
      const tag = tagMatch[0];
      if (tag.startsWith("<div")) {
        depth++;
      } else if (tag.startsWith("</div")) {
        depth--;
      }

      if (depth === 0) {
        // Found the matching closing </div>
        endIndex = divTagRegex.lastIndex;
        break;
      }
    }

    if (endIndex !== -1) {
      const divHtml = html.substring(startIndex, endIndex);
      result.push(divHtml);
      // Update the lastIndex of divRegex to continue searching after this div
      divRegex.lastIndex = endIndex;
    } else {
      // No matching closing tag found; break to avoid infinite loop
      break;
    }
  }

  return result;
}

function extractDeckInfo(html: string) {
  const deckcodeMatch = html.match(/phx-value-deckcode="([^"]+)"/);
  const idMatch = html.match(/id="deck_stats-(\d+)"/);
  const nameMatch = html.match(/<a class="basic-black-text"[^>]*>([^<]+)<\/a>/);
  const dustMatch = html.match(/dust-bar-inner">\s*(\d+)/);
  const winrateMatch = html.match(/background-color: [^>]+>\s*<span[^>]*>\s*([\d.]+)/);
  const gamesMatch = html.match(/<div class="column tag">\s*Games: (\d+)/);
  const classMatch = html.match(/class="decklist-info (\w+)"/);
  // Match all potential card containers
  const cardBlocks = html.match(/<div phx-value-card_id="(\d+)">[\s\S]*?<\/div>\s*<\/div>/g);
  const cardIds: string[] = [];

  if (cardBlocks) {
    for (const block of cardBlocks) {
      if (block.includes('has-text-right card-number deck-text decklist-card-background is-unselectable">⋆')) {
        const idMatch = block.match(/phx-value-card_id="(\d+)"/);
        if (idMatch) {
          cardIds.push(idMatch[1]);
        }
      }
    }
  }

  return {
    deckcode: deckcodeMatch ? deckcodeMatch[1] : null,
    id: idMatch ? idMatch[1] : null,
    name: nameMatch ? nameMatch[1] : null,
    cards: cardIds,
    dust: dustMatch ? parseInt(dustMatch[1], 10) : null,
    winrate: winrateMatch ? parseFloat(winrateMatch[1]) : null,
    games: gamesMatch ? parseInt(gamesMatch[1], 10) : null,
    class: classMatch ? classMatch[1] : null
  };
}
function flat<T>(arr: T[], depth: number = 1): T[] {
  let result: T[] = [];

  for (let item of arr) {
    // 如果 item 是数组并且 depth > 0，则递归展平
    if (Array.isArray(item) && depth > 0) {
      result.push(...flat(item as T[], depth - 1));  // 递归展平，深度减 1
    } else {
      result.push(item);  // 如果是非数组项，直接添加到结果
    }
  }

  return result;
}
function arrangeWaterfall(items: IDecksData[]) {
  const columns: [IDecksData[], IDecksData[]] = [[], []];
  const columnHeights = [0, 0];

  items.forEach(item => {
    const shortestColumnIndex = columnHeights[0] <= columnHeights[1] ? 0 : 1;
    columns[shortestColumnIndex].push(item);
    columnHeights[shortestColumnIndex] += item.height;
  });

  const arrangedItems: IDecksData[] = flat(columns) as any
  return arrangedItems;
}

export const parseData = (data: string) => {
  const arr1 = getDeckStatsDivs(data).map(item => extractDeckInfo(item))
  const arr2 = app.globalData.cardDatas;
  const cardMap = arr2.reduce((acc: any, card) => {
    const dbfId = card.dbfId.toString()
    acc[dbfId] = {
      id: card.id,
      name: card.name,
      cost: card.cost,
    };
    return acc;
  }, {});
  const Unsorteddata = arr1.map(deck => ({
    ...deck,
    height: deck.cards.length * 26 + 61.67,
    cards: deck.cards.map(cardId => {
      const dbfId = parseInt(cardId); // 假设cards中的id是dbfId的字符串形式
      return cardMap[dbfId];
    }),
  })) as IDecksData[];
  return arrangeWaterfall(Unsorteddata)
}