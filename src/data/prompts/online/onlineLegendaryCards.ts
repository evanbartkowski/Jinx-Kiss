import { PromptItem } from '../../../types/game';

/**
 * ONLINE RARE LEGENDARY CARDS
 * Super rare, unforgettable high-voltage Legendary prompts designed for remote video & voice sessions.
 * Each card features `isLegendary: true`, `rarity: 'legendary'`, and an epic `legendaryTitle`.
 */
export const ONLINE_LEGENDARY_CARDS: PromptItem[] = [
  // ==========================================
  // 1. KIDS CATEGORY
  // ==========================================
  {
    id: 'on-leg-kids-1',
    gameId: 'truth-or-dare',
    category: 'kids',
    type: 'dare',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY ROBOT OVERLORD ★',
    text: "The Cyber Emperor: For the next 3 rounds on call, you are a defective robot from the year 3000! You must only speak in beep-boop robot sounds and robotic head turns, and everyone must salute your camera before addressing you!"
  },
  {
    id: 'on-leg-kids-2',
    gameId: 'would-you-rather',
    category: "18+",
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: "Would you rather have a real-life Pikachu follow you on webcam everywhere you go OR have your bedroom turn into a zero-gravity bounce house every Saturday?",
    optionA: "Webcam Pikachu companion",
    optionB: "Zero-gravity bounce house room"
  },

  // ==========================================
  // 2. EASY CATEGORY
  // ==========================================
  {
    id: 'on-leg-easy-1',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY LIVESTREAM PITCH ★',
    text: "The 60-Second Shark Tank: Grab the nearest completely ordinary object on your desk (a pen, a cable, a mug). Deliver an impassioned, high-octane 60-second venture capital sales pitch to the call explaining why this item is worth $10,000,000!",
    forfeit: "Drink 2 sips of your beverage on camera"
  },
  {
    id: 'on-leg-easy-2',
    gameId: 'truth-or-dare',
    category: 'easy',
    type: 'truth',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: "The Phantom Search: What is the single weirdest late-night Google query you typed while completely sleep-deprived in bed that you immediately erased in embarrassment the next morning?"
  },

  // ==========================================
  // 3. MEDIUM CATEGORY
  // ==========================================
  {
    id: 'on-leg-med-1',
    gameId: 'truth-or-dare',
    category: 'medium',
    type: 'dare',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY DESKTOP ROULETTE ★',
    text: "The Screen-Share Showcase: Screen-share your full computer screen for 30 seconds straight! Open your Spotify 'On Repeat' and your most recent 3 YouTube search queries with zero explanations allowed!"
  },
  {
    id: 'on-leg-med-2',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY DIGITAL TRIAL ★',
    text: "Your habits in voice chat reveal more about your personality than your social media profile does.",
    discussionPrompt: "Which call habit tells you the most about someone?"
  },

  // ==========================================
  // 4. EXTREME CATEGORY
  // ==========================================
  {
    id: 'on-leg-ext-1',
    gameId: 'truth-or-dare',
    category: 'extreme',
    type: 'dare',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY REMOTE HIGH-STAKES ★',
    text: "The Group Chat Hostage: Unmute your mic. The group has 45 seconds to collaboratively draft a 1-sentence completely unhinged text message. You must copy-paste it directly to your most recent contact on Instagram or WhatsApp and show proof on webcam!"
  },
  {
    id: 'on-leg-ext-2',
    gameId: 'truth-or-sip',
    category: 'extreme',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY REVELATION ★',
    text: "The Vault of Secrets: Reveal the single deepest secret you have ever kept from someone currently in this call. If you refuse to answer, you must chug your entire beverage live on webcam!",
    forfeit: "Down your entire drink"
  },

  // ==========================================
  // 5. UNHINGED CATEGORY
  // ==========================================
  {
    id: 'on-leg-unh-1',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CHAOS OVERLOAD ★',
    text: "The Full Discord Takeover: Change your Discord avatar to a picture chosen by the group, change your nickname to 'Local Cryptid', tilt your webcam 90 degrees sideways, and speak only in exaggerated operatic whispers for the next 3 rounds!",
    forfeit: "Take 3 heavy penalty sips"
  },
  {
    id: 'on-leg-unh-2',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY PARADOX ★',
    text: "Would you rather have every single voice note you've ever recorded blasted on an arena loudspeaker OR have your deleted photos printed and mailed as postcards to all your contacts?",
    optionA: "Arena loudspeaker voice notes",
    optionB: "Mailed deleted photo postcards"
  },

  // ==========================================
  // 6. COUPLES CATEGORY
  // ==========================================
  {
    id: 'on-leg-cpl-1',
    gameId: 'truth-or-dare',
    category: 'couples',
    type: 'dare',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY ETERNAL PROMISE ★',
    text: "The Candlelit Confession: Move your webcam close, lower your room lighting, look deeply into my eyes on screen, and speak from your soul: What is the exact promise you make to my heart, no matter how much distance or time separates us?"
  },
  {
    id: 'on-leg-cpl-2',
    gameId: 'truth-or-sip',
    category: 'couples',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SOULMATE TRUTH ★',
    text: "The Electric Spark: Describe the exact moment during our late-night calls or messages when you realized that I was not just another person in your life, but the only person you wanted forever.",
    forfeit: "Send an audio love letter before going to sleep"
  },

  // ==========================================
  // 7. 18+ CATEGORY
  // ==========================================
  {
    id: 'on-leg-18-1',
    gameId: 'truth-or-dare',
    category: '18+',
    type: 'truth',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY ADULT SANCTUM ★',
    text: "The Forbidden Fantasy: Confess the most intense, taboo, or unconventional sexual scenario you have ever dreamed of, including exactly what environment, dialogue, and roles would make it unforgettable."
  },
  {
    id: 'on-leg-18-2',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY MIDNIGHT DARE ★',
    text: "The Audio Siren: Mute all other participants. Lean directly into your microphone and deliver a 45-second uncensored erotic monologue describing exactly what you crave late at night when nobody is watching.",
    forfeit: "Take 3 heavy penalty drinks"
  },
  {
    id: 'on-leg-spicy-2',
    gameId: 'truth-or-sip',
    category: "18+",
    playMode: 'online',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CARNAL TRUTH ★',
    text: "The Ultimate Arousal: Name the single person in this call who turns you on the most, and describe in explicit, heart-pounding detail what you would do to them if they unlocked your door right now.",
    forfeit: "Take 3 massive penalty drinks"
  },
  {
    id: 'on-leg-editorial-spicy-truth', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', playMode: 'online',
    isLegendary: true, rarity: 'legendary', legendaryTitle: 'LEGENDARY FLIRTING GLITCH',
    text: 'Tell the call about a typo or misheard word that sent a flirty conversation in a completely different direction. What did you mean, and did the accident help?'
  },
  {
    id: 'on-leg-editorial-spicy-dare', gameId: 'truth-or-dare', category: 'spicy', type: 'dare', playMode: 'online',
    isLegendary: true, rarity: 'legendary', legendaryTitle: 'LEGENDARY SPACE TRANSMISSION',
    text: 'With a willing player, play two space captains trying to invite each other on a date through a terrible connection. The call supplies one absurd misunderstanding you must make romantic.'
  }
];

