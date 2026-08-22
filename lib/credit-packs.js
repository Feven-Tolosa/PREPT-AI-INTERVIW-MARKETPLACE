// Local-currency (ETB) credit packs purchased via the Chapa inline checkout.
//
// Kept separate from lib/data.js so server code can import it without
// pulling in JSX components. Prices are in Ethiopian Birr and are
// re-validated server-side (actions/chapa.js) — never trust client values.

export const CREDIT_PACKS = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 5,
    price: 800, // ETB
    perks: ["5 mock interview sessions", "AI feedback report"],
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 15,
    price: 2200, // ETB — ~27% cheaper per credit
    featured: true,
    perks: ["15 mock interview sessions", "AI feedback report", "Best value"],
  },
];

export function getCreditPack(id) {
  return CREDIT_PACKS.find((p) => p.id === id) ?? null;
}
