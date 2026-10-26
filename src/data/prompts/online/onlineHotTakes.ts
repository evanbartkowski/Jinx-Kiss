import { ONLINE_HOT_TAKES_EXPANSION } from './expansions/onlineHotTakesExpansion';
import { PromptItem } from '../../../types/game';

/**
 * ONLINE HOT TAKES PROMPTS
 * Specifically crafted for remote voice chats, Discord server debates, and video calls.
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
const BASE_ONLINE_HOT_TAKES_PROMPTS: PromptItem[] = [
  // ==========================================
  // EASY (Fun, low-stakes digital & internet takes)
  // ==========================================
  {
    id: 'on-ht-easy-1',
    gameId: 'hot-takes',
    category: 'easy',
    playMode: 'online',
    text: "Keeping your webcam turned off with a blank black square in a small hangout call is socially hostile.",
    discussionPrompt: "Camera on vs camera off: is it basic courtesy or personal freedom?"
  },
  {
    id: 'on-ht-easy-6',
    gameId: 'hot-takes',
    category: 'easy',
    playMode: 'online',
    text: "Putting an exclamation mark in a work Slack or Discord message is compulsory unless you want to sound angry.",
    discussionPrompt: "Has punctuation become an emotional battlefield?"
  },

  // ==========================================
  // MEDIUM (Relatable awkwardness & online social etiquette)
  // ==========================================
  {
    id: 'on-ht-med-1',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "If you leave someone on 'Read' for more than 4 hours without explaining, you are actively sending a silent insult.",
    discussionPrompt: "Read receipts: transparency or emotional warfare?"
  },
  {
    id: 'on-ht-med-2',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "Lurking in an open voice channel on deafen or mute while listening to friends talk is creepy, not casual.",
    discussionPrompt: "Deafen-lurking: harmless presence or digital eavesdropping?"
  },
  {
    id: 'on-ht-med-3',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "Curating a private 'Finsta' or alternate Twitter account to post vents is healthier than talking to a therapist.",
    discussionPrompt: "Do private dump accounts help process emotion or amplify drama?"
  },
  {
    id: 'on-ht-med-5',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "People who post gym mirror thirst traps on their main story definitely want specific people's DMs, not fitness tracking.",
    discussionPrompt: "Gym stories: accountability or covert validation bait?"
  },

  // ==========================================
  // EXTREME (Spicy controversy, strong online tensions)
  // ==========================================
  {
    id: 'on-ht-ext-1',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "Ghosting someone after 3+ dates is completely acceptable if you owe them no moral debt and the vibe is toxic.",
    discussionPrompt: "Is ghosting ever justified, or is direct closure non-negotiable?"
  },
  {
    id: 'on-ht-ext-3',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "Online friendships formed through Discord and gaming can be deeper and more authentic than 90% of in-person friendships.",
    discussionPrompt: "Does physical presence matter when soul connections happen over headset?"
  },
  {
    id: 'on-ht-ext-4',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "Having a secret group chat that excludes one specific person from the main group is toxic and cowardly.",
    discussionPrompt: "Is the 'side group chat' an inevitable social release or mean-spirited?"
  },
  {
    id: 'on-ht-ext-5',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "If you wouldn't say it to someone's face over video call, typing it in text chat makes you a fraud.",
    discussionPrompt: "Does text communication breed artificial bravery?"
  },
  {
    id: 'on-ht-unh-3',
    gameId: 'hot-takes',
    category: 'unhinged',
    playMode: 'online',
    text: "People who use light mode on Discord or IDEs are genuine sociopaths who cannot be trusted around children.",
    discussionPrompt: "Why does dark mode hold such cultural dominance?"
  },
  {
    id: 'on-ht-cpl-2',
    gameId: 'hot-takes',
    category: 'couples',
    playMode: 'online',
    text: "Sharing your live location 24/7 with your partner is an act of deep peace of mind, not a lack of trust.",
    discussionPrompt: "Does Life360/FindMy create safety or suffocating surveillance?"
  },
  {
    id: 'on-ht-cpl-4',
    gameId: 'hot-takes',
    category: 'couples',
    playMode: 'online',
    text: "If you don't post your partner on your social media at least once in 6 months, you are hiding them.",
    discussionPrompt: "Social media posting: public pride or performative insecurity?"
  },

  // ==========================================
  // 18+ (Mature adult discussions, dating apps, boundary setting)
  // ==========================================
  {
    id: 'on-ht-18-1',
    gameId: 'hot-takes',
    category: '18+',
    playMode: 'online',
    text: "Sending unsolicited spicy photos is never okay, but sending dry boring 'hey' texts is an equal waste of time.",
    discussionPrompt: "What is the proper etiquette for escalating flirting online?"
  },

  // ==========================================
  // SPICY (Sensual, sexually explicit remote takes)
  // ==========================================
  {
    id: 'on-ht-spicy-1',
    gameId: 'hot-takes',
    category: "18+",
    playMode: 'online',
    text: "A partner who knows how to talk dirty with confidence over a voice call is more attractive than someone with a 10/10 body.",
    discussionPrompt: "Does verbal dominance and dirty talk outweigh physical aesthetics?"
  },

  // ==========================================
  // EXPANDED EASY (Fun, relatable internet takes)
  // ==========================================
  {
    id: 'on-ht-easy-7',
    gameId: 'hot-takes',
    category: 'easy',
    playMode: 'online',
    text: "Putting a 'typing...' indicator on for 5 minutes just to send a thumbs-up emoji should be punishable by a 24-hour server mute.",
    discussionPrompt: "Typing anxiety: is long typing delay rude or just overthinking?"
  },
  {
    id: 'on-ht-easy-10',
    gameId: 'hot-takes',
    category: 'easy',
    playMode: 'online',
    text: "Playing a game at 30 FPS in 2026 is completely playable and graphical snobs need to calm down.",
    discussionPrompt: "Frame rate snobbery vs actual gameplay: what matters more?"
  },

  // ==========================================
  // EXPANDED MEDIUM (Relatable digital etiquette)
  // ==========================================
  {
    id: 'on-ht-med-7',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "Leaving a Discord call without saying goodbye ('ninja-leaving') is acceptable if more than 4 people are in the channel.",
    discussionPrompt: "The Irish Exit in voice channels: polite or bad manners?"
  },

  // ==========================================
  // EXPANDED EXTREME (High-tension digital dynamics)
  // ==========================================
  {
    id: 'on-ht-ext-6',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "Having a secret group chat that excludes only one person from the main friend group is toxic, even if they're annoying.",
    discussionPrompt: "Exclusion chats: necessary boundary or middle-school bullying?"
  },
  {
    id: 'on-ht-ext-7',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "Sharing passwords to streaming or gaming accounts with an ex for months after a breakup means you're still not over them.",
    discussionPrompt: "Shared digital accounts: free perks or emotional tether?"
  },
  {
    id: 'on-ht-ext-8',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "Lying about your mic being broken to avoid speaking in a voice call makes you a fake friend.",
    discussionPrompt: "Social battery exhaustion vs honest communication: where is the line?"
  },

  // ==========================================
  // EXPANDED UNHINGED (Chaotic audio & internet takes)
  // ==========================================
  {
    id: 'on-ht-unh-5',
    gameId: 'hot-takes',
    category: 'unhinged',
    playMode: 'online',
    text: "People who eat loud crunchy snacks while completely unmuted in voice chat deserve an immediate 7-day server ban.",
    discussionPrompt: "Chewing on mic: harmless accident or auditory assault?"
  },
  {
    id: 'on-ht-18-7',
    gameId: 'hot-takes',
    category: '18+',
    playMode: 'online',
    text: "If you wouldn't feel comfortable with your partner reading your incognito search queries, you are hiding something real.",
    discussionPrompt: "Search history transparency: healthy boundary or absolute privacy?"
  },
  {
    id: 'on-ht-kids-8',
    gameId: 'hot-takes',
    category: 'kids',
    playMode: 'online',
    text: "Video games where you can fly in the sky are always more fun than games where you only walk on the ground.",
    discussionPrompt: "Flying powers vs super speed: which is the coolest superpower?"
  },
  {
    id: 'on-ht-easy-14',
    gameId: 'hot-takes',
    category: 'easy',
    playMode: 'online',
    text: "Leaving a call without saying goodbye ('the Irish exit') is the polite thing to do in large groups.",
    discussionPrompt: "The digital Irish exit: efficient courtesy or rude disappearance?"
  },

  // Medium:
  {
    id: 'on-ht-med-12',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "If you don't react to someone's message in a small group within 2 hours, you're intentionally ignoring them.",
    discussionPrompt: "Online response etiquette: are people entitled to quick validation?"
  },
  {
    id: 'on-ht-med-15',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "Having a dedicated 'finsta' or private spam account is a red flag indicating you talk trash about friends.",
    discussionPrompt: "Private spam accounts: safe emotional venting or toxic gossip dens?"
  },

  // Extreme:
  {
    id: 'on-ht-ext-11',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "If your partner refuses to let you look through their phone's camera roll and DMs, they are 100% hiding something.",
    discussionPrompt: "Digital open-device transparency vs healthy personal privacy: where is the line?"
  },
  {
    id: 'on-ht-ext-13',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "People who put 'no drama' in their server or dating bio are guaranteed to be the main source of drama.",
    discussionPrompt: "The 'no drama' paradox: why do people who say it cause the most chaos?"
  },
  {
    id: 'on-ht-ext-14',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "Reading an ex's public social media updates months after a breakup is emotional self-harm that everyone pretends is normal.",
    discussionPrompt: "Post-breakup digital lurk: inevitable human curiosity or toxic obsession?"
  },

  // Unhinged:
  {
    id: 'on-ht-unh-9',
    gameId: 'hot-takes',
    category: 'unhinged',
    playMode: 'online',
    text: "People who eat loud crunchy snacks while their mic sensitivity is set to zero threshold should be banned from VoIP permanently.",
    discussionPrompt: "Microphone mouth-breathing and chip crunching: capital digital offense or minor annoyance?"
  },
  {
    id: 'on-ht-unh-11',
    gameId: 'hot-takes',
    category: 'unhinged',
    playMode: 'online',
    text: "Anyone who uses voice changers to pretend to be an anime character in serious gaming lobbies is secretly a genius.",
    discussionPrompt: "Trolling lobbies with voice filters: hilarious artform or unhinged nuisance?"
  },
  {
    id: 'on-ht-unh-12',
    gameId: 'hot-takes',
    category: 'unhinged',
    playMode: 'online',
    text: "If you have more than 100 tabs open in your browser, your brain is operating in the 5th dimension.",
    discussionPrompt: "Tab hoarders: visionary multitaskers or digital hoarders needing intervention?"
  },

  // Couples:
  {
    id: 'on-ht-cpl-9',
    gameId: 'hot-takes',
    category: 'couples',
    playMode: 'online',
    text: "Long-distance relationships built on deep late-night voice calls build stronger emotional bonds than couples who just hang out watching TV.",
    discussionPrompt: "Voice-only vulnerability vs physical proximity: which creates deeper soul connection?"
  },
  {
    id: 'on-ht-cpl-11',
    gameId: 'hot-takes',
    category: 'couples',
    playMode: 'online',
    text: "A 30-second unexpected audio voice note saying 'I miss you' is 10x more romantic than a bouquet of flowers.",
    discussionPrompt: "Spontaneous heartfelt voice notes vs traditional gifts: which hits the heart harder?"
  },

  // 18+:
  {
    id: 'on-ht-18-9',
    gameId: 'hot-takes',
    category: '18+',
    playMode: 'online',
    text: "If someone is incredible at dirty talk over text and call, they are almost guaranteed to be amazing in bed.",
    discussionPrompt: "Does verbal sexual eloquence directly translate to physical bedroom chemistry?"
  },
  {
    id: 'on-ht-18-10',
    gameId: 'hot-takes',
    category: '18+',
    playMode: 'online',
    text: "Watching your partner's face through a webcam while they get off is hotter than being in the same room with the lights off.",
    discussionPrompt: "The intimacy of focused webcam facial expressions vs darkness in person: which is hotter?"
  },
  {
    id: 'on-ht-18-12',
    gameId: 'hot-takes',
    category: '18+',
    playMode: 'online',
    text: "Sharing a spicy photo or clip that disappears after 1 view creates 10x more sexual tension than permanent photos.",
    discussionPrompt: "Disappearing ephemeral media vs saved galleries: what fuels desire faster?"
  },
  {
    id: 'on-ht-spicy-11',
    gameId: 'hot-takes',
    category: "18+",
    playMode: 'online',
    text: "Cybering and webcam sessions strip away physical self-consciousness and allow people to be their most sexually authentic selves.",
    discussionPrompt: "Does remote digital intimacy liberate sexual fantasies better than physical dating?"
  },
  {
    id: 'on-ht-kids-12',
    gameId: 'hot-takes',
    category: 'kids',
    playMode: 'online',
    text: "Building an obstacle course in your hallway out of pillows and yarn is the best rainy day game ever.",
    discussionPrompt: "Hallway spy obstacle courses: the greatest indoor game ever invented?"
  }
];


export const ONLINE_HOT_TAKES_PROMPTS: PromptItem[] = [...BASE_ONLINE_HOT_TAKES_PROMPTS, ...ONLINE_HOT_TAKES_EXPANSION];
