import { PromptItem } from '../../../types/game';

/**
 * ONLINE POINT AND DRINK PROMPTS
 * Specifically crafted for remote video and voice calls.
 * Players point at webcam tiles on screen or ping names in text chat. Most targeted player drinks!
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
export const ONLINE_POINT_AND_DRINK_PROMPTS: PromptItem[] = [
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
    id: 'on-pad-easy-2',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever is most likely to forget they unmuted their microphone while talking to their pet."
  },
  {
    id: 'on-pad-easy-3',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever spends the most time staring at their own camera preview instead of other people's faces."
  },
  {
    id: 'on-pad-easy-4',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever is most likely to accidentally leave a voice call on all night while asleep."
  },
  {
    id: 'on-pad-easy-5',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever is most likely to show up to a morning video call still wrapped inside a bed blanket."
  },
  {
    id: 'on-pad-easy-6',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever is most likely to accidentally drop their phone directly onto their face in bed."
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
    id: 'on-pad-med-2',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever is most likely to check someone's Spotify listening activity at 3 AM."
  },
  {
    id: 'on-pad-med-3',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever has the highest daily screen time on their phone right now."
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

  // ==========================================
  // EXTREME (High voltage, hot seats, real tension)
  // ==========================================
  {
    id: 'on-pad-ext-1',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever would crack first if their full unedited browser search history was read out loud."
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
    id: 'on-pad-ext-4',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever has the darkest or most unhinged deleted photo folder on their phone."
  },
  {
    id: 'on-pad-ext-5',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever is most likely to ghost everyone here for two weeks and act like nothing happened."
  },

  // ==========================================
  // UNHINGED (Chaotic, absurd, unpredictable targets)
  // ==========================================
  {
    id: 'on-pad-unh-1',
    gameId: 'point-and-drink',
    category: 'unhinged',
    playMode: 'online',
    text: "Point at whoever is most likely to take their laptop into the bathroom and keep playing games while on mute."
  },
  {
    id: 'on-pad-unh-2',
    gameId: 'point-and-drink',
    category: 'unhinged',
    playMode: 'online',
    text: "Point at whoever is most likely to rage-quit a voice call, slam their desk, and punch their mattress."
  },
  {
    id: 'on-pad-unh-3',
    gameId: 'point-and-drink',
    category: 'unhinged',
    playMode: 'online',
    text: "Point at whoever is most likely to start a cult on Discord by accident."
  },
  {
    id: 'on-pad-unh-4',
    gameId: 'point-and-drink',
    category: 'unhinged',
    playMode: 'online',
    text: "Point at whoever is most likely to spend $200 on microtransactions while delirious at 4 AM."
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
    id: 'on-pad-cpl-2',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at whoever sends the sweeter, more dramatic 'good morning' and 'good night' texts."
  },
  {
    id: 'on-pad-cpl-3',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at whoever takes longer to get ready before we turn our webcams on for virtual date night."
  },
  {
    id: 'on-pad-cpl-4',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at whoever misses the other person more when we have to hang up the call."
  },

  // ==========================================
  // 18+ (Mature adult dynamics & dating secrets)
  // ==========================================
  {
    id: 'on-pad-18-1',
    gameId: 'point-and-drink',
    category: '18+',
    playMode: 'online',
    text: "Point at whoever has the highest body count or wildest sexual history in this call."
  },
  {
    id: 'on-pad-18-2',
    gameId: 'point-and-drink',
    category: '18+',
    playMode: 'online',
    text: "Point at whoever is most likely to send a risky spicy photo after midnight."
  },
  {
    id: 'on-pad-18-3',
    gameId: 'point-and-drink',
    category: '18+',
    playMode: 'online',
    text: "Point at whoever has the most specific or freakiest kinks among the group."
  },
  {
    id: 'on-pad-18-4',
    gameId: 'point-and-drink',
    category: '18+',
    playMode: 'online',
    text: "Point at whoever is most likely to have engaged in webcam intimacy with someone on this call."
  },

  // ==========================================
  // SPICY (Sensual, sexually charged pointing)
  // ==========================================
  {
    id: 'on-pad-spicy-1',
    gameId: 'point-and-drink',
    category: 'spicy',
    playMode: 'online',
    text: "Point at whoever gives off the most irresistible sexual energy over voice call."
  },
  {
    id: 'on-pad-spicy-2',
    gameId: 'point-and-drink',
    category: 'spicy',
    playMode: 'online',
    text: "Point at whoever looks the absolute sexiest on webcam tonight."
  },
  {
    id: 'on-pad-spicy-3',
    gameId: 'point-and-drink',
    category: 'spicy',
    playMode: 'online',
    text: "Point at whoever you would pick to have a private 1-on-1 NSFW video call with right now."
  },
  {
    id: 'on-pad-spicy-4',
    gameId: 'point-and-drink',
    category: 'spicy',
    playMode: 'online',
    text: "Point at whoever looks like they know how to drive a partner wild in bed."
  },

  // ==========================================
  // KIDS (Pure fun, silly, family-friendly pointing)
  // ==========================================
  {
    id: 'on-pad-kids-1',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever makes the best cartoon character voices on call!"
  },
  {
    id: 'on-pad-kids-2',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever has the coolest toys or gaming setup in the room!"
  },
  {
    id: 'on-pad-kids-3',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever is most likely to build a giant castle in Minecraft and protect it!"
  },
  {
    id: 'on-pad-kids-4',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever laughs the loudest when someone tells a silly joke!"
  }
];
