import { ONLINE_MOST_LIKELY_TO_EXPANSION } from './expansions/onlineMostLikelyToExpansion';
import { PromptItem } from '../../../types/game';

/**
 * ONLINE MOST LIKELY TO PROMPTS (105+ High-Quality Remote Prompts)
 * Specifically crafted for Discord calls, voice chats, webcams, and group hangouts.
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
const BASE_ONLINE_MOST_LIKELY_TO_PROMPTS: PromptItem[] = [
  { id: 'on-mlt-easy-8', gameId: 'most-likely-to', category: 'easy', playMode: 'online', text: "Who is most likely to show up to a Discord game night wearing full pajamas and a blanket?" },
  { id: 'on-mlt-easy-9', gameId: 'most-likely-to', category: 'easy', playMode: 'online', text: "Who is most likely to have a custom RGB keyboard that sounds like a machine gun on call?" },
  { id: 'on-mlt-easy-10', gameId: 'most-likely-to', category: 'easy', playMode: 'online', text: "Who is most likely to get lost in a video game map for an hour while ignoring all teammates?" },
  { id: 'on-mlt-easy-12', gameId: 'most-likely-to', category: 'easy', playMode: 'online', text: "Who is most likely to accidentally join a call with their webcam pointing directly at their ceiling fan?" },
  { id: 'on-mlt-easy-14', gameId: 'most-likely-to', category: 'easy', playMode: 'online', text: "Who is most likely to send a picture of their pet into the chat at least twice a day?" },
  { id: 'on-mlt-med-3', gameId: 'most-likely-to', category: 'medium', playMode: 'online', text: "Who is most likely to accidentally send a private gossip text into the group chat it was about?" },
  { id: 'on-mlt-med-5', gameId: 'most-likely-to', category: 'medium', playMode: 'online', text: "Who is most likely to check someone's Spotify listening status at 3 AM to see what they're feeling?" },
  { id: 'on-mlt-med-8', gameId: 'most-likely-to', category: 'medium', playMode: 'online', text: "Who is most likely to accidentally react with the heart emoji to a message they meant to ignore?" },
  { id: 'on-mlt-med-10', gameId: 'most-likely-to', category: 'medium', playMode: 'online', text: "Who is most likely to stalk an acquaintance's LinkedIn profile and panic if they see the view notification?" },
  { id: 'on-mlt-med-11', gameId: 'most-likely-to', category: 'medium', playMode: 'online', text: "Who is most likely to rage-quit a group chat, cool off for an hour, and ask to be added back?" },
  { id: 'on-mlt-med-13', gameId: 'most-likely-to', category: 'medium', playMode: 'online', text: "Who is most likely to screenshot a text conversation and send it to three different group chats for advice?" },
  { id: 'on-mlt-ext-3', gameId: 'most-likely-to', category: 'extreme', playMode: 'online', text: "Who is most likely to have an unsent, deleted emotional paragraph sitting in their notes app right now?" },
  { id: 'on-mlt-ext-4', gameId: 'most-likely-to', category: 'extreme', playMode: 'online', text: "Who is most likely to panic if forced to show their weekly screen time breakdown live on call?" },
  { id: 'on-mlt-ext-5', gameId: 'most-likely-to', category: 'extreme', playMode: 'online', text: "Who is most likely to secretly talk trash about someone in this call in a side DM window?" },
  { id: 'on-mlt-ext-9', gameId: 'most-likely-to', category: 'extreme', playMode: 'online', text: "Who is most likely to have a secret Discord account that nobody in their real life knows about?" },
  { id: 'on-mlt-ext-10', gameId: 'most-likely-to', category: 'extreme', playMode: 'online', text: "Who is most likely to leak an inside joke to someone outside the circle and ruin the fun?" },
  { id: 'on-mlt-ext-11', gameId: 'most-likely-to', category: 'extreme', playMode: 'online', text: "Who is most likely to fake sick just to binge an entire new season of a show online?" },
  { id: 'on-mlt-ext-12', gameId: 'most-likely-to', category: 'extreme', playMode: 'online', text: "Who is most likely to have an ongoing feud with an online stranger that they take deadly seriously?" },

  // ==========================================
  // UNHINGED (Chaotic, absurd, boundary-pushing)
  // ==========================================
  { id: 'on-mlt-unh-1', gameId: 'most-likely-to', category: 'unhinged', playMode: 'online', text: "Who is most likely to join a Discord call from the bathroom while claiming they're just washing dishes?" },
  { id: 'on-mlt-unh-3', gameId: 'most-likely-to', category: 'unhinged', playMode: 'online', text: "Who is most likely to spend an entire month's rent on a virtual game skin or anime collectible?" },
  { id: 'on-mlt-unh-7', gameId: 'most-likely-to', category: 'unhinged', playMode: 'online', text: "Who is most likely to order $80 worth of fast food delivery to eat completely alone at 3 AM?" },
  { id: 'on-mlt-unh-9', gameId: 'most-likely-to', category: 'unhinged', playMode: 'online', text: "Who is most likely to convince an entire online lobby of strangers that they are an undercover celebrity?" },
  { id: 'on-mlt-unh-13', gameId: 'most-likely-to', category: 'unhinged', playMode: 'online', text: "Who is most likely to adopt an absurd fake British accent and refuse to break character for a week?" },
  { id: 'on-mlt-cpl-6', gameId: 'most-likely-to', category: 'couples', playMode: 'online', text: "Who is most likely to send a spontaneous 3-minute voice note singing an acoustic song to their partner?" },
  { id: 'on-mlt-cpl-11', gameId: 'most-likely-to', category: 'couples', playMode: 'online', text: "Who remembers the exact anniversary of the first Discord call or text message?" },
  { id: 'on-mlt-18-2', gameId: 'most-likely-to', category: '18+', playMode: 'online', text: "Who is most likely to have hooked up with someone they originally met in a gaming Discord server?" },
  { id: 'on-mlt-kids-5', gameId: 'most-likely-to', category: 'kids', playMode: 'online', text: "Who is most likely to build a secret treehouse or blanket fort inside their room?" },
  { id: 'on-mlt-kids-9', gameId: 'most-likely-to', category: 'kids', playMode: 'online', text: "Who is most likely to get so excited about winning a Roblox game that they bounce on their bed?" },
  { id: 'on-mlt-kids-12', gameId: 'most-likely-to', category: 'kids', playMode: 'online', text: "Who is most likely to try and teach their dog or cat how to play the computer keyboard?" }
];


export const ONLINE_MOST_LIKELY_TO_PROMPTS: PromptItem[] = [...BASE_ONLINE_MOST_LIKELY_TO_PROMPTS, ...ONLINE_MOST_LIKELY_TO_EXPANSION];
