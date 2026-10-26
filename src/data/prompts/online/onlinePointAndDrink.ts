import { ONLINE_POINT_AND_DRINK_EXPANSION } from './expansions/onlinePointAndDrinkExpansion';
import { PromptItem } from '../../../types/game';

/**
 * ONLINE POINT AND DRINK PROMPTS
 * Specifically crafted for remote video and voice calls.
 * Players point at webcam tiles on screen or ping names in text chat. Most targeted player drinks!
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
const BASE_ONLINE_POINT_AND_DRINK_PROMPTS: PromptItem[] = [
  // ==========================================
  // EASY (Fun, low-stakes remote pointing)
  // ==========================================
  {
    id: 'on-pad-easy-1',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at the camera tile of whoever is most likely to have 50 empty soda cans or mugs on their desk right now."
  },
  {
    id: 'on-pad-easy-3',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever spends the most time staring at their own camera preview instead of other people's faces."
  },
  {
    id: 'on-pad-easy-5',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever is most likely to show up to a morning video call still wrapped inside a bed blanket."
  },

  // ==========================================
  // MEDIUM (Relatable, slightly awkward remote pointing)
  // ==========================================
  {
    id: 'on-pad-med-1',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever is most likely to type a massive 4-paragraph response in a chat and delete it before sending."
  },
  {
    id: 'on-pad-med-4',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever is most likely to pretend their Wi-Fi died just to get out of an awkward voice call."
  },
  {
    id: 'on-pad-med-5',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever is most likely to accidentally react with the wrong emoji to a serious announcement."
  },
  {
    id: 'on-pad-med-6',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever is most likely to stalk an ex or crush using a burner social media account."
  },
  {
    id: 'on-pad-ext-2',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever is most likely to secretly talk trash about someone in this call in a side DM."
  },
  {
    id: 'on-pad-ext-3',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever is most likely to accidentally share the wrong screen or browser tab during a presentation."
  },
  {
    id: 'on-pad-ext-5',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever is most likely to ghost everyone here for two weeks and act like nothing happened."
  },

  // ==========================================
  // COUPLES (Romantic, intimate, sweet couples pointing)
  // ==========================================
  {
    id: 'on-pad-cpl-1',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at whoever fell in love first during our late-night calls or messages."
  },
  {
    id: 'on-pad-cpl-3',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at whoever takes longer to get ready before we turn our webcams on for virtual date night."
  },

  // ==========================================
  // EXPANDED EASY (Fun, low-stakes remote pointing)
  // ==========================================
  {
    id: 'on-pad-easy-7',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever is most likely to have 20 browser tabs open playing music and can't find which one it is."
  },
  {
    id: 'on-pad-med-8',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever is most likely to hold a 2-hour FaceTime call while lying completely still in bed."
  },
  {
    id: 'on-pad-med-11',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever is most likely to re-read their own sent texts 10 times to admire how funny they are."
  },
  {
    id: 'on-pad-ext-7',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever is most likely to accidentally share their screen with something embarrassing open."
  },
  {
    id: 'on-pad-ext-8',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever is most likely to stalk an ex's social media and accidentally like a 2-year-old post."
  },
  {
    id: 'on-pad-cpl-6',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at whoever falls asleep first when watching a movie together on screen-share."
  },

  // Couples:
  {
    id: 'on-pad-cpl-9',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at who falls asleep first when we stay on call together late at night."
  },
  {
    id: 'on-pad-cpl-10',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at who says 'I miss you' first during a long workday apart."
  },
  {
    id: 'on-pad-cpl-12',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at who planned our first virtual date or sent the first sweet message."
  }
];


export const ONLINE_POINT_AND_DRINK_PROMPTS: PromptItem[] = [...BASE_ONLINE_POINT_AND_DRINK_PROMPTS, ...ONLINE_POINT_AND_DRINK_EXPANSION];
