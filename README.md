# JINX KISS — Social Party Gaming Platform

> **Good friends. Bad decisions.**

A modern, minimalist neon-dark social party game website where friends, couples, and groups can play interactive card games together on a single shared screen or across devices.

Live Website: **jinxkiss.com**

---

## 🎮 The Twelve Playable Games

| Game | Theme Color | Description & Mechanics |
|---|---|---|
| **Truth or Dare** | Neon Pink (`#FF4DA6`) | Choose Truth or Dare, animated card reveal, player turn rotation, next, skip, and restart. |
| **Never Have I Ever** | Electric Purple (`#A855F7`) | Random statements, animated "I Have" & "I Haven't" buttons, and optional group 5-finger/life tracking. |
| **Would You Rather** | Cyan Blue (`#06B6D4`) | Two choices on glowing cards, voting, and live revealed voting percentages. |
| **Hot Takes** | Fiery Orange (`#F97316`) | Controversial opinions, Agree/Disagree voting, vote breakdown, and debate discussion prompts. |
| **Dare Roulette** | Crimson Red (`#EF4444`) | Custom player names, Canvas roulette wheel with realistic acceleration and deceleration physics, fair random selector, and custom dares. |
| **Red Flag Green Flag** | Red & Green (`#10B981` / `#EF4444`) | Dating & friendship situations, Red Flag / Green Flag / It Depends voting with color-coded results. |
| **Truth or Sip** | Golden Amber (`#F59E0B`) | Juicy confessions or take a sip. Golden amber styling, non-alcoholic drink toggle, and "Truth or Snack" in Kids mode. |
| **Point and Drink** | Neon Magenta (`#EC4899`) | "Who is most likely to..." prompts, 3-2-1 countdown ("POINT!"), finger voting tallies, and "Point and Vote" in Kids mode. |
| **Most Likely To** | Rose | Group votes on specific, surprising scenarios. |
| **Confessions** | Violet | Anonymous stories followed by guessing who wrote each one. |
| **Hot Seat** | Rose | One player answers pointed questions under the clock. |
| **Chaos Mix** | Magenta | Rounds combine the source games while preserving their card mechanics. |

---

## 🌟 Game Categories

- **Easy**: Casual, lighthearted, funny icebreakers.
- **Medium**: More personal, challenging, and embarrassing questions.
- **Extreme**: Bold, intense dares and dilemmas.
- **Unhinged**: Adults-only player roasts, dark humor, messy confessions, and brutal social choices.
- **Couples**: Romantic, intimate, and relationship-oriented questions.
- **18+**: Adults-only uncensored prompts (**requires age verification modal confirmation**).
- **Spicy**: Flirty, magnetic, and provocative challenges.
- **Kids**: Family-friendly, completely wholesome, with alcohol mechanics replaced with fun forfeits.

---

## 🔐 Optional User Accounts & Authentication

- **Guest Mode**: Anyone can open Jinx Kiss and play all 12 games, select categories, spin the roulette wheel, add party players, vote, and play public community decks with zero registration.
- **Username-Only Authentication**:
  - Requires only **Username** and **Password** (min 4 characters).
  - **No email address required**.
  - Case-insensitive unique usernames.
  - Salted PBKDF2/scrypt password hashing with unique salts.
  - Persistent login across sessions.
  - Clear error feedback and weak password warnings.
  - Change password and full account deletion.

---

## 👑 Administrator System & Admin Dashboard

### Administrator sign-in
- Username: `admin`. Sign in through the normal Sign In form, then open `#/admin`.
- The administrator is provisioned in Firebase Authentication with a signed admin claim. No password or password hash is shipped in the website or repository.
- Browser storage cannot grant admin permissions. Firebase rules enforce all cloud access.
- The configured initial password works immediately; password changes are available from the account page.

During play, the signed-in admin can choose **Edit prompt** below a card, then **Save permanently**. Official edits update the source card, including when drawn in Chaos Mix; custom-deck edits stay within that deck. Saved changes update active cards in other browsers without restarting their rounds, and edited cards keep their deck position after reloading.

### Admin Dashboard Sections (`#/admin`)
1. **Overview**: Total users, total custom decks, total prompt submissions, pending submissions, approved prompts, rejected prompts.
2. **Prompt Moderation**: Review pending community submissions, view game & category, approve, reject (with mandatory reason), or edit and approve. Approved prompts immediately appear in the active game pool!
3. **Game Content Manager**: Search, add, edit, delete, and restore standard and rare cards across all games, categories, and play modes. Chaos Mix follows its source cards. Synced changes also apply to Party Mode and multiplayer.
4. **All decks**: Inspect public, private, unlisted, and bundled community decks; add, edit, and delete cards; approve or hide public decks. Changes persist in Firebase. Legacy decks saved only in another browser remain on that device until synced.
5. **Collections**: Browse application collections and nested room collections in pages of 50 records. Enter a collection path for other collections; password credential records remain server-only.
6. **User Management**: View registered usernames and existing local account moderation tools. Passwords and hashes are never exposed.

---

## 🗃️ Custom Deck Creation System

- Create custom decks from scratch for any of the 8 games.
- Specialized editors for game mechanics (e.g. Option A/B for Would You Rather; Truth/Dare type tags).
- Live card preview while editing.
- Reorder cards with convenient up/down controls.
- **Deck Visibility**:
  - **Private**: Only the creator can view and play.
  - **Unlisted**: Playable by anyone with the unlisted share link (`jk_...`).
  - **Public**: Submitted to moderators before appearing in Community Discovery.
- Duplicate decks to make private copies.
- **Community Decks Section**: Located on the homepage for discovering and playing approved public decks without an account.

---

## 💡 Community Prompt Submissions

- Every game interface features a **"+ Suggest a Card"** button.
- Users can propose prompts for any game and category.
- Rate limiting and duplicate detection prevent spam.
- Stored in moderation queue until reviewed by an administrator.

---

## 🎨 Branding & Author Footer

- Background: Nearly pure black (`#050505`).
- Brand Colors: Neon Pink (`#FF4DA6`) & Electric Violet (`#A855F7`).
- Ambient particle canvas background respecting `prefers-reduced-motion`.
- Footer: **Created by Evan** featuring a multi-color animated gradient across "Evan" and glowing minimalist links to LinkedIn, GitHub, and Email (configured in `src/config/socialLinks.ts`).

---

## 🚀 Firebase Setup & Deployment

### Project Configuration
- **Firebase Project ID**: `jinxkiss-cfbaf`
- **Hosting Site**: `jinxkiss-cfbaf` ([https://jinxkiss-cfbaf.web.app](https://jinxkiss-cfbaf.web.app)); CLI target: `jinxkiss`
- **App ID**: `1:1044843832410:web:97cf361b4767a5c56c6463`

### Deployment Commands
```bash
# Install dependencies
npm install

# Run automated tests
npm test

# Build for production
npm run build

# Deploy Hosting to jinxkiss site
firebase deploy --only hosting:jinxkiss

# Deploy Firestore Security Rules & Indexes
firebase deploy --only firestore:rules,firestore:indexes
```
## Prompt library validation

Official cards are grouped by their actual game mechanics, category, and play mode. Chaos Mix is the only game that deliberately combines cards from other games, and it retains each card's source game. Admin overrides are merged before filtering, so moving or disabling a card also updates its original pool and Chaos Mix.

- **Kids:** wholesome, age-appropriate questions and challenges, without romance, adult themes, or drinking.
- **Easy:** light conversation and low-pressure challenges.
- **Medium:** personal stories and mild embarrassment.
- **Extreme:** intense questions, difficult dilemmas, and bold challenges.
- **Unhinged:** adults-only roasts, dark social satire, hypocrisy, betrayal, and brutal dilemmas.
- **Couples:** shared memories, affection, and relationship conversations.
- **Spicy:** flirting and attraction without explicit adult content.
- **18+:** explicit adult topics and mature nightlife stories.

Repeated filler has been removed. Would You Rather cards require two distinct choices; Truth or Dare cards require a type; statements, opinions, and group votes use their corresponding game formats. Newly submitted and admin-added cards are validated before publication. Editorial review is still needed to assess meaning and tone beyond the automated checks.

Run `npm run test:prompts` to audit every game/category/mode combination and the category-switching regressions. Run `npm test` and `npm run build` for the complete automated checks and production build.

### Editorial content pass

The official collection contains 2,334 standard cards plus a separate rare-card pool. The editorial pass removed 4,707 weak, repetitive, or unsuitable legacy cards and added four original rare cards. Each game keeps all eight categories in both play formats; every online game has at least 100 distinct cards.

Cards need a concrete incident, surprising choice, playable scene, or debate hook. Bare favorites, numbered variations, cosmetic rewordings, routine flirting tasks, and generic topic templates are excluded. Spicy uses non-explicit flirting; adult content stays in the age-confirmed 18+ and Unhinged categories. Category coverage and originality are checked alongside game formats. Small categories are curated for variety rather than padded to meet a global count.

Spotlight text lives in `src/data/prompts/editorialSpotlights.ts`. Append new seed rows to preserve the IDs of existing cards. The automated wording checks in `src/utils/promptQuality.ts` catch simple templates; editorial review remains necessary for tone and entertainment value.

### Unhinged rewrite

The old Unhinged standard and rare pools have been retired. `src/data/prompts/unhinged.ts` supplies 448 distinct cards (224 per play format) and eight rare cards. Every source game has 20 cards per format, with 24 in Truth or Dare split evenly between Truth and Dare. Chaos Mix derives its Unhinged rounds from these source games.

The category focuses on player roasts, messy dating stories, hypocrisy, fake apologies, reputation disasters, dark humor, and uncomfortable choices. Players can pass. It requires adult confirmation when launching, resuming, opening a custom deck, or entering an adult party or multiplayer room. Clean and Kids pools and progression exclude it.

### Researched prompt expansion

Added 86 source-tracked cards across all source games and categories, with 43 per play format. Two questions are reused under Parabol's MIT license; the other 84 are original adaptations of established party-game formats. Source references, category mapping, and attribution are documented in [docs/PROMPT_SOURCES.md](docs/PROMPT_SOURCES.md). The website footer links the public prompt credits and license notice.
