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
    text: "Point at whoever has the coolest toys or gaming setup in their room or webcam background!"
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
    id: 'on-pad-easy-8',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever has the cleanest desk setup right now on webcam."
  },
  {
    id: 'on-pad-easy-9',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever is most likely to type a message with capslock on and not notice."
  },
  {
    id: 'on-pad-easy-10',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever sends the best reaction memes in group chats."
  },
  {
    id: 'on-pad-easy-11',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever is most likely to eat cereal out of a giant mixing bowl."
  },

  // ==========================================
  // EXPANDED MEDIUM (Relatable webcam pointing)
  // ==========================================
  {
    id: 'on-pad-med-7',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever spends the most money on food delivery apps each month."
  },
  {
    id: 'on-pad-med-8',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever is most likely to hold a 2-hour FaceTime call while lying completely still in bed."
  },
  {
    id: 'on-pad-med-9',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever has the most chaotic camera angle right now."
  },
  {
    id: 'on-pad-med-10',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever is most likely to forget someone's birthday despite seeing it on their calendar."
  },
  {
    id: 'on-pad-med-11',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever is most likely to re-read their own sent texts 10 times to admire how funny they are."
  },

  // ==========================================
  // EXPANDED EXTREME (High-stakes digital pointing)
  // ==========================================
  {
    id: 'on-pad-ext-6',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever has the darkest or most unhinged internet search history right now."
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
    id: 'on-pad-ext-9',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever is most likely to ghost an entire friend group for 3 weeks when overwhelmed."
  },
  {
    id: 'on-pad-ext-10',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever would crack first under intense interrogation about their group chat history."
  },

  // ==========================================
  // EXPANDED UNHINGED (Chaotic remote targets)
  // ==========================================
  {
    id: 'on-pad-unh-5',
    gameId: 'point-and-drink',
    category: 'unhinged',
    playMode: 'online',
    text: "Point at whoever is most likely to stay in a Discord voice channel completely silent for 6 hours."
  },
  {
    id: 'on-pad-unh-6',
    gameId: 'point-and-drink',
    category: 'unhinged',
    playMode: 'online',
    text: "Point at whoever is most likely to buy a completely absurd $200 gadget on TikTok shop at 3 AM."
  },
  {
    id: 'on-pad-unh-7',
    gameId: 'point-and-drink',
    category: 'unhinged',
    playMode: 'online',
    text: "Point at whoever is most likely to start a fistfight with an NPC in a cozy game."
  },
  {
    id: 'on-pad-unh-8',
    gameId: 'point-and-drink',
    category: 'unhinged',
    playMode: 'online',
    text: "Point at whoever would survive the longest if trapped inside a horror video game."
  },

  // ==========================================
  // EXPANDED COUPLES (Romantic & tender call targets)
  // ==========================================
  {
    id: 'on-pad-cpl-5',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at whoever gets more clingy and affectionate during late-night video calls."
  },
  {
    id: 'on-pad-cpl-6',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at whoever falls asleep first when watching a movie together on screen-share."
  },
  {
    id: 'on-pad-cpl-7',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at whoever is most likely to send a 5-minute good-morning voice note describing their dreams."
  },
  {
    id: 'on-pad-cpl-8',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at whoever would plan the most romantic surprise virtual date night."
  },

  // ==========================================
  // EXPANDED 18+ (Adult late-night dynamics)
  // ==========================================
  {
    id: 'on-pad-18-5',
    gameId: 'point-and-drink',
    category: '18+',
    playMode: 'online',
    text: "Point at whoever has the highest sex drive when communicating late at night online."
  },
  {
    id: 'on-pad-18-6',
    gameId: 'point-and-drink',
    category: '18+',
    playMode: 'online',
    text: "Point at whoever has the spiciest hidden photo folder on their phone right now."
  },
  {
    id: 'on-pad-18-7',
    gameId: 'point-and-drink',
    category: '18+',
    playMode: 'online',
    text: "Point at whoever has the most seductive talking voice over microphone."
  },
  {
    id: 'on-pad-18-8',
    gameId: 'point-and-drink',
    category: '18+',
    playMode: 'online',
    text: "Point at whoever is most likely to have initiated a spicy FaceTime call while intoxicated."
  },

  // ==========================================
  // EXPANDED SPICY (Sensual chemistry & teasing)
  // ==========================================
  {
    id: 'on-pad-spicy-5',
    gameId: 'point-and-drink',
    category: 'spicy',
    playMode: 'online',
    text: "Point at whoever would be the most dominant during a private late-night webcam session."
  },
  {
    id: 'on-pad-spicy-6',
    gameId: 'point-and-drink',
    category: 'spicy',
    playMode: 'online',
    text: "Point at whoever looks the most irresistibly kissable on camera right now."
  },
  {
    id: 'on-pad-spicy-7',
    gameId: 'point-and-drink',
    category: 'spicy',
    playMode: 'online',
    text: "Point at whoever is most likely to send an unprompted spicy tease while sitting in their room."
  },
  {
    id: 'on-pad-spicy-8',
    gameId: 'point-and-drink',
    category: 'spicy',
    playMode: 'online',
    text: "Point at whoever has the biggest flirtatious energy in this call right now."
  },

  // ==========================================
  // EXPANDED KIDS (Pure silly family pointing)
  // ==========================================
  {
    id: 'on-pad-kids-5',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever has the best video game skills in Minecraft or Roblox!"
  },
  {
    id: 'on-pad-kids-6',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever is most likely to eat a whole tub of ice cream without sharing!"
  },
  {
    id: 'on-pad-kids-7',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever does the silliest dance when their favorite song plays!"
  },
  {
    id: 'on-pad-kids-8',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever has the coolest superhero superpower imagination!"
  }
];

