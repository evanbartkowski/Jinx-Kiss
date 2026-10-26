import { ONLINE_TRUTH_OR_DARE_EXPANSION } from './expansions/onlineTruthOrDareExpansion';
import { PromptItem } from '../../../types/game';

/**
 * ONLINE TRUTH OR DARE PROMPTS
 * Specifically crafted for remote interaction over Discord calls, voice chats, webcams, and screen shares.
 * 100% remote: webcam dares, mic forfeits, screen shares, DMs, status changes, and digital truths.
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
const BASE_ONLINE_TRUTH_OR_DARE_PROMPTS: PromptItem[] = [
  { id: 'on-tod-easy-d-2', gameId: 'truth-or-dare', category: 'easy', type: 'dare', playMode: 'online', text: "Put on the most ridiculous piece of headwear or glasses within arm's reach and keep it on for 2 rounds." },
  { id: 'on-tod-easy-d-10', gameId: 'truth-or-dare', category: 'easy', type: 'dare', playMode: 'online', text: "Change your call avatar or Discord profile picture to a funny meme image for the rest of this session." },
  { id: 'on-tod-med-t-3', gameId: 'truth-or-dare', category: 'medium', type: 'truth', playMode: 'online', text: "What is an opinion you hold about someone in this call that you've never dared to say out loud?" },
  { id: 'on-tod-med-t-5', gameId: 'truth-or-dare', category: 'medium', type: 'truth', playMode: 'online', text: "Who in this call do you think spends the most unhealthy amount of daily screen time on their phone?" },
  { id: 'on-tod-med-d-6', gameId: 'truth-or-dare', category: 'medium', type: 'dare', playMode: 'online', text: "Imitate the voice and speech quirks of anyone in this call until someone correctly guesses who you are." },
  { id: 'on-tod-med-t-7', gameId: 'truth-or-dare', category: 'medium', type: 'truth', playMode: 'online', text: "What is a lie you told someone online to avoid jumping on a Discord or FaceTime call with them?" },
  { id: 'on-tod-med-t-8', gameId: 'truth-or-dare', category: 'medium', type: 'truth', playMode: 'online', text: "If you had to delete your social media or block one person from this call forever, what would you choose?" },
  { id: 'on-tod-med-d-8', gameId: 'truth-or-dare', category: 'medium', type: 'dare', playMode: 'online', text: "Set your camera zoom to maximum extreme close-up on your nose or forehead for the next 2 rounds." },
  { id: 'on-tod-ext-d-3', gameId: 'truth-or-dare', category: 'extreme', type: 'dare', playMode: 'online', text: "Turn your webcam on, hold complete eye contact with the camera, and apologize to someone on this call for a real secret grudge." },
  { id: 'on-tod-ext-t-4', gameId: 'truth-or-dare', category: 'extreme', type: 'truth', playMode: 'online', text: "What is a secret about yourself that nobody in this voice channel knows and that would change how they view you?" },

  // ==========================================
  // COUPLES (Romantic, intimate remote connection)
  // ==========================================
  { id: 'on-tod-cpl-t-1', gameId: 'truth-or-dare', category: 'couples', type: 'truth', playMode: 'online', text: "What was the exact moment on a late-night call where you realized you had real feelings for me?" },

  // ==========================================
  // 18+ (Adult, uncensored, risky remote confessions)
  // ==========================================
  { id: 'on-tod-18-t-1', gameId: 'truth-or-dare', category: '18+', type: 'truth', playMode: 'online', text: "Have you ever had phone sex, voice call intimacy, or cybered with someone in this server or circle?" },
  { id: 'on-tod-18-t-2', gameId: 'truth-or-dare', category: '18+', type: 'truth', playMode: 'online', text: "What is the filthiest text or DM you have ever sent that you would die if your parents read?" },
  { id: 'on-tod-18-d-4', gameId: 'truth-or-dare', category: '18+', type: 'dare', playMode: 'online', text: "Remove your jacket or outer shirt on webcam and keep it off for the rest of the game." },
  { id: 'on-tod-spicy-d-2', gameId: 'truth-or-dare', category: "18+", type: 'dare', playMode: 'online', text: "Make a soft sensual moan directly into your mic and look dead into your webcam while doing it." },

  // ==========================================
  // KIDS (Wholesome, silly animal noises, webcam faces)
  // ==========================================
  { id: 'on-tod-kids-t-1', gameId: 'truth-or-dare', category: 'kids', type: 'truth', playMode: 'online', text: "If you could turn into any animal right now on this video call, what animal would you be?" },
  { id: 'on-tod-ext-t-7', gameId: 'truth-or-dare', category: 'extreme', type: 'truth', playMode: 'online', text: "What is a message you sent that you instantly regretted so much you considered faking your own death?" },
  { id: 'on-tod-ext-d-7', gameId: 'truth-or-dare', category: 'extreme', type: 'dare', playMode: 'online', text: "Open your camera roll on screen share and let the group pick one photo that you must post as your profile banner." },
  { id: 'on-tod-ext-d-8', gameId: 'truth-or-dare', category: 'extreme', type: 'dare', playMode: 'online', text: "Call someone in your contacts on speaker right now and say 'I don't have much time, they're watching me' and hang up." },
  { id: 'on-tod-cpl-d-6', gameId: 'truth-or-dare', category: 'couples', type: 'dare', playMode: 'online', text: "Look straight into the lens, describe the exact moment you first knew you wanted to kiss me, and don't look away." },

  // 18+ ADDITIONS
  { id: 'on-tod-18-t-5', gameId: 'truth-or-dare', category: '18+', type: 'truth', playMode: 'online', text: "Have you ever taken a spicy photo or video specifically while sitting at the exact desk you're at right now?" },
  { id: 'on-tod-18-t-6', gameId: 'truth-or-dare', category: '18+', type: 'truth', playMode: 'online', text: "What is the most dangerous or risky place you have ever been intimate or engaged in sexual activity?" },
  { id: 'on-tod-18-d-6', gameId: 'truth-or-dare', category: '18+', type: 'dare', playMode: 'online', text: "Slowly trace your neck down to your collarbone with an ice cube or cold glass while looking into the camera." }
];

export const ONLINE_TRUTH_OR_DARE_PROMPTS: PromptItem[] = [...BASE_ONLINE_TRUTH_OR_DARE_PROMPTS, ...ONLINE_TRUTH_OR_DARE_EXPANSION];
