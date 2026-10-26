import { ONLINE_TRUTH_OR_SIP_EXPANSION } from './expansions/onlineTruthOrSipExpansion';
import { PromptItem } from '../../../types/game';

/**
 * ONLINE TRUTH OR SIP PROMPTS
 * Specifically crafted for remote drinking games and beverage hangouts over Discord and webcams.
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
const BASE_ONLINE_TRUTH_OR_SIP_PROMPTS: PromptItem[] = [
  {
    id: 'on-tos-easy-4',
    gameId: 'truth-or-sip',
    category: 'easy',
    playMode: 'online',
    text: "Have you ever pretended your webcam wasn't working just because you didn't feel like getting dressed?",
    forfeit: "Take 1 sip"
  },
  {
    id: 'on-tos-easy-6',
    gameId: 'truth-or-sip',
    category: 'easy',
    playMode: 'online',
    text: "What is a song you know every word to that you would never admit on your Spotify profile?",
    forfeit: "Take 1 sip"
  },
  {
    id: 'on-tos-med-3',
    gameId: 'truth-or-sip',
    category: 'medium',
    playMode: 'online',
    text: "What is an assumption you made about someone in this call when you first met online that turned out wrong?",
    forfeit: "Take 2 sips"
  },
  {
    id: 'on-tos-med-4',
    gameId: 'truth-or-sip',
    category: 'medium',
    playMode: 'online',
    text: "Have you ever secretly muted or turned someone's volume down to 10% in Discord because they were annoying?",
    forfeit: "Take 2 sips"
  },
  {
    id: 'on-tos-med-5',
    gameId: 'truth-or-sip',
    category: 'medium',
    playMode: 'online',
    text: "What is the longest amount of time you have left someone in this call on 'Delivered' on purpose?",
    forfeit: "Take 2 sips"
  },

  // ==========================================
  // EXTREME (High voltage, secrets, heavy sips)
  // ==========================================
  {
    id: 'on-tos-ext-1',
    gameId: 'truth-or-sip',
    category: 'extreme',
    playMode: 'online',
    text: "What is the most incriminating thing currently saved on your phone that you would pay $500 to delete permanently?",
    forfeit: "Take 3 heavy sips"
  },
  {
    id: 'on-tos-ext-3',
    gameId: 'truth-or-sip',
    category: 'extreme',
    playMode: 'online',
    text: "What is a secret about yourself that nobody in this call knows, and that would change how they see you?",
    forfeit: "Finish your drink"
  },

  // ==========================================
  // UNHINGED (Chaotic, wild confessions)
  // ==========================================
  {
    id: 'on-tos-unh-1',
    gameId: 'truth-or-sip',
    category: 'unhinged',
    playMode: 'online',
    text: "Have you ever taken your laptop or phone into the bathroom during a voice call and accidentally unmuted?",
    forfeit: "Take 2 sips"
  },

  // ==========================================
  // COUPLES (Vulnerable, intimate remote romance)
  // ==========================================
  {
    id: 'on-tos-cpl-1',
    gameId: 'truth-or-sip',
    category: 'couples',
    playMode: 'online',
    text: "What is a moment on call where you looked at me on camera and thought 'I want to be with this person forever'?",
    forfeit: "Take 1 sweet sip"
  },
  {
    id: 'on-tos-cpl-2',
    gameId: 'truth-or-sip',
    category: 'couples',
    playMode: 'online',
    text: "What is a small insecurity you have about our relationship that you haven't opened up about yet?",
    forfeit: "Take 2 sips"
  },
  {
    id: 'on-tos-cpl-3',
    gameId: 'truth-or-sip',
    category: 'couples',
    playMode: 'online',
    text: "What was your very first impression of me the first time we joined a video call together?",
    forfeit: "Take 1 sip"
  },
  {
    id: 'on-tos-cpl-4',
    gameId: 'truth-or-sip',
    category: 'couples',
    playMode: 'online',
    text: "What is something I do over text or call that never fails to make your whole day better?",
    forfeit: "Blow a kiss to the camera"
  },

  // ==========================================
  // 18+ (Mature adult truths or heavy penalties)
  // ==========================================
  {
    id: 'on-tos-18-1',
    gameId: 'truth-or-sip',
    category: '18+',
    playMode: 'online',
    text: "What is your most taboo or specific sexual fantasy that you have never confessed out loud to anyone?",
    forfeit: "Take 3 heavy sips"
  },
  {
    id: 'on-tos-18-2',
    gameId: 'truth-or-sip',
    category: '18+',
    playMode: 'online',
    text: "Have you ever engaged in cybersex, phone sex, or webcam intimacy with someone on this call or a mutual friend?",
    forfeit: "Take 3 heavy sips"
  },

  // ==========================================
  // SPICY (Sensual, explicit erotic confessions)
  // ==========================================
  {
    id: 'on-tos-spicy-1',
    gameId: 'truth-or-sip',
    category: "18+",
    playMode: 'online',
    text: "Describe in vivid, explicit detail what you would do to the person of your choice in this call if they were in your bedroom right now.",
    forfeit: "Down your entire drink"
  },

  // ==========================================
  // KIDS (Pure fun, silly, family-friendly sip truths)
  // ==========================================
  {
    id: 'on-tos-kids-1',
    gameId: 'truth-or-sip',
    category: 'kids',
    playMode: 'online',
    text: "What is the silliest face you can make, or take a sip of your juice box/water right now?",
    forfeit: "Take 1 sip of juice or water"
  },
  {
    id: 'on-tos-easy-10',
    gameId: 'truth-or-sip',
    category: 'easy',
    playMode: 'online',
    text: "Have you ever ordered food delivery from a place less than a 5-minute walk from your house out of pure laziness?",
    forfeit: "Take 1 sip"
  },
  {
    id: 'on-tos-med-11',
    gameId: 'truth-or-sip',
    category: 'medium',
    playMode: 'online',
    text: "What is an opinion you pretended to agree with in a voice call just to avoid an annoying debate?",
    forfeit: "Take 2 penalty sips"
  },

  // ==========================================
  // EXPANDED EXTREME (High-stakes remote confessions)
  // ==========================================
  {
    id: 'on-tos-ext-6',
    gameId: 'truth-or-sip',
    category: 'extreme',
    playMode: 'online',
    text: "What is the most toxic message you drafted in your Notes app that you never sent, and who was it for?",
    forfeit: "Take 3 heavy penalty sips"
  },
  {
    id: 'on-tos-ext-7',
    gameId: 'truth-or-sip',
    category: 'extreme',
    playMode: 'online',
    text: "Have you ever secretly recorded audio or taken a photo during a voice or video call without the other person knowing?",
    forfeit: "Take 3 penalty sips"
  },
  {
    id: 'on-tos-ext-8',
    gameId: 'truth-or-sip',
    category: 'extreme',
    playMode: 'online',
    text: "What is the biggest lie you have ever told to get out of an online hangout or gaming night?",
    forfeit: "Take 3 penalty sips"
  },
  {
    id: 'on-tos-ext-10',
    gameId: 'truth-or-sip',
    category: 'extreme',
    playMode: 'online',
    text: "What is the most expensive mistake you've made while buying something online while drunk or tired?",
    forfeit: "Take 3 penalty sips"
  },
  {
    id: 'on-tos-unh-6',
    gameId: 'truth-or-sip',
    category: 'unhinged',
    playMode: 'online',
    text: "What is the weirdest thing you have said out loud to yourself when you thought your microphone was muted?",
    forfeit: "Take 3 penalty sips"
  },
  {
    id: 'on-tos-unh-8',
    gameId: 'truth-or-sip',
    category: 'unhinged',
    playMode: 'online',
    text: "What is a bizarre habit you have when you're completely alone at your computer that would shock people?",
    forfeit: "Take 3 penalty sips"
  },

  // ==========================================
  // EXPANDED COUPLES (Heartfelt long-distance truths)
  // ==========================================
  {
    id: 'on-tos-cpl-5',
    gameId: 'truth-or-sip',
    category: 'couples',
    playMode: 'online',
    text: "What is a moment during one of our calls when you felt your heart beat faster for me?",
    forfeit: "Take 1 sip or send a voice whisper"
  },
  {
    id: 'on-tos-cpl-6',
    gameId: 'truth-or-sip',
    category: 'couples',
    playMode: 'online',
    text: "Have you ever re-read our old text messages late at night when you were missing me?",
    forfeit: "Take 1 sip and tell your favorite one"
  },
  {
    id: 'on-tos-cpl-7',
    gameId: 'truth-or-sip',
    category: 'couples',
    playMode: 'online',
    text: "What is something I do on camera or in my voice that gives you butterflies every single time?",
    forfeit: "Take 1 romantic sip"
  },

  // ==========================================
  // EXPANDED 18+ (Adult late-night confessions)
  // ==========================================
  {
    id: 'on-tos-18-5',
    gameId: 'truth-or-sip',
    category: '18+',
    playMode: 'online',
    text: "What is the most daring place in your home you have ever taken a spicy selfie or video?",
    forfeit: "Take 2 heavy penalty sips"
  },
  {
    id: 'on-tos-18-6',
    gameId: 'truth-or-sip',
    category: '18+',
    playMode: 'online',
    text: "Have you ever had a private video call with someone while doing something explicitly sexual beneath the camera frame?",
    forfeit: "Take 2 penalty drinks"
  },
  {
    id: 'on-tos-18-7',
    gameId: 'truth-or-sip',
    category: '18+',
    playMode: 'online',
    text: "What is the most unusual thing that turns you on that you would never admit on your main social media?",
    forfeit: "Take 2 penalty drinks"
  },

  // ==========================================
  // EXPANDED SPICY (Sensual chemistry & explicit confessions)
  // ==========================================
  {
    id: 'on-tos-spicy-5',
    gameId: 'truth-or-sip',
    category: "18+",
    playMode: 'online',
    text: "Describe the last spicy video or photo you sent: what were you wearing and what was the caption?",
    forfeit: "Take 3 penalty sips"
  },
  {
    id: 'on-tos-easy-13',
    gameId: 'truth-or-sip',
    category: 'easy',
    playMode: 'online',
    text: "Have you ever muted yourself on call specifically so you could complain about someone also on the call?",
    forfeit: "Take 1 penalty sip"
  },
  {
    id: 'on-tos-easy-14',
    gameId: 'truth-or-sip',
    category: 'easy',
    playMode: 'online',
    text: "What is the weirdest thing you do when you are completely alone in your room late at night?",
    forfeit: "Take 1 penalty sip"
  },
  {
    id: 'on-tos-easy-15',
    gameId: 'truth-or-sip',
    category: 'easy',
    playMode: 'online',
    text: "What is a slang word you use constantly online that you would never say in front of your parents?",
    forfeit: "Take 1 penalty sip"
  },

  // Medium:
  {
    id: 'on-tos-med-12',
    gameId: 'truth-or-sip',
    category: 'medium',
    playMode: 'online',
    text: "Who in this voice call do you think spends the most unhealthy amount of time scrolling on their phone?",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-tos-med-14',
    gameId: 'truth-or-sip',
    category: 'medium',
    playMode: 'online',
    text: "Have you ever secretly muted or deafened someone on Discord because their voice was getting on your nerves?",
    forfeit: "Take 2 penalty sips"
  },

  // Extreme:
  {
    id: 'on-tos-ext-11',
    gameId: 'truth-or-sip',
    category: 'extreme',
    playMode: 'online',
    text: "What is the most toxic thing you have ever done online out of pure jealousy or spite?",
    forfeit: "Take 3 heavy penalty sips"
  },
  {
    id: 'on-tos-ext-12',
    gameId: 'truth-or-sip',
    category: 'extreme',
    playMode: 'online',
    text: "If you had to expose your most secretive burner account to everyone on this call right now, what would it reveal?",
    forfeit: "Finish your drink"
  },
  {
    id: 'on-tos-ext-13',
    gameId: 'truth-or-sip',
    category: 'extreme',
    playMode: 'online',
    text: "Have you ever stalked someone's social media so deep that you accidentally liked a post from 3 years ago?",
    forfeit: "Take 3 penalty drinks"
  },
  {
    id: 'on-tos-ext-14',
    gameId: 'truth-or-sip',
    category: 'extreme',
    playMode: 'online',
    text: "Who on this call would you be the most horrified to have look through your saved photo album?",
    forfeit: "Take 3 heavy penalty sips"
  },

  // Unhinged:
  {
    id: 'on-tos-unh-9',
    gameId: 'truth-or-sip',
    category: 'unhinged',
    playMode: 'online',
    text: "What is the most unhinged lie you ever told in an online argument just to prove a point?",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-tos-unh-11',
    gameId: 'truth-or-sip',
    category: 'unhinged',
    playMode: 'online',
    text: "What is a bizarre food concoction you eat when you are gaming alone at 2 AM that would appall a chef?",
    forfeit: "Take 2 penalty sips"
  },

  // Couples:
  {
    id: 'on-tos-cpl-9',
    gameId: 'truth-or-sip',
    category: 'couples',
    playMode: 'online',
    text: "What was the moment on video call where you realized you wanted to be with me forever?",
    forfeit: "Take 2 penalty sips of wine"
  },
  {
    id: 'on-tos-cpl-11',
    gameId: 'truth-or-sip',
    category: 'couples',
    playMode: 'online',
    text: "What is a love note or message you wanted to send me but thought was too cheesy or intense?",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-tos-cpl-12',
    gameId: 'truth-or-sip',
    category: 'couples',
    playMode: 'online',
    text: "If we could teleport to each other's room right this second, what is the very first thing we would do?",
    forfeit: "Take 2 penalty sips"
  },

  // 18+:
  {
    id: 'on-tos-18-9',
    gameId: 'truth-or-sip',
    category: '18+',
    playMode: 'online',
    text: "Have you ever engaged in cybering or phone intimacy with someone while another person was in the next room?",
    forfeit: "Take 3 penalty drinks"
  },
  {
    id: 'on-tos-18-11',
    gameId: 'truth-or-sip',
    category: '18+',
    playMode: 'online',
    text: "Have you ever fantasized about someone in this voice call while taking a shower or lying in bed?",
    forfeit: "Finish your drink"
  },
  {
    id: 'on-tos-spicy-11',
    gameId: 'truth-or-sip',
    category: "18+",
    playMode: 'online',
    text: "What is an explicit bedroom scenario you've watched online that you desperately want to try in real life?",
    forfeit: "Take 3 penalty drinks"
  }
];


export const ONLINE_TRUTH_OR_SIP_PROMPTS: PromptItem[] = [...BASE_ONLINE_TRUTH_OR_SIP_PROMPTS, ...ONLINE_TRUTH_OR_SIP_EXPANSION];
