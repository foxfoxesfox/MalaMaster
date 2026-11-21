# MalaMaster

Practice picking mala xiang guo so you stop over-ordering. Drag ingredients from the stall's trays into your basket and watch the grams and S$ add up.

- **Practice:** free picking with a budget. Switch between tiered pricing (each ingredient type has its own rate) and a flat rate.
- **Orders:** five customers, each wanting a set weight under a budget, sometimes with a rule like "no meat". The scale is hidden until you serve. Within 5% of the target scores full marks.
- **Top 10:** a shared board with no accounts. You're only asked for a name when your round makes the top 10.

Prices are averages of listed Singapore stall prices, per 100g: veg S$1.35, mushrooms S$2.10, tofu & balls S$2.60, meat S$2.95, premium S$3.60, flat S$2.60. Piece weights are estimates. Both live in `src/data.js`.

## Run it

```bash
npm install
npm run dev
```

The leaderboard needs `.env.local` (see `.env.example`) with the Supabase project URL and its publishable key. Without it, the Top 10 tab says it isn't connected and the rest of the game still works.

```bash
npm test        # pricing and scoring self-check
npm run build   # static site in dist/
```

## Deploy

`npm run build` and upload `dist/` to the subdomain (for example mala.foxesvx.dev). Set the two `VITE_SUPABASE_*` variables in the host's build settings. The database schema is in `supabase/migrations/`.
