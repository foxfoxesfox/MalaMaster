# MalaMaster

Practice picking mala xiang guo so you stop over-ordering. A 3D stall with one long stepped shelf of every ingredient, grouped into sections with hanging price signs; swipe along it (or tap a section on the shelf map) to walk the aisle, and your basket comes with you. grab ingredients from the steel bins with the tongs, drop them in the basket on the scale, and check out to print a receipt. Tap a bin to drop one piece straight in; grab a piece in the basket to put it back.

- **Practice:** free picking with a budget. Switch between tiered pricing (each ingredient type has its own rate) and a flat rate.
- **Orders:** a 60-second shift of online-style orders. Each customer orders 3 to 5 items with a weight for each (like "Enoki 100g, Lotus root 60g, Luncheon meat 80g"), sized to a sensible handful and rounded to 10g. Ordered items light up on the shelf and the shelf map counts them per section. The scale is hidden until you serve; then it weighs the bowl in about a second, you see your points, and the next customer steps up (the clock pauses during the weigh-in).
  - Points per bowl: +10 for serving it, plus accuracy, plus a streak bonus (+10, +20, +30… for each bowl in a row at 90% or better). Accuracy is scored line by line: an item within 10% of its weight is 100 (pieces don't come in exact grams), losing 2 per extra 1% off; the lines are averaged by weight, then anything not on the order costs 1 per 1% of the order's weight.
  - The shift ends with a printed shift receipt listing every bowl.
- **Top 10:** a shared board with no accounts. You're only asked for a name when your shift makes the top 10.

3D code: `src/Stall3D.jsx` (scene, tongs, dragging), `src/pieces.jsx` (ingredient models made from simple shapes, no external art), `src/Receipt.jsx` (the receipt printer).

Prices are averages of listed Singapore stall prices, per 100g: veg S$1.35, mushrooms S$2.10, tofu & balls S$2.60, meat S$2.95, premium S$3.60, flat S$2.60. Piece weights are estimates. Both live in `src/data.js`.

Some stalls charge rice (S$0.50) and noodles (S$1.00 each, an estimate) at a fixed price; those are taken out before weighing. In Practice, a "Noodles S$1.00 each" switch and counters for rice and scrambled egg (S$1.50) sit in the header. Some Orders customers come from per-pack noodle stalls or want one or two rice or eggs.

Each grab of the tongs gets its own weight: a typical weight plus a per-ingredient spread (leaves and handfuls vary up to about ±30%, factory-made items like noodle blocks and crab sticks only a few percent). The scale and receipt add up the real grabs.

**Ingredients.** The baseline is A Hot Hideout's line-up as named in reviews ([Eatbook](https://eatbook.sg/a-hot-hideout/), [Seth Lui](https://sethlui.com/a-hot-hideout-singapore/), [Hui Xin](https://huixintravelbites.blogspot.com/2024/10/places-to-eat-in-Singapore-chinese-food-a-hot-hideout-mala-xiang-guo.html)): lotus root, potato, cabbage, spinach, enoki, tofu skin, cheese tofu, luncheon meat, pork belly, sausage, chicken, prawn, cuttlefish, dory fish, rice cake, instant, spinach and purple sweet potato noodles, plus a S$1.50 scrambled egg add-on. These are marked `hh: true` in `src/data.js` and come first in each tray. Everything else (bok choy, beef, crab stick, fish balls and so on) is an additional common Singapore stall ingredient. Beef sits with seafood in the dearest tier because stalls price them together (for example meat at S$2.20 vs "premium beef, duck and seafood" at S$3.80 per 100g, [HungryGoWhere](https://hungrygowhere.com/what-to-eat/affordable-mala-xiang-guo/)). Note A Hot Hideout itself charges one flat rate for everything (S$2.28 at its first outlet, about S$2.88 to S$3.25 per 100g now); the app's flat rate is the S$2.60 average across stalls.

Where the numbers come from:
- Enoki goes in as a whole bundle, the way stalls pack it. Supermarket packs are 100–300g ([Cold Storage](https://coldstorage.com.sg/product/mushroom-enoki-taiwan-200g), [FairPrice](https://omni.fairprice.com.sg/product/pasar-enoki-mushroom-300g-13092609)); the app uses 100g. Change `g` in `src/data.js` if your stall uses bigger bundles.
- Crab sticks are 14–18g each on brand labels; quail eggs are about 10g ([Clemson](https://hgic.clemson.edu/quail-eggs/)); an instant noodle pack is 70–79g with its sachet ([Tesco](https://www.tesco.com/groceries/en-GB/products/266026165)), so ~65g for the block.
- Everything else is an estimate. No source publishes per-piece weights for lotus slices, fish balls, tau pok and the like.

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
