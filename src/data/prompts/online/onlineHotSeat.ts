import { ONLINE_HOT_SEAT_EXPANSION } from './expansions/onlineHotSeatExpansion';
import { PromptItem } from '../../../types/game';

/**
 * ONLINE HOT SEAT PROMPTS (105+ High-Quality Remote Prompts)
 * Specifically crafted for remote video and voice calls where one player is grilled with intense questions.
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
const BASE_ONLINE_HOT_SEAT_PROMPTS: PromptItem[] = [
  // ==========================================
  // EASY (Light, funny, low-pressure remote spotlight)
  // ==========================================
  { id: 'on-hs-easy-1', gameId: 'hot-seat', category: 'easy', playMode: 'online', text: "Hot Seat: What is the single most embarrassing item visible on your desk or room wall right now?" },
  { id: 'on-hs-easy-2', gameId: 'hot-seat', category: 'easy', playMode: 'online', text: "Hot Seat: If you could swap computer setups and gaming rigs with anyone in this call, whose would you pick?" },
  { id: 'on-hs-easy-3', gameId: 'hot-seat', category: 'easy', playMode: 'online', text: "Hot Seat: What song do you play when you're cleaning your room that would completely ruin your cool reputation?" },
  { id: 'on-hs-easy-7', gameId: 'hot-seat', category: 'easy', playMode: 'online', text: "Hot Seat: What is a TV commercial jingle or meme phrase that lives rent-free in your head 24/7?" },
  { id: 'on-hs-easy-8', gameId: 'hot-seat', category: 'easy', playMode: 'online', text: "Hot Seat: How many hours of sleep did you actually get last night before jumping onto your computer?" },
  { id: 'on-hs-easy-11', gameId: 'hot-seat', category: 'easy', playMode: 'online', text: "Hot Seat: Which person in this call do you think has the most soothing voice to listen to?" },
  { id: 'on-hs-easy-13', gameId: 'hot-seat', category: 'easy', playMode: 'online', text: "Hot Seat: If your pet could talk on this microphone right now, what is the first secret it would expose?" },
  { id: 'on-hs-easy-14', gameId: 'hot-seat', category: 'easy', playMode: 'online', text: "Hot Seat: What is a hobby you tried picking up from TikTok or YouTube that you gave up on in 2 days?" },

  // ==========================================
  // MEDIUM (Mildly awkward, personal remote grilling)
  // ==========================================
  { id: 'on-hs-med-1', gameId: 'hot-seat', category: 'medium', playMode: 'online', text: "Hot Seat: What was your honest first impression of everyone in this call when you first met them online?" },
  { id: 'on-hs-med-2', gameId: 'hot-seat', category: 'medium', playMode: 'online', text: "Hot Seat: Have you ever muted someone in this call or lowered their user volume because they talk too much?" },
  { id: 'on-hs-med-3', gameId: 'hot-seat', category: 'medium', playMode: 'online', text: "Hot Seat: Who in this call do you secretly think has the most questionable taste in music or movies?" },
  { id: 'on-hs-med-4', gameId: 'hot-seat', category: 'medium', playMode: 'online', text: "Hot Seat: What is an opinion you hold about someone here that you have never typed in chat?" },
  { id: 'on-hs-med-5', gameId: 'hot-seat', category: 'medium', playMode: 'online', text: "Hot Seat: Have you ever faked being busy or having computer problems to decline playing with someone in this call?" },
  { id: 'on-hs-med-7', gameId: 'hot-seat', category: 'medium', playMode: 'online', text: "Hot Seat: Who on this call do you think spends the most unhealthy amount of money on microtransactions?" },
  { id: 'on-hs-med-10', gameId: 'hot-seat', category: 'medium', playMode: 'online', text: "Hot Seat: Have you ever stalked an ex's new partner on social media to compare yourself to them?" },
  { id: 'on-hs-med-11', gameId: 'hot-seat', category: 'medium', playMode: 'online', text: "Hot Seat: If you had to kick one person out of this voice channel right now, who would you choose and why?" },
  { id: 'on-hs-med-12', gameId: 'hot-seat', category: 'medium', playMode: 'online', text: "Hot Seat: What is something you lie about on your online profiles to sound cooler than you are?" },

  // ==========================================
  // EXTREME (High-voltage psychological tension)
  // ==========================================
  { id: 'on-hs-ext-1', gameId: 'hot-seat', category: 'extreme', playMode: 'online', text: "Hot Seat: If you were forced to block one person from this call across all social media forever, who would it be?" },
  { id: 'on-hs-ext-2', gameId: 'hot-seat', category: 'extreme', playMode: 'online', text: "Hot Seat: What is the most manipulative thing you have ever done to get someone's attention online?" },
  { id: 'on-hs-ext-3', gameId: 'hot-seat', category: 'extreme', playMode: 'online', text: "Hot Seat: What is the worst secret you know about someone in this call that you promised to take to your grave?" },
  { id: 'on-hs-ext-4', gameId: 'hot-seat', category: 'extreme', playMode: 'online', text: "Hot Seat: What is the most scandalous DM currently sitting in your message inbox right now?" },
  { id: 'on-hs-ext-5', gameId: 'hot-seat', category: 'extreme', playMode: 'online', text: "Hot Seat: What is the harshest thing you have ever thought about someone in this call during an argument?" },
  { id: 'on-hs-ext-6', gameId: 'hot-seat', category: 'extreme', playMode: 'online', text: "Hot Seat: What is the single biggest secret about your digital life that would shock your family?" },
  { id: 'on-hs-ext-7', gameId: 'hot-seat', category: "18+", playMode: 'online', text: "Hot Seat: Have you ever had a secret romantic or sexual situationship with someone in this server circle?" },
  { id: 'on-hs-ext-8', gameId: 'hot-seat', category: 'extreme', playMode: 'online', text: "Hot Seat: What is a piece of blackmail or incriminating evidence you have saved against someone you know?" },
  { id: 'on-hs-ext-9', gameId: 'hot-seat', category: 'extreme', playMode: 'online', text: "Hot Seat: What is the most deceitful lie you ever told someone over call while staring directly into the camera?" },
  { id: 'on-hs-ext-11', gameId: 'hot-seat', category: 'extreme', playMode: 'online', text: "Hot Seat: What was the real reason behind the most painful falling-out you had with an online friend?" },
  { id: 'on-hs-ext-12', gameId: 'hot-seat', category: 'extreme', playMode: 'online', text: "Hot Seat: Have you ever felt intense jealousy watching two other people in this circle get closer than you?" },
  { id: 'on-hs-ext-13', gameId: 'hot-seat', category: 'extreme', playMode: 'online', text: "Hot Seat: Rank everyone on this call in order of who you trust the most to who you trust the least." },

  // ==========================================
  // COUPLES (Deep emotional connection, romance)
  // ==========================================
  { id: 'on-hs-cpl-1', gameId: 'hot-seat', category: 'couples', playMode: 'online', text: "Hot Seat: What is the moment on video call where you realized I was the one you wanted to be with?" },
  { id: 'on-hs-cpl-4', gameId: 'hot-seat', category: 'couples', playMode: 'online', text: "Hot Seat: What is the exact moment during our voice or video calls when you realized you were hopelessly in love?" },
  { id: 'on-hs-cpl-7', gameId: 'hot-seat', category: 'couples', playMode: 'online', text: "Hot Seat: When was a time you felt so safe in my presence on call that all your stress completely vanished?" },
  { id: 'on-hs-cpl-11', gameId: 'hot-seat', category: 'couples', playMode: 'online', text: "Hot Seat: What song makes you ache to be in my arms the moment you hear the first note?" },
  { id: 'on-hs-cpl-13', gameId: 'hot-seat', category: 'couples', playMode: 'online', text: "Hot Seat: What is a dream you had about us that made you smile the entire next morning?" },

  // ==========================================
  // 18+ (Adult, uncensored, provocative grilling)
  // ==========================================
  { id: 'on-hs-18-1', gameId: 'hot-seat', category: '18+', playMode: 'online', text: "Hot Seat: What is the most scandalous photo or video currently saved in your camera roll's hidden folder?" },
  { id: 'on-hs-18-2', gameId: 'hot-seat', category: '18+', playMode: 'online', text: "Hot Seat: Have you ever been caught doing something sexual while on an active video or voice call?" },
  { id: 'on-hs-18-4', gameId: 'hot-seat', category: '18+', playMode: 'online', text: "Hot Seat: What is your most intense, taboo sexual fantasy that you've never dared to say out loud?" },
  { id: 'on-hs-18-6', gameId: 'hot-seat', category: '18+', playMode: 'online', text: "Hot Seat: Have you ever used an adult webcam site or spicy chat service late at night when lonely?" },
  { id: 'on-hs-18-9', gameId: 'hot-seat', category: '18+', playMode: 'online', text: "Hot Seat: Have you ever had cybersex or spicy phone calls with someone you never met in person?" },
  { id: 'on-hs-18-13', gameId: 'hot-seat', category: '18+', playMode: 'online', text: "Hot Seat: What is the dirtiest phrase someone could whisper into your headset to make you lose your mind?" },
  { id: 'on-hs-spicy-6', gameId: 'hot-seat', category: "18+", playMode: 'online', text: "Hot Seat: What is the filthiest thing you have ever done with your hands while looking into a webcam lens?" },
  { id: 'on-hs-spicy-8', gameId: 'hot-seat', category: "18+", playMode: 'online', text: "Hot Seat: What is an explicit kink you indulge in when you're alone in your bedroom that nobody knows?" },
  { id: 'on-hs-spicy-9', gameId: 'hot-seat', category: "18+", playMode: 'online', text: "Hot Seat: Have you ever used an adult toy while in a voice call and timed your climax to the end of a round?" },
  { id: 'on-hs-spicy-13', gameId: 'hot-seat', category: "18+", playMode: 'online', text: "Hot Seat: How many times in a single night have you made yourself reach climax during an intense session?" },
  { id: 'on-hs-kids-4', gameId: 'hot-seat', category: 'kids', playMode: 'online', text: "Hot Seat: If you could have any wild animal as a trained household pet, what would you choose?" },
  { id: 'on-hs-kids-6', gameId: 'hot-seat', category: 'kids', playMode: 'online', text: "Hot Seat: If you could build an amusement park ride in your backyard, what kind of ride would it be?" },
  { id: 'on-hs-kids-7', gameId: 'hot-seat', category: 'kids', playMode: 'online', text: "Hot Seat: What is the funniest joke you know by heart? Tell it to the group right now!" },
  { id: 'on-hs-kids-8', gameId: 'hot-seat', category: 'kids', playMode: 'online', text: "Hot Seat: If your toys came alive like Toy Story, which toy would be the leader of the room?" }
];


export const ONLINE_HOT_SEAT_PROMPTS: PromptItem[] = [...BASE_ONLINE_HOT_SEAT_PROMPTS, ...ONLINE_HOT_SEAT_EXPANSION];
