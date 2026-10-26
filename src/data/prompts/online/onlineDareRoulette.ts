import { ONLINE_DARE_ROULETTE_EXPANSION } from './expansions/onlineDareRouletteExpansion';
import { PromptItem } from '../../../types/game';

/**
 * ONLINE DARE ROULETTE PROMPTS
 * Specifically crafted for remote sessions over Discord, webcam video calls, and voice chats.
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
const BASE_ONLINE_DARE_ROULETTE_PROMPTS: PromptItem[] = [
  // ==========================================
  // EASY (Light, funny remote dares & harmless forfeits)
  // ==========================================
  {
    id: 'on-dr-easy-1',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Put on the most chaotic pair of sunglasses or hat you own and wear them for the next 3 rounds on camera.",
    forfeit: "Take 1 remote drink sip or mute yourself for 1 round"
  },
  {
    id: 'on-dr-easy-2',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Unmute and deliver a dramatic 20-second infomercial selling whatever beverage or cup is on your desk right now.",
    forfeit: "Take 1 remote drink sip"
  },
  {
    id: 'on-dr-easy-5',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Tilt your webcam or phone camera so only your eyebrows and forehead are visible for the next 2 turns.",
    forfeit: "Take 1 remote drink sip"
  },
  {
    id: 'on-dr-med-3',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Let the person of the call's choice pick an animal you must imitate in voice and gesture for 20 seconds.",
    forfeit: "Take 2 remote penalty sips"
  },
  {
    id: 'on-dr-med-4',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Show the camera the most embarrassing item within reach of your desk and give a 15-second excuse for why it is there.",
    forfeit: "Take 2 remote penalty sips"
  },
  {
    id: 'on-dr-ext-4',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Change your Discord profile picture or Instagram story to a picture picked by the group for the next 1 hour.",
    forfeit: "Finish your drink or take 3 penalty sips"
  },
  {
    id: 'on-dr-ext-5',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Call someone not in this game on speakerphone and convince them for 60 seconds that you just bought an alpaca.",
    forfeit: "Take 3 penalty sips"
  },
  {
    id: 'on-dr-unh-2',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    text: "Turn your webcam completely upside down, speak only backwards, and act like everything is normal for 2 rounds.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-unh-3',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    text: "Put on 4 layers of shirts or sweaters on camera right now and keep them all on for the rest of the game.",
    forfeit: "Take 3 penalty sips"
  },
  {
    id: 'on-dr-unh-4',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    text: "Send a random single emoji (like 🦝 or 🚽) to your parents with zero explanation and do not respond to their reply.",
    forfeit: "Take 3 penalty sips"
  },

  // ==========================================
  // COUPLES (Intimate, romantic, deep connection dares)
  // ==========================================
  {
    id: 'on-dr-cpl-1',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Look directly into your camera, hold my gaze, and list 3 specific little habits of mine that make you fall in love.",
    forfeit: "Send me a 1-minute voice note poem before bed"
  },
  {
    id: 'on-dr-cpl-2',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Show the camera your phone lock screen and reveal the story behind why you chose that photo.",
    forfeit: "Change your lock screen to a goofy photo of us for 24 hours"
  },
  {
    id: 'on-dr-cpl-3',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Play a romantic slow-dance song through your mic and sway in your chair on camera with me for 45 seconds.",
    forfeit: "Take 1 romantic penalty sip together"
  },

  // ==========================================
  // KIDS (Pure fun, silly, family-friendly remote dares)
  // ==========================================
  {
    id: 'on-dr-kids-1',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Balance a book or a clean sock on your head on camera while spinning in your chair 3 times.",
    forfeit: "Do 5 jumping jacks on camera"
  },

  // ==========================================
  // EXPANDED EASY (Light, funny remote dares)
  // ==========================================
  {
    id: 'on-dr-easy-7',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Change your Discord / call avatar to a photo of a toaster or potato for the next 3 rounds.",
    forfeit: "Take 1 remote sip of water"
  },
  {
    id: 'on-dr-easy-10',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Spell out the name of someone in this call using your nose on your keyboard and hit send.",
    forfeit: "Take 1 sip"
  },
  {
    id: 'on-dr-med-9',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Let the call pick any Wikipedia article and you must read the intro like a breaking news anchor.",
    forfeit: "Take 2 penalty sips"
  },

  // ==========================================
  // EXPANDED EXTREME (High-stakes screen shares & call tension)
  // ==========================================
  {
    id: 'on-dr-ext-6',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Open your photos app, scroll with your eyes closed for 5 seconds, stop, and show whatever photo you land on to the camera.",
    forfeit: "Down half your beverage"
  },
  {
    id: 'on-dr-ext-9',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Call someone not in this call and tell them you're thinking of getting a face tattoo of a dolphin.",
    forfeit: "Take 3 penalty sips"
  },
  {
    id: 'on-dr-ext-10',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Keep your camera tilted up showing only the ceiling while narrating everything you do in the third person for 2 rounds.",
    forfeit: "Take 3 penalty sips"
  },

  // ==========================================
  // EXPANDED UNHINGED (Chaotic forfeits & absurd webcam dares)
  // ==========================================
  {
    id: 'on-dr-unh-5',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    text: "Put an ice cube inside your socks or shirt collar on camera and keep it there until it melts.",
    forfeit: "Take 3 heavy penalty sips"
  },
  {
    id: 'on-dr-unh-6',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    text: "Wrap a t-shirt around your head like a mummy turban and do a dramatic villain laugh directly into the mic for 15 seconds.",
    forfeit: "Take 2 penalty sips"
  },

  // ==========================================
  // EXPANDED COUPLES (Romantic & intimate webcam connection)
  // ==========================================
  {
    id: 'on-dr-cpl-5',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Turn off all the lights except your screen, look right into the camera, and describe the exact second you knew you fell for me.",
    forfeit: "Record a 60-second voice note saying 5 reasons you adore me"
  },
  {
    id: 'on-dr-cpl-7',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Take a selfie right now on your webcam making your softest smile and send it to me as your new contact photo.",
    forfeit: "Send a voice whisper kissing the microphone"
  },
  {
    id: 'on-dr-cpl-8',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Mute other background sounds, play our song, and slow dance on your webcam for 30 seconds while looking at me.",
    forfeit: "Blow 3 slow kisses into the camera lens"
  },

  // ==========================================
  // EXPANDED 18+ (Adult late-night voice & cam dares)
  // ==========================================
  {
    id: 'on-dr-18-5',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Unmute and whisper the exact details of what you like someone to whisper in your ear when things get heated.",
    forfeit: "Take 2 penalty drinks"
  },
  {
    id: 'on-dr-kids-8',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Draw a funny doodle on a piece of paper in 15 seconds and show it to the camera!",
    forfeit: "Give a big double thumbs-up to the camera"
  },
  {
    id: 'on-dr-easy-13',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Put a household object on top of your head and don't let it fall off for 2 full rounds.",
    forfeit: "Take 1 penalty sip"
  },
  {
    id: 'on-dr-easy-15',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Change your Discord status or call bio to 'Proud member of the Potato Appreciation Club' for the rest of the game.",
    forfeit: "Take 1 penalty sip"
  },

  // Medium:
  {
    id: 'on-dr-med-12',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Share your screen and let someone pick any Wikipedia article; you must read the first paragraph in an opera singer voice.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-med-15',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Speak with your hands completely visible on webcam gesturing like an Italian chef for the next 2 rounds.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-ext-13',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Let the group collectively choose one photo from your public social media that you must delete right now on screen share.",
    forfeit: "Take 3 heavy penalty sips"
  },
  {
    id: 'on-dr-ext-14',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Call your best friend outside this call on speaker, say 'I need to hide a body, bring a shovel', and immediately hang up.",
    forfeit: "Take 3 penalty drinks"
  },

  // Unhinged:
  {
    id: 'on-dr-unh-9',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    text: "Eat a slice of lemon or a pinch of salt on camera with an expression of pure, unbothered tranquility.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-unh-10',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    text: "Turn your monitor brightness to 100%, hold a cold beverage against your forehead, and recite the alphabet backwards.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-unh-11',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    text: "Wrap your head in a towel like a mystical fortune teller and deliver a 30-second psychic reading for someone on call.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-unh-12',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    text: "Put on sunglasses, a jacket, and a hat indoors on webcam and speak only in secret agent code words for 2 rounds.",
    forfeit: "Take 2 penalty sips"
  },

  // Couples:
  {
    id: 'on-dr-cpl-9',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Send me a 10-second video of your hands forming a heart with your eyes looking directly into the camera lens.",
    forfeit: "Take 2 penalty sips of wine"
  },
  {
    id: 'on-dr-cpl-10',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Change your Discord / phone profile wallpaper to my photo on screen-share right now.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-cpl-12',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Sing our special song chorus directly into the mic while looking dead into the camera without breaking eye contact.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-18-10',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Send a private DM to the person you find most attractive on this call with an eggplant or peach emoji and no explanation.",
    forfeit: "Take 3 penalty drinks"
  },
  {
    id: 'on-dr-18-12',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Let the group hear 3 seconds of a heavy breath into your microphone with the lights dimmed in your room.",
    forfeit: "Take 3 penalty drinks"
  },
  {
    id: 'on-dr-kids-12',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Balance a clean sock or pillow on your foot while lifting it in front of the camera for 10 seconds!",
    forfeit: "Spin around twice in your chair"
  }
];


export const ONLINE_DARE_ROULETTE_PROMPTS: PromptItem[] = [...BASE_ONLINE_DARE_ROULETTE_PROMPTS, ...ONLINE_DARE_ROULETTE_EXPANSION];
