import { ONLINE_CONFESSIONS_EXPANSION } from './expansions/onlineConfessionsExpansion';
import { PromptItem } from '../../../types/game';

/**
 * ONLINE CONFESSIONS PROMPTS (105+ High-Quality Remote Prompts)
 * Specifically crafted for remote video and voice calls.
 * Every card features an engaging remote dilemma and a confession starter.
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
const BASE_ONLINE_CONFESSIONS_PROMPTS: PromptItem[] = [
  // ==========================================
  // EASY (Light, funny, low-stakes digital secrets)
  // ==========================================
  { id: 'on-cnf-easy-1', gameId: 'confessions', category: 'easy', playMode: 'online', text: "What is an online video or game you secretly spent over 100 hours on that you hide from friends?", confessionStarter: "I secretly sank over 100 hours into..." },
  { id: 'on-cnf-easy-9', gameId: 'confessions', category: 'easy', playMode: 'online', text: "Have you ever pretended you didn't see someone's DM for 3 hours just because you didn't feel like typing?", confessionStarter: "I left you on delivered because..." },
  { id: 'on-cnf-easy-14', gameId: 'confessions', category: 'easy', playMode: 'online', text: "Have you ever nodded along in a video call pretending you understood something when you had zero clue?", confessionStarter: "I nodded along pretending I understood..." },
  { id: 'on-cnf-med-3', gameId: 'confessions', category: 'medium', playMode: 'online', text: "Have you ever pretended your Wi-Fi cut out during a call just to avoid answering a difficult question?", confessionStarter: "I faked a disconnected call when..." },
  { id: 'on-cnf-med-4', gameId: 'confessions', category: 'medium', playMode: 'online', text: "What is an assumption you made about someone in this call when you first saw their profile that was totally wrong?", confessionStarter: "I first thought you were..." },
  { id: 'on-cnf-med-5', gameId: 'confessions', category: 'medium', playMode: 'online', text: "Have you ever stalked an ex or crush's Spotify or Discord status to see who they were listening with?", confessionStarter: "I checked your status at 2 AM to see..." },
  { id: 'on-cnf-med-8', gameId: 'confessions', category: 'medium', playMode: 'online', text: "Have you ever looked up someone on this call's social media history before you ever had a real conversation with them?", confessionStarter: "I deep-dived your profile before we spoke and saw..." },
  { id: 'on-cnf-med-9', gameId: 'confessions', category: 'medium', playMode: 'online', text: "What is a gift or online game code someone bought for you that you secretly hated or never used?", confessionStarter: "I never touched that gift because..." },
  { id: 'on-cnf-med-10', gameId: 'confessions', category: 'medium', playMode: 'online', text: "Have you ever sent a fake screenshot or edited a photo to get out of hanging out online?", confessionStarter: "I faked a screenshot showing..." },
  { id: 'on-cnf-med-12', gameId: 'confessions', category: 'medium', playMode: 'online', text: "Have you ever stayed in a voice call on deafen just so you looked like you were part of the group?", confessionStarter: "I deafened for an hour because..." },

  // ==========================================
  // EXTREME (High voltage, tense confessions)
  // ==========================================
  { id: 'on-cnf-ext-1', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "What is something you saw or overheard in a voice call when someone forgot to mute that you never told them?", confessionStarter: "I heard you say when you thought you were muted..." },
  { id: 'on-cnf-ext-9', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "What is the worst lie you ever told to cover up your whereabouts while staying home on Discord?", confessionStarter: "I lied to my family saying I was..." },
  { id: 'on-cnf-unh-2', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is the weirdest thing you've ever done at your desk while completely forgetting your webcam was on?", confessionStarter: "I once forgot my camera was on and..." },
  { id: 'on-cnf-unh-3', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is the most unhinged impulse purchase you made at 4 AM that arrived in the mail a week later?", confessionStarter: "I drunkenly ordered a..." },
  { id: 'on-cnf-unh-4', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is an imaginary argument you had out loud while home alone that you still get worked up about?", confessionStarter: "I had a full screaming match with..." },
  { id: 'on-cnf-unh-10', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "Have you ever typed a full emotional diary entry into an unsent Discord DM to an inactive bot?", confessionStarter: "I poured my soul into a DM to a bot about..." },
  { id: 'on-cnf-unh-13', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "If you had to reveal what is currently sitting on your computer desktop right now, how messy is it?", confessionStarter: "My desktop currently contains 400 icons of..." },
  { id: 'on-cnf-cpl-4', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What was the first thing that made you realize I was more than just a friend online?", confessionStarter: "I knew I wanted you when..." },
  { id: 'on-cnf-cpl-6', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What is a moment where you felt an overwhelming urge to jump through the screen and kiss me?", confessionStarter: "I wanted so badly to kiss you when..." },
  { id: 'on-cnf-cpl-7', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What is something sweet I said in a late-night call that you replay in your mind when lonely?", confessionStarter: "I still remember when you whispered..." },
  { id: 'on-cnf-cpl-8', gameId: 'confessions', category: 'couples', playMode: 'online', text: "Have you ever smelled your own shirt or blanket and wished it carried my scent after a call?", confessionStarter: "After we hung up, I wished my room smelled like..." },
  { id: 'on-cnf-cpl-9', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What song in your playlist reminds you so powerfully of me that you have to pause whatever you're doing?", confessionStarter: "That song always makes me ache for you because..." },
  { id: 'on-cnf-cpl-10', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What is the sweetest thing you have ever written about me in your private journal or notes app?", confessionStarter: "I wrote in my notes that you are..." },
  { id: 'on-cnf-cpl-11', gameId: 'confessions', category: 'couples', playMode: 'online', text: "Have you ever stayed awake on call just watching me sleep because you felt so peaceful?", confessionStarter: "I watched you sleep on webcam and thought..." },
  { id: 'on-cnf-18-6', gameId: 'confessions', category: '18+', playMode: 'online', text: "What is an adult fantasy you have that you have never confessed to any partner in real life?", confessionStarter: "My deepest unconfessed fantasy is..." },

  // ==========================================
  // SPICY (Sensual, explicit erotic confessions)
  // ==========================================
  { id: 'on-cnf-spicy-1', gameId: 'confessions', category: "18+", playMode: 'online', text: "What is the dirtiest thing someone has ever said to you over a voice call or phone that made you weak in the knees?", confessionStarter: "The hottest thing whispered into my ear was..." },
  { id: 'on-cnf-spicy-2', gameId: 'confessions', category: "18+", playMode: 'online', text: "Describe what you do when you get turned on late at night while on a video or voice call.", confessionStarter: "When I get turned on late at night on call, I..." },
  { id: 'on-cnf-spicy-10', gameId: 'confessions', category: "18+", playMode: 'online', text: "What is the most sensitive erotic spot on your body that you touch when listening to dirty audio?", confessionStarter: "I find myself touching my..." },
  { id: 'on-cnf-kids-11', gameId: 'confessions', category: 'kids', playMode: 'online', text: "What is the messiest thing you ever spilled near your computer that you wiped up before anyone noticed?", confessionStarter: "I accidentally spilled..." },
  { id: 'on-cnf-kids-12', gameId: 'confessions', category: 'kids', playMode: 'online', text: "What is a funny dance you do when you open a super lucky pack in a video game?", confessionStarter: "My lucky victory dance looks like..." },
  { id: 'on-cnf-kids-13', gameId: 'confessions', category: 'kids', playMode: 'online', text: "If you had a robot butler, what silly chore would you order it to do every single morning?", confessionStarter: "I would make my robot butler..." }
];


export const ONLINE_CONFESSIONS_PROMPTS: PromptItem[] = [...BASE_ONLINE_CONFESSIONS_PROMPTS, ...ONLINE_CONFESSIONS_EXPANSION];
