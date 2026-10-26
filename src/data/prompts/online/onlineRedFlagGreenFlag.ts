import { ONLINE_RED_FLAG_GREEN_FLAG_EXPANSION } from './expansions/onlineRedFlagGreenFlagExpansion';
import { PromptItem } from '../../../types/game';

/**
 * ONLINE RED FLAG / GREEN FLAG PROMPTS
 * Specifically crafted for remote sessions, online dating, digital habits, and Discord culture.
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
const BASE_ONLINE_RED_FLAG_GREEN_FLAG_PROMPTS: PromptItem[] = [
  {
    id: 'on-rf-easy-2',
    gameId: 'red-flag-green-flag',
    category: 'easy',
    playMode: 'online',
    text: "They keep over 150 tabs open in Chrome at all times and claim they know where every single one is.",
    scenario: "Browser tab management"
  },
  {
    id: 'on-rf-easy-4',
    gameId: 'red-flag-green-flag',
    category: 'easy',
    playMode: 'online',
    text: "They send you 15 TikTok or Reel links in a row at 2 AM without saying a single word.",
    scenario: "Late night meme dumping"
  },

  // ==========================================
  // MEDIUM (Awkward, telling digital dynamics)
  // ==========================================
  {
    id: 'on-rf-med-1',
    gameId: 'red-flag-green-flag',
    category: 'medium',
    playMode: 'online',
    text: "They turn off their 'Read Receipts' on iMessage or WhatsApp so you never know when they've seen your message.",
    scenario: "Privacy vs transparency"
  },

  // ==========================================
  // EXTREME (High-voltage boundary testing & intense red flags)
  // ==========================================
  {
    id: 'on-rf-ext-1',
    gameId: 'red-flag-green-flag',
    category: 'extreme',
    playMode: 'online',
    text: "They demand that you screen-share your DMs or search history when you have an argument over call.",
    scenario: "Digital interrogation"
  },
  {
    id: 'on-rf-ext-3',
    gameId: 'red-flag-green-flag',
    category: 'extreme',
    playMode: 'online',
    text: "They secretly created a second burner social media account to watch your public stories anonymously.",
    scenario: "Burner account stalking"
  },
  {
    id: 'on-rf-ext-4',
    gameId: 'red-flag-green-flag',
    category: 'extreme',
    playMode: 'online',
    text: "They suddenly leave a group voice call and go 'Offline' on Discord specifically so someone will DM to check on them.",
    scenario: "Performative offline sulking"
  },
  {
    id: 'on-rf-cpl-4',
    gameId: 'red-flag-green-flag',
    category: 'couples',
    playMode: 'online',
    text: "They remember the exact date and game you two first played together online and celebrate the anniversary.",
    scenario: "Virtual milestone memory"
  },
  {
    id: 'on-rf-spicy-2',
    gameId: 'red-flag-green-flag',
    category: "18+",
    playMode: 'online',
    text: "They send a teasing 5-second video showing only what they're wearing under their robe before joining the call.",
    scenario: "Pre-call lingerie tease"
  },
  {
    id: 'on-rf-kids-2',
    gameId: 'red-flag-green-flag',
    category: 'kids',
    playMode: 'online',
    text: "They pause the movie on video call every 2 minutes to explain the lore of a background character.",
    scenario: "Enthusiastic movie commentary"
  },

  // ==========================================
  // EXPANDED EXTREME (High-stakes digital boundaries)
  // ==========================================
  {
    id: 'on-rf-ext-6',
    gameId: 'red-flag-green-flag',
    category: 'extreme',
    playMode: 'online',
    text: "They check your location on Snap Map or Find My and comment when you arrive home before you message them.",
    scenario: "Unsolicited digital GPS surveillance"
  },
  {
    id: 'on-rf-ext-8',
    gameId: 'red-flag-green-flag',
    category: 'extreme',
    playMode: 'online',
    text: "They demand that you leave your Discord stream on so they know you're not playing with other people.",
    scenario: "Stream-sharing surveillance"
  },
  {
    id: 'on-rf-ext-10',
    gameId: 'red-flag-green-flag',
    category: 'extreme',
    playMode: 'online',
    text: "They get visibly passive-aggressive if your Discord status says 'Online' but you haven't replied to their DM.",
    scenario: "Status policing"
  },

  // ==========================================
  // EXPANDED COUPLES (Long-distance & digital chemistry)
  // ==========================================
  {
    id: 'on-rf-cpl-5',
    gameId: 'red-flag-green-flag',
    category: 'couples',
    playMode: 'online',
    text: "They order your favorite bubble tea or dessert to your doorstep when they know you've had a rough day on call.",
    scenario: "Surprise food delivery care"
  },
  {
    id: 'on-rf-cpl-6',
    gameId: 'red-flag-green-flag',
    category: 'couples',
    playMode: 'online',
    text: "They create a shared digital countdown on their phone for the next time you get to see each other.",
    scenario: "Shared countdown timer"
  },
  {
    id: 'on-rf-cpl-8',
    gameId: 'red-flag-green-flag',
    category: 'couples',
    playMode: 'online',
    text: "They read you chapters of a fantasy novel while you lie in bed together on a nighttime call.",
    scenario: "Bedtime call story reading"
  },

  // ==========================================
  // EXPANDED 18+ (Adult digital habits & boundaries)
  // ==========================================
  {
    id: 'on-rf-18-5',
    gameId: 'red-flag-green-flag',
    category: '18+',
    playMode: 'online',
    text: "They send spicy pictures but immediately delete them if you don't respond with high enthusiasm within 60 seconds.",
    scenario: "Spicy validation urgency"
  },
  {
    id: 'on-rf-kids-6',
    gameId: 'red-flag-green-flag',
    category: 'kids',
    playMode: 'online',
    text: "They build a giant roller coaster in Roblox and invite everyone in the call to ride it together.",
    scenario: "Roblox roller coaster design"
  },

  // Extreme:
  {
    id: 'on-rf-ext-11',
    gameId: 'red-flag-green-flag',
    category: 'extreme',
    playMode: 'online',
    text: "They notice when you delete a message in chat and DM you asking 'why did you delete that?'.",
    scenario: "Deleted message interrogation"
  },
  {
    id: 'on-rf-ext-13',
    gameId: 'red-flag-green-flag',
    category: 'extreme',
    playMode: 'online',
    text: "They check your online status every hour and bring up 'I saw you were playing games at 3 AM'.",
    scenario: "Activity status surveillance"
  },

  // Couples:
  {
    id: 'on-rf-cpl-9',
    gameId: 'red-flag-green-flag',
    category: 'couples',
    playMode: 'online',
    text: "They leave their camera on while studying or working silently just so you have each other's quiet company.",
    scenario: "Silent co-working camera session"
  },
  {
    id: 'on-rf-cpl-10',
    gameId: 'red-flag-green-flag',
    category: 'couples',
    playMode: 'online',
    text: "They remember the exact date of the first late-night call where you talked until sunrise.",
    scenario: "Milestone call memory"
  },
  {
    id: 'on-rf-cpl-12',
    gameId: 'red-flag-green-flag',
    category: 'couples',
    playMode: 'online',
    text: "They write you handwritten digital notes on their tablet and send them as surprises throughout your workday.",
    scenario: "Handwritten digital love letters"
  },
  {
    id: 'on-rf-18-10',
    gameId: 'red-flag-green-flag',
    category: '18+',
    playMode: 'online',
    text: "They whisper teasing comments into their headset during a group voice call that only you understand the secret meaning of.",
    scenario: "Secret code in public call"
  },
  {
    id: 'on-rf-18-11',
    gameId: 'red-flag-green-flag',
    category: '18+',
    playMode: 'online',
    text: "They know exactly how to adjust their bedroom lighting to look like an intoxicating renaissance painting on camera.",
    scenario: "Masterclass ambient webcam lighting"
  },
  {
    id: 'on-rf-18-12',
    gameId: 'red-flag-green-flag',
    category: '18+',
    playMode: 'online',
    text: "They send voice notes of their morning voice right when they wake up that make your knees weak.",
    scenario: "Deep morning voice notes"
  },
  {
    id: 'on-rf-spicy-10',
    gameId: 'red-flag-green-flag',
    category: "18+",
    playMode: 'online',
    text: "They place their phone camera propped on their pillows and hold your gaze as they bite their lip in pleasure.",
    scenario: "Unfiltered webcam intimacy"
  },
  {
    id: 'on-rf-kids-12',
    gameId: 'red-flag-green-flag',
    category: 'kids',
    playMode: 'online',
    text: "They share secret cheat codes or tricks with you so you can both beat the hard game level.",
    scenario: "Secret game guide sharing"
  }
];


export const ONLINE_RED_FLAG_GREEN_FLAG_PROMPTS: PromptItem[] = [...BASE_ONLINE_RED_FLAG_GREEN_FLAG_PROMPTS, ...ONLINE_RED_FLAG_GREEN_FLAG_EXPANSION];
