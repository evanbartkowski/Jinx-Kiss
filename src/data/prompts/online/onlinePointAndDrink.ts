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
  },

  // --- ADDITIONAL ONLINE POINT AND DRINK EXPANSION (100+ PROMPTS) ---
  // Easy:
  {
    id: 'on-pad-easy-12',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever is most likely to accidentally talk for 2 full minutes while muted on Discord."
  },
  {
    id: 'on-pad-easy-13',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever has the cleanest, most minimalist desk setup visible on webcam."
  },
  {
    id: 'on-pad-easy-14',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever sends the best memes and reaction videos in the group chat."
  },
  {
    id: 'on-pad-easy-15',
    gameId: 'point-and-drink',
    category: 'easy',
    playMode: 'online',
    text: "Point at whoever is currently drinking the fanciest or most caffeinated drink."
  },

  // Medium:
  {
    id: 'on-pad-med-12',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever is most likely to leave you on 'read' while posting actively on social media."
  },
  {
    id: 'on-pad-med-13',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever has the most chaotic, unhinged search history right this second."
  },
  {
    id: 'on-pad-med-14',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever you would trust the least with your unlocked computer."
  },
  {
    id: 'on-pad-med-15',
    gameId: 'point-and-drink',
    category: 'medium',
    playMode: 'online',
    text: "Point at whoever is secretly multi-tasking and playing a game or watching a stream right now."
  },

  // Extreme:
  {
    id: 'on-pad-ext-11',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever has the most dramatic, messy relationship history in this circle."
  },
  {
    id: 'on-pad-ext-12',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever would fold and spill everyone's secrets first under FBI interrogation."
  },
  {
    id: 'on-pad-ext-13',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever is most likely to secretly talk about people in this call behind their backs."
  },
  {
    id: 'on-pad-ext-14',
    gameId: 'point-and-drink',
    category: 'extreme',
    playMode: 'online',
    text: "Point at whoever has sent a screenshot of a private conversation to the wrong person before."
  },

  // Unhinged:
  {
    id: 'on-pad-unh-9',
    gameId: 'point-and-drink',
    category: 'unhinged',
    playMode: 'online',
    text: "Point at whoever gives off the strongest chaotic energy and stays up until 6 AM for no reason."
  },
  {
    id: 'on-pad-unh-10',
    gameId: 'point-and-drink',
    category: 'unhinged',
    playMode: 'online',
    text: "Point at whoever is most likely to accidentally scream into their mic in an intense gaming lobby."
  },
  {
    id: 'on-pad-unh-11',
    gameId: 'point-and-drink',
    category: 'unhinged',
    playMode: 'online',
    text: "Point at whoever is most likely to believe in bizarre alien conspiracies they learned on TikTok."
  },
  {
    id: 'on-pad-unh-12',
    gameId: 'point-and-drink',
    category: 'unhinged',
    playMode: 'online',
    text: "Point at whoever would eat expired leftover takeout from 4 days ago without checking it."
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
    id: 'on-pad-cpl-11',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at who is more dramatic and pouty when they don't get enough attention on FaceTime."
  },
  {
    id: 'on-pad-cpl-12',
    gameId: 'point-and-drink',
    category: 'couples',
    playMode: 'online',
    text: "Point at who planned our first virtual date or sent the first sweet message."
  },

  // 18+:
  {
    id: 'on-pad-18-9',
    gameId: 'point-and-drink',
    category: '18+',
    playMode: 'online',
    text: "Point at whoever is most likely to have a secret gallery of spicy photos on their device."
  },
  {
    id: 'on-pad-18-10',
    gameId: 'point-and-drink',
    category: '18+',
    playMode: 'online',
    text: "Point at whoever has the highest sex drive and gets distracted by spicy thoughts the most."
  },
  {
    id: 'on-pad-18-11',
    gameId: 'point-and-drink',
    category: '18+',
    playMode: 'online',
    text: "Point at whoever has the most seductive bedroom voice over their headset mic."
  },
  {
    id: 'on-pad-18-12',
    gameId: 'point-and-drink',
    category: '18+',
    playMode: 'online',
    text: "Point at whoever has the wildest bedroom kinks that would shock the rest of the group."
  },

  // Spicy:
  {
    id: 'on-pad-spicy-9',
    gameId: 'point-and-drink',
    category: 'spicy',
    playMode: 'online',
    text: "Point at whoever looks the most irresistibly tempting on their webcam tonight."
  },
  {
    id: 'on-pad-spicy-10',
    gameId: 'point-and-drink',
    category: 'spicy',
    playMode: 'online',
    text: "Point at whoever gives off the strongest dominant bedroom aura in this group."
  },
  {
    id: 'on-pad-spicy-11',
    gameId: 'point-and-drink',
    category: 'spicy',
    playMode: 'online',
    text: "Point at whoever you would secretly love to have a late-night private FaceTime session with."
  },
  {
    id: 'on-pad-spicy-12',
    gameId: 'point-and-drink',
    category: 'spicy',
    playMode: 'online',
    text: "Point at whoever is most likely to initiate dirty talk in private DMs without any warning."
  },

  // Kids:
  {
    id: 'on-pad-kids-9',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever tells the funniest animal jokes on call!"
  },
  {
    id: 'on-pad-kids-10',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever has the cutest pet or stuffed animal nearby!"
  },
  {
    id: 'on-pad-kids-11',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever would win an epic pillow fight championship!"
  },
  {
    id: 'on-pad-kids-12',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever makes the best silly sound effects when gaming!"
  },
  {
    id: 'on-pad-kids-13',
    gameId: 'point-and-drink',
    category: 'kids',
    playMode: 'online',
    text: "Point at whoever has the brightest smile on camera right now!"
  }
];

