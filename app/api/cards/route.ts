// import { NextResponse } from "next/server";

// const BASE_URL = "https://apitcg.com/api/one-piece";
// const API_KEY = process.env.APITCG_KEY ?? "";

// let cachedCards: unknown[] = [];
// let cacheTime = 0;
// const CACHE_DURATION = 1000 * 60 * 60;

// async function fetchPage(page: number): Promise<{ data: unknown[]; totalPages: number }> {
//   for (let attempt = 0; attempt < 5; attempt++) {
//     const res = await fetch(`${BASE_URL}/cards?page=${page}&limit=100`, {
//       headers: { "x-api-key": API_KEY },
//     });
//     if (res.ok) {
//       const data = await res.json();
//       return { data: data.data ?? [], totalPages: data.totalPages ?? 1 };
//     }
//     if (res.status === 504) {
//       console.log(`504 on page ${page}, attempt ${attempt + 1}, retrying in ${(attempt + 1) * 2}s...`);
//       await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
//       continue;
//     }
//     throw new Error(`API error: ${res.status}`);
//   }
//   throw new Error(`Failed to fetch page ${page} after 5 attempts`);
// }
// console.log("API Key present:", !!API_KEY, "Length:", API_KEY.length);
// export async function GET() {
//   try {
//     if (cachedCards.length > 0 && Date.now() - cacheTime < CACHE_DURATION) {
//       console.log(`✅ Returning ${cachedCards.length} cached cards`);
//       return NextResponse.json(cachedCards);
//     }

//     let page = 1;
//     let totalPages = 1;
//     const allCards: unknown[] = [];

//     while (page <= totalPages) {
//       const { data, totalPages: tp } = await fetchPage(page);
//       allCards.push(...data);
//       totalPages = tp;
//       console.log(`Page ${page}/${totalPages} — total so far: ${allCards.length}`);
//       page++;
//     }

//     console.log(`✅ Total cards fetched: ${allCards.length}`);
//     cachedCards = allCards;
//     cacheTime = Date.now();

//     return NextResponse.json(allCards);
//   } catch (err) {
//     if (cachedCards.length > 0) {
//       console.log("⚠️ Returning stale cache");
//       return NextResponse.json(cachedCards);
//     }
//     console.error(err);
//     return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
//   }
// }


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

//COMBINE

// import { NextResponse } from "next/server";

// const APITCG_URL = "https://apitcg.com/api/one-piece";
// const OPTCG_URL = "https://optcgapi.com/api";
// const API_KEY = process.env.APITCG_KEY ?? "";

// let cachedCards: unknown[] = [];
// let cacheTime = 0;
// const CACHE_DURATION = 1000 * 60 * 60;

// function normalizeOptcgCard(card: any) {
//   return {
//     id: card.card_set_id,
//     code: card.card_set_id,
//     name: card.card_name,
//     rarity: card.rarity,
//     type: card.card_type?.toUpperCase(),
//     color: card.card_color,
//     cost: card.card_cost ? Number(card.card_cost) : null,
//     power: card.card_power ? Number(card.card_power) : null,
//     counter: card.counter_amount,
//     ability: card.card_text,
//     trigger: card.trigger,
//     family: card.sub_types,
//     attribute: card.attribute ? { name: card.attribute, image: "" } : null,
//     set: { name: `${card.set_name} [${card.set_id}]` },
//     images: {
//       small: card.card_image ?? "",
//       large: card.card_image ?? "",
//     },
//   };
// }

// async function fetchFromApitcg(): Promise<unknown[]> {
//   let page = 1;
//   let totalPages = 1;
//   const allCards: unknown[] = [];

//   while (page <= totalPages) {
//     const res = await fetch(`${APITCG_URL}/cards?page=${page}&limit=100`, {
//       headers: { "x-api-key": API_KEY },
//       signal: AbortSignal.timeout(8000),
//     });
//     if (!res.ok) throw new Error(`apitcg error: ${res.status}`);
//     const data = await res.json();
//     allCards.push(...(data.data ?? []));
//     totalPages = data.totalPages ?? 1;
//     console.log(`apitcg page ${page}/${totalPages}`);
//     page++;
//   }
//   return allCards;
// }

// async function fetchFromOptcgapi(): Promise<unknown[]> {
//   console.log("⚠️ Using optcgapi...");
//   const [setCards, stCards] = await Promise.all([
//     fetch(`${OPTCG_URL}/allSetCards/`).then(r => r.json()),
//     fetch(`${OPTCG_URL}/allSTCards/`).then(r => r.json()),
//   ]);
//   return [...(setCards ?? []), ...(stCards ?? [])].map(normalizeOptcgCard);
// }

// export async function GET() {
//   try {
//     if (cachedCards.length > 0 && Date.now() - cacheTime < CACHE_DURATION) {
//       console.log(`✅ Returning ${cachedCards.length} cached cards`);
//       return NextResponse.json(cachedCards);
//     }

//     let allCards: unknown[] = [];

//     try {
//       allCards = await fetchFromApitcg();
//       console.log(`✅ apitcg: ${allCards.length} cards`);
//     } catch (err) {
//       console.error("apitcg failed, falling back to optcgapi:", err);
//       allCards = await fetchFromOptcgapi();
//       console.log(`✅ optcgapi: ${allCards.length} cards`);
//     }

//     cachedCards = allCards;
//     cacheTime = Date.now();

//     return NextResponse.json(allCards);
//   } catch (err) {
//     if (cachedCards.length > 0) {
//       console.log("⚠️ Returning stale cache");
//       return NextResponse.json(cachedCards);
//     }
//     console.error(err);
//     return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
//   }
// }