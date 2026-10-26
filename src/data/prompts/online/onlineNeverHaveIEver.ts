import { ONLINE_NEVER_HAVE_I_EVER_EXPANSION } from './expansions/onlineNeverHaveIEverExpansion';
import { PromptItem } from '../../../types/game';

/**
 * ONLINE NEVER HAVE I EVER PROMPTS
 * Specifically crafted for remote sessions over Discord, FaceTime, Zoom, and webcam hangouts.
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 * 100% remote-friendly: webcams, microphones, chat, DMs, screen shares, and digital habits.
 */
const BASE_ONLINE_NEVER_HAVE_I_EVER_PROMPTS: PromptItem[] = [
  { id: 'on-nhie-easy-2', gameId: 'never-have-i-ever', category: 'easy', playMode: 'online', text: "Never have I ever accidentally sent an embarrassing voice note to the wrong person." },
  { id: 'on-nhie-easy-3', gameId: 'never-have-i-ever', category: 'easy', playMode: 'online', text: "Never have I ever stared at my own video tile the entire call instead of looking at other people." },
  { id: 'on-nhie-easy-4', gameId: 'never-have-i-ever', category: 'easy', playMode: 'online', text: "Never have I ever hastily shoved dirty laundry out of the camera's frame right before turning my video on." },
  { id: 'on-nhie-easy-5', gameId: 'never-have-i-ever', category: 'easy', playMode: 'online', text: "Never have I ever muted my mic so I could loudly yell at a video game or pet." },

  // ==========================================
  // MEDIUM (Awkward, mildly revealing online habits)
  // ==========================================
  { id: 'on-nhie-med-1', gameId: 'never-have-i-ever', category: 'medium', playMode: 'online', text: "Never have I ever pretended my Wi-Fi crashed or died just to get out of an awkward voice call." },
  { id: 'on-nhie-med-2', gameId: 'never-have-i-ever', category: 'medium', playMode: 'online', text: "Never have I ever stalked someone's Spotify listening activity at 2 AM to see what they were going through." },
  { id: 'on-nhie-med-3', gameId: 'never-have-i-ever', category: 'medium', playMode: 'online', text: "Never have I ever typed out a dramatic paragraph in a group chat and quickly deleted it before hitting send." },
  { id: 'on-nhie-med-5', gameId: 'never-have-i-ever', category: 'medium', playMode: 'online', text: "Never have I ever screenshotted someone's face mid-sentence on webcam to save as a meme or reaction sticker." },
  { id: 'on-nhie-med-6', gameId: 'never-have-i-ever', category: 'medium', playMode: 'online', text: "Never have I ever muted someone's user volume to 5% in Discord because their breathing or chewing annoyed me." },
  { id: 'on-nhie-med-9', gameId: 'never-have-i-ever', category: 'medium', playMode: 'online', text: "Never have I ever stalked an ex's Discord server mutuals to see who they were hanging out with." },
  { id: 'on-nhie-med-10', gameId: 'never-have-i-ever', category: 'medium', playMode: 'online', text: "Never have I ever left someone on 'Read' for days and then replied with 'omg I just saw this'." },
  { id: 'on-nhie-med-11', gameId: 'never-have-i-ever', category: 'medium', playMode: 'online', text: "Never have I ever hopped into a voice channel, heard who was talking, and immediately disconnected within 2 seconds." },
  { id: 'on-nhie-med-13', gameId: 'never-have-i-ever', category: 'medium', playMode: 'online', text: "Never have I ever drafted a message in my Notes app for 30 minutes before copy-pasting it into chat." },
  { id: 'on-nhie-med-14', gameId: 'never-have-i-ever', category: 'medium', playMode: 'online', text: "Never have I ever turned my camera off mid-call specifically so I could roll my eyes without being seen." },

  // ==========================================
  // EXTREME (High voltage, secrets, screen-share panic)
  // ==========================================
  { id: 'on-nhie-ext-1', gameId: 'never-have-i-ever', category: 'extreme', playMode: 'online', text: "Never have I ever thought my microphone was muted and talked massive trash about someone in the call." },
  { id: 'on-nhie-ext-3', gameId: 'never-have-i-ever', category: 'extreme', playMode: 'online', text: "Never have I ever rage-quit a voice call, slammed my headset down on my desk, and cursed out loud." },
  { id: 'on-nhie-ext-5', gameId: 'never-have-i-ever', category: 'extreme', playMode: 'online', text: "Never have I ever joined a voice call completely intoxicated and embarrassed myself in front of a group." },
  { id: 'on-nhie-ext-6', gameId: 'never-have-i-ever', category: 'extreme', playMode: 'online', text: "Never have I ever had someone in this call discover a private account or post I tried to hide from them." },
  { id: 'on-nhie-ext-8', gameId: 'never-have-i-ever', category: 'extreme', playMode: 'online', text: "Never have I ever secretly screen-recorded a video call without the other person's knowledge." },
  { id: 'on-nhie-ext-9', gameId: 'never-have-i-ever', category: 'extreme', playMode: 'online', text: "Never have I ever accidentally forwarded a private vent DM to the exact person I was venting about." },
  { id: 'on-nhie-ext-11', gameId: 'never-have-i-ever', category: 'extreme', playMode: 'online', text: "Never have I ever lied about my age, occupation, or appearance in an online gaming group." },
  { id: 'on-nhie-ext-12', gameId: 'never-have-i-ever', category: 'extreme', playMode: 'online', text: "Never have I ever checked someone's follower list count hourly to see if they were following someone new." },

  // ==========================================
  // UNHINGED (Chaotic, absurd, boundary-pushing)
  // ==========================================
  { id: 'on-nhie-unh-1', gameId: 'never-have-i-ever', category: 'unhinged', playMode: 'online', text: "Never have I ever brought my laptop into the bathroom and muted my mic to take a dump during a call." },
  { id: 'on-nhie-unh-4', gameId: 'never-have-i-ever', category: 'unhinged', playMode: 'online', text: "Never have I ever stayed up past 4 AM arguing with complete strangers in Reddit or YouTube comments." },
  { id: 'on-nhie-unh-6', gameId: 'never-have-i-ever', category: 'unhinged', playMode: 'online', text: "Never have I ever ordered fast food delivery past 2 AM while already lying in bed with my headset on." },
  { id: 'on-nhie-unh-8', gameId: 'never-have-i-ever', category: 'unhinged', playMode: 'online', text: "Never have I ever pretended to have a dramatic life crisis just to see who in the server would DM me." },
  { id: 'on-nhie-unh-10', gameId: 'never-have-i-ever', category: 'unhinged', playMode: 'online', text: "Never have I ever muted myself to eat an entire bag of chips with my mouth directly on the microphone." },

  // ==========================================
  // COUPLES (Vulnerable, intimate remote romance)
  // ==========================================
  { id: 'on-nhie-cpl-1', gameId: 'never-have-i-ever', category: 'couples', playMode: 'online', text: "Never have I ever fallen asleep on FaceTime or call with you just to feel like you were sleeping next to me." },
  { id: 'on-nhie-cpl-2', gameId: 'never-have-i-ever', category: 'couples', playMode: 'online', text: "Never have I ever re-read our old text messages from months ago while smiling like an idiot in bed." },
  { id: 'on-nhie-cpl-4', gameId: 'never-have-i-ever', category: 'couples', playMode: 'online', text: "Never have I ever gotten dressed up and put on perfume or cologne just for a late-night video call with you." },
  { id: 'on-nhie-cpl-5', gameId: 'never-have-i-ever', category: 'couples', playMode: 'online', text: "Never have I ever listened to a voice note from you 5 times in a row because I missed your voice." },
  { id: 'on-nhie-18-2', gameId: 'never-have-i-ever', category: '18+', playMode: 'online', text: "Never have I ever gotten off or masturbated within 5 minutes of ending a voice call with someone in this circle." },
  { id: 'on-nhie-18-6', gameId: 'never-have-i-ever', category: '18+', playMode: 'online', text: "Never have I ever accidentally sent a spicy photo to the wrong contact or group chat." },

  // ==========================================
  // KIDS (Wholesome, funny, family-friendly remote moments)
  // ==========================================
  { id: 'on-nhie-kids-1', gameId: 'never-have-i-ever', category: 'kids', playMode: 'online', text: "Never have I ever made a super silly frog face at the webcam when no one was looking." },
  { id: 'on-nhie-kids-2', gameId: 'never-have-i-ever', category: 'kids', playMode: 'online', text: "Never have I ever put my face right up against the camera so all you could see was one giant eyeball." },
  { id: 'on-nhie-kids-4', gameId: 'never-have-i-ever', category: 'kids', playMode: 'online', text: "Never have I ever built a huge blanket fort in my room and played games from inside it." },
  { id: 'on-nhie-kids-5', gameId: 'never-have-i-ever', category: 'kids', playMode: 'online', text: "Never have I ever played video games in my pajamas until 11 in the morning on a weekend." },

  // ADDITIONAL EXTREME
  { id: 'on-nhie-ext-13', gameId: 'never-have-i-ever', category: 'extreme', playMode: 'online', text: "Never have I ever accidentally shared the wrong screen monitor during a group call and showed something personal." },
  { id: 'on-nhie-ext-14', gameId: 'never-have-i-ever', category: 'extreme', playMode: 'online', text: "Never have I ever stayed up past 6 AM on call with someone while promising 'I am going to sleep in 5 minutes' every hour." },
  { id: 'on-nhie-ext-15', gameId: 'never-have-i-ever', category: 'extreme', playMode: 'online', text: "Never have I ever stalked someone's location or live status so closely that I knew their exact schedule." },
  { id: 'on-nhie-unh-13', gameId: 'never-have-i-ever', category: 'unhinged', playMode: 'online', text: "Never have I ever ordered midnight takeout for delivery while already in the middle of eating another meal on call." },

  // ADDITIONAL COUPLES
  { id: 'on-nhie-cpl-11', gameId: 'never-have-i-ever', category: 'couples', playMode: 'online', text: "Never have I ever kept a call connected for over 12 hours straight just to be in each other's presence." },
  { id: 'on-nhie-cpl-12', gameId: 'never-have-i-ever', category: 'couples', playMode: 'online', text: "Never have I ever synced up our music or video stream so we could experience the exact same beat together." },
  { id: 'on-nhie-18-12', gameId: 'never-have-i-ever', category: '18+', playMode: 'online', text: "Never have I ever whispered into the mic to describe what I was imagining doing to someone on this call." }
];

export const ONLINE_NEVER_HAVE_I_EVER_PROMPTS: PromptItem[] = [...BASE_ONLINE_NEVER_HAVE_I_EVER_PROMPTS, ...ONLINE_NEVER_HAVE_I_EVER_EXPANSION];
