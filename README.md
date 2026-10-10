# JINX KISS — Social Party Gaming Platform

> **Good friends. Bad decisions.**

A modern, minimalist neon-dark social party game website where friends, couples, and groups can play interactive card games together on a single shared screen or across devices.

Live Website: **jinxkiss.com**

---

## 🎮 The Eight Playable Games

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

---

## 🌟 Game Categories

- **Easy**: Casual, lighthearted, funny icebreakers.
- **Medium**: More personal, challenging, and embarrassing questions.
- **Extreme**: Bold, intense dares and dilemmas.
- **Couples**: Romantic, intimate, and relationship-oriented questions.
- **18+**: Adults-only uncensored prompts (**requires age verification modal confirmation**).
- **Spicy**: Flirty, magnetic, and provocative challenges.
- **Kids**: Family-friendly, completely wholesome, with alcohol mechanics replaced with fun forfeits.

---

## 🔐 Optional User Accounts & Authentication

- **Guest Mode**: Anyone can open Jinx Kiss and play all 8 games, select categories, spin the roulette wheel, add party players, vote, and play public community decks with zero registration.
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

### One-Time Admin Setup
- Bootstrap username: `admin`
- Initial temporary password: `123456789`
- **Mandatory first-login security**: The system enforces an immediate password change on first login. Privileged administrative actions are locked until the temporary password is changed.

### Admin Dashboard Sections (`#/admin`)
1. **Overview**: Total users, total custom decks, total prompt submissions, pending submissions, approved prompts, rejected prompts.
2. **Prompt Moderation**: Review pending community submissions, view game & category, approve, reject (with mandatory reason), or edit and approve. Approved prompts immediately appear in the active game pool!
3. **Game Content Manager**: Browse, filter, search, add, edit, or disable/delete official cards across all 8 games.
4. **Community Deck Manager**: Inspect custom public decks, approve or reject them for Community Discovery, and hide violating decks.
5. **User Management**: View registered usernames, search users, suspend or ban accounts (with reason), and unban. Passwords and hashes are never exposed.

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
- **Firebase Project ID**: `starlight-fishing`
- **Hosting Site**: `jinxkiss` ([https://jinxkiss.web.app](https://jinxkiss.web.app))
- **App ID**: `1:1092703473317:web:bd339b3915feb05633c74c`

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
