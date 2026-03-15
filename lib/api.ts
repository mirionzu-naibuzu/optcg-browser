// import { Card, CardSet } from "@/types/card";

// export async function getAllCards(): Promise<Card[]> {
//   const res = await fetch("/api/cards");
//   if (!res.ok) return []; // return empty instead of throwing
//   return res.json();
// }


// export async function getAllSets(): Promise<CardSet[]> {
//   const res = await fetch("https://optcgapi.com/api/allSets/", {
//     next: { revalidate: 86400 },
//   });
//   if (!res.ok) throw new Error("Failed to fetch sets");
//   return res.json();
// }

import { Card, CardSet } from "@/types/card";

export async function getAllCards(): Promise<Card[]> {
  const res = await fetch("/api/cards");
  if (!res.ok) return []; // return empty instead of throwing
  return res.json();
}

export async function getAllSets(): Promise<CardSet[]> {
  const res = await fetch("https://optcgapi.com/api/allSets/", {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Failed to fetch sets");
  return res.json();
}