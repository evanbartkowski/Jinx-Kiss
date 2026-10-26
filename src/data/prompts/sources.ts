/** Research references, not endorsements or permission to copy commercial decks. */
export const PROMPT_SOURCES = {
  parabol: {
    title: 'Parabol Icebreakers',
    url: 'https://github.com/ParabolInc/icebreakers/blob/35b3f1579852e1e1e535983ab7a503b6e0e44550/lib/api.ts',
    license: 'MIT',
    licenseUrl: 'https://github.com/ParabolInc/icebreakers/blob/35b3f1579852e1e1e535983ab7a503b6e0e44550/LICENSE',
    usage: 'Two licensed questions; other entries are original variations on conversation starters.',
  },
  wnrs: {
    title: "We're Not Really Strangers",
    url: 'https://www.werenotreallystrangers.com/pages/core-game',
    usage: 'Original questions about perception, connection, and relationship reflection.',
  },
  cut: {
    title: 'Truth or Drink — Cut',
    url: 'https://www.cut.com/truth-or-drink-party-games',
    usage: 'Original personal questions with an answer-or-pass response.',
  },
  voting: {
    title: 'The Voting Game — Dyce Games',
    url: 'https://dycegames.com/collections/the-voting-game',
    usage: 'Original player nominations based on revealing situations.',
  },
  poison: {
    title: 'Pick Your Poison — Dyce Games',
    url: 'https://dycegames.com/collections/pick-your-poison',
    usage: 'Original paired dilemmas with comparable costs.',
  },
  opinions: {
    title: 'Bad Opinions — Dyce Games',
    url: 'https://dycegames.com/collections/bad-opinions',
    usage: 'Original statements suited to agree/disagree debate.',
  },
  seat: {
    title: 'Hot Seat — Dyce Games',
    url: 'https://dycegames.com/collections/hot-seat',
    usage: 'Original questions about one spotlighted player; no impersonation rule added.',
  },
  nhie: {
    title: 'Never Have I Ever — PsyCat Games',
    url: 'https://psycatgames.com/magazine/party-games/never-ever/',
    usage: 'Original admissions drawn from familiar confession-game situations.',
  },
  tod: {
    title: 'Truth or Dare — PsyCat Games',
    url: 'https://psycatgames.com/magazine/party-games/truth-or-dare/',
    usage: 'Original truth questions and playable challenges, separated by type.',
  },
  flags: {
    title: 'Red Flags — Gameology retailer overview',
    url: 'https://www.gameology.com.au/products/red-flags',
    usage: 'Original perk-versus-dealbreaker scenarios adapted to flag voting.',
  },
  roles: {
    title: 'Role Models — Jackbox Games',
    url: 'https://www.jackboxgames.com/games/role-models',
    usage: 'Original group-role predictions adapted to single-player nominations.',
  },
} as const;

export type PromptSourceId = keyof typeof PROMPT_SOURCES;
export const SOURCE_REVIEW_DATE = '2026-10-25';
