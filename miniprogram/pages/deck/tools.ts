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

export function parseDeckStatsHtml(
  html: string
): {
  deckcode: string;
  id: string;
  name: string;
  cards: { dbfId: string; num: number }[];
  dust: string;
  winrate: string;
  games: string;
} {
  // Extract deckcode
  const deckcodeMatch = html.match(/phx-value-deckcode="([^"]*)"/);
  const deckcode = deckcodeMatch ? deckcodeMatch[1] : "";

  // Extract id
  const idMatch = html.match(/id="deck_stats-([0-9]+)"/);
  const id = idMatch ? idMatch[1] : "";

  // Extract name
  const nameMatch = html.match(
    /<h2 class="deck-title">[\s\S]*?<a[^>]*>([^<]*)<\/a>/
  );
  const name = nameMatch ? nameMatch[1].trim() : "";

  // Extract cards
  const cards: { dbfId: string; num: number }[] = [];
  const cardRegex = /(<div[^>]*phx-value-card_id="([^"]+)"[^>]*>[\s\S]*?<\/a>\s*<\/div>)/g;
  let cardMatch;
  while ((cardMatch = cardRegex.exec(html)) !== null) {
    const cardHtml = cardMatch[1];
    const dbfId = cardMatch[2];

    const numMatch = cardHtml.match(
      /<span[^>]*class="has-text-right card-number [^"]*"[^>]*>([^<]*)<\/span>/
    );
    const numString = numMatch ? numMatch[1].trim() : "";
    const num = numString === "2" ? 2 : 1;

    cards.push({ dbfId: dbfId, num: num });
  }

  // Extract dust
  const dustMatch = html.match(/<div\s+class="dust-bar-inner">\s*([^<]*)/);
  const dust = dustMatch ? dustMatch[1].trim() : "";

  // Extract winrate
  const winrateMatch = html.match(
    /<span\s+class="tag column"[^>]*>\s*<span[^>]*class="basic-black-text">\s*([^<]*)/
  );
  const winrate = winrateMatch ? winrateMatch[1].trim() : "";

  // Extract games
  const gamesMatch = html.match(
    /<div\s+class="column tag">\s*Games:\s*([^<]*)<\/div>/
  );
  const games = gamesMatch ? gamesMatch[1].trim() : "";

  return {
    deckcode: deckcode,
    id: id,
    name: name,
    cards: cards,
    dust: dust,
    winrate: winrate,
    games: games,
  };
}
