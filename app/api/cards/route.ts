import { NextResponse } from "next/server";

const OPTCG_URL = "https://optcgapi.com/api";

let cachedCards: unknown[] = [];
let cacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 60;

function normalizeOptcgCard(card: any) {
  return {
    id: card.card_set_id,
    code: card.card_set_id,
    name: card.card_name,
    rarity: card.rarity,
    type: card.card_type?.toUpperCase(),
    color: card.card_color,
    cost: card.card_cost ? Number(card.card_cost) : null,
    power: card.card_power ? Number(card.card_power) : null,
    counter: card.counter_amount,
    ability: card.card_text,
    trigger: card.trigger,
    family: card.sub_types,
    attribute: card.attribute ? { name: card.attribute, image: "" } : null,
    set: { name: `${card.set_name} [${card.set_id}]` },
    images: {
      small: card.card_image ?? "",
      large: card.card_image ?? "",
    },
  };
}

export async function GET() {
  try {
    if (cachedCards.length > 0 && Date.now() - cacheTime < CACHE_DURATION) {
      console.log(`✅ Returning ${cachedCards.length} cached cards`);
      return NextResponse.json(cachedCards);
    }

    const [setCards, stCards] = await Promise.all([
      fetch(`${OPTCG_URL}/allSetCards/`).then(r => r.json()),
      fetch(`${OPTCG_URL}/allSTCards/`).then(r => r.json()),
    ]);

    const allCards = [...(setCards ?? []), ...(stCards ?? [])].map(normalizeOptcgCard);
    console.log(`✅ Total cards: ${allCards.length}`);

    cachedCards = allCards;
    cacheTime = Date.now();

    return NextResponse.json(allCards);
  } catch (err) {
    if (cachedCards.length > 0) {
      console.log("⚠️ Returning stale cache");
      return NextResponse.json(cachedCards);
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
  }
}