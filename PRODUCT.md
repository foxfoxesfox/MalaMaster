# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React (the user picked "Vite + framework"; React was my choice as the most common pairing). Hosted as a static build on a subdomain of the user's own site (planned: mala.foxesvx.dev). Shared leaderboard on Supabase (no accounts).

## Users

The user and their friends: people who eat mala xiang guo often at self-serve stalls, where you scoop ingredients into a bowl and pay by weight. They tend to over-scoop and get a surprise at the till. They play MalaMaster on their phones to train their eye and hand for weight and cost.

## Product Purpose

A practice simulator for picking mala ingredients. You build a bowl piece by piece and see weight and price add up, so you learn what a S$10 bowl actually looks like before you are standing at the stall. Success: players can hit a target weight or budget within a few percent without looking at the running total.

## Positioning

Built around how real stalls price a bowl: per-100g rates by ingredient tier, or one flat rate, averaged from real Singapore stall prices. Each ingredient has a realistic piece weight.

## Operating Context

- Self-serve mala stalls: tongs, a basket or bowl, ingredients in trays grouped by type, weighed and priced at the counter.
- Two pricing models exist in the wild and both are supported: **tiered** (vegetables / mushrooms / tofu & balls / meat / premium each have their own per-100g price) and **flat** (one per-100g price for everything).
- Played on phones as a quick casual game, often shared between friends.

## Capabilities and Constraints

- **Practice mode:** free picking, a budget you set, pricing mode toggle (tiered or flat).
- **Orders mode:** customers ask for a target (weight, budget, sometimes "no beef" style rules, a given pricing model). The player builds the bowl, then is scored on how close they get.
- **Leaderboard:** shared online, no accounts. Only the top 10 are kept. A player is asked for a name only when their score makes the top 10. Scores are submitted from the client, so a determined friend could cheat; accepted for a friends-only game.
- Default per-100g prices (Singapore, averaged from listed stall prices): vegetables S$1.35, mushrooms S$2.10, tofu & balls S$2.60, meat S$2.95, premium S$3.60; flat S$2.60. Some source listings are a year or more old.
- Piece weights are estimates (no source publishes them) and live in one editable data file.
- Currency is S$ for now.

## Evidence on Hand

- Price sources: Lao Wang Mala, Jia Xiang Mala Hotpot, Ding Ding Hong, Jin Jin Eating House, Ju Bao Xuan, Spicy Garden, Fu Yuan, Zhang Liang (via Seth Lui, foodpanda, HungryGoWhere, MoneyBees, Miss Lobang).
- No real player data, testimonials or photos exist. Do not invent any.

## Product Principles

1. Real numbers first: prices and weights must stay believable to someone who eats mala every week.
2. Running totals teach: weight and cost respond instantly to every scoop.
3. Fast to play one-handed on a phone, in a queue.
4. Friendly competition, not grind: short rounds, a small top-10 board, no accounts.
