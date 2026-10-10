import { ONLINE_WOULD_YOU_RATHER_EXPANSION } from './expansions/onlineWouldYouRatherExpansion';
import { PromptItem } from '../../../types/game';

/**
 * ONLINE WOULD YOU RATHER PROMPTS
 * Specifically crafted for remote sessions over Discord, FaceTime, Zoom, and webcam hangouts.
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
const BASE_ONLINE_WOULD_YOU_RATHER_PROMPTS: PromptItem[] = [
  // ==========================================
  // EASY (Silly, casual, light digital dilemmas)
  // ==========================================
  {
    id: 'on-wyr-easy-1',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather have to keep your webcam turned on 24/7 or only be allowed to communicate online using GIFs?",
    optionA: "24/7 Webcam on",
    optionB: "Only GIFs forever"
  },
  {
    id: 'on-wyr-easy-2',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather accidentally leave your microphone unmuted while singing off-key or while having an imaginary fight in your shower?",
    optionA: "Off-key singing",
    optionB: "Imaginary shower fight"
  },
  {
    id: 'on-wyr-easy-3',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather have 10,000 unread emails or 500 unopened Discord notifications with constant pings?",
    optionA: "10k unread emails",
    optionB: "500 Discord pings"
  },
  {
    id: 'on-wyr-easy-4',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather have a super slow 5 Mbps internet speed forever or super fast internet that randomly cuts out for 2 minutes every hour?",
    optionA: "Constant 5 Mbps",
    optionB: "Fast with hourly drops"
  },
  {
    id: 'on-wyr-easy-5',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather every video call replace your face with an angry talking cat filter or a sleepy potato?",
    optionA: "Angry talking cat",
    optionB: "Sleepy potato"
  },
  {
    id: 'on-wyr-easy-6',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather have everyone on call hear your keyboard typing at deafening volume or hear heavy breathing every time you pause?",
    optionA: "Deafening typing clatter",
    optionB: "Loud mic breathing"
  },
  {
    id: 'on-wyr-easy-7',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather only be able to play video games with inverted mouse controls or play with 200ms ping permanently?",
    optionA: "Inverted controls",
    optionB: "Permanent 200ms ping"
  },
  {
    id: 'on-wyr-easy-8',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather have your Discord custom status permanently set to your most embarrassing childhood nickname or your mom's cooking advice?",
    optionA: "Childhood nickname",
    optionB: "Mom's advice"
  },

  // ==========================================
  // MEDIUM (Mildly awkward, relatable remote debates)
  // ==========================================
  {
    id: 'on-wyr-med-1',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather screen-share your YouTube recommendations page right now or read your last 5 sent text messages out loud?",
    optionA: "YouTube recommendations",
    optionB: "Last 5 sent texts"
  },
  {
    id: 'on-wyr-med-2',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather have your crush see your Spotify 'On Repeat' playlist or see your last three saved TikTok favorites?",
    optionA: "Spotify On Repeat",
    optionB: "Saved TikTok favorites"
  },
  {
    id: 'on-wyr-med-3',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather accidentally join a professional work call with a gaming gamer tag or join a group hangout while looking completely disheveled?",
    optionA: "Gaming tag in work call",
    optionB: "Disheveled look in hangout"
  },
  {
    id: 'on-wyr-med-4',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather be left on 'Delivered' for 48 hours by someone you like or be left on 'Read' within 2 seconds with no reply?",
    optionA: "Ghosted on Delivered",
    optionB: "Instant Read receipt silence"
  },
  {
    id: 'on-wyr-med-5',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather have everyone in this call find out who you stalk most on social media or what your highest screen time day was this month?",
    optionA: "Social media stalking",
    optionB: "Peak screen time record"
  },
  {
    id: 'on-wyr-med-6',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather accidentally reply to a public group chat with a private vent message or send an accidental screenshot back to the person you screenshotted?",
    optionA: "Vent in public group chat",
    optionB: "Screenshot sent to subject"
  },
  {
    id: 'on-wyr-med-7',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather give up Discord voice calls for a year or give up watching YouTube and Twitch videos for a year?",
    optionA: "No Discord voice calls",
    optionB: "No YouTube & Twitch"
  },

  // ==========================================
  // EXTREME (Nervous laughter, high digital stakes)
  // ==========================================
  {
    id: 'on-wyr-ext-1',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather screen-share your unfiltered photo camera roll for 60 seconds or screen-share your private Safari / Chrome search history from the past week?",
    optionA: "Camera roll (60 sec)",
    optionB: "Web search history"
  },
  {
    id: 'on-wyr-ext-2',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather accidentally livestream your room while sleeping to all your friends or have your voice recording while venting get sent to the person you vented about?",
    optionA: "Sleep livestream",
    optionB: "Vent recording sent"
  },
  {
    id: 'on-wyr-ext-3',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather let the group choose your profile banner and bio on all platforms for a month or let them send one DM from your account to your biggest crush?",
    optionA: "Public profile takeover",
    optionB: "1 DM sent to crush"
  },
  {
    id: 'on-wyr-ext-4',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather accidentally call your boss or professor at 3 AM on FaceTime or accidentally send a voice note of your crying breakdown to your ex?",
    optionA: "3 AM boss FaceTime",
    optionB: "Breakdown audio to ex"
  },
  {
    id: 'on-wyr-ext-5',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather have every single Discord server you've ever joined made public to your family or have your deleted messages folder permanently recovered?",
    optionA: "All Discord servers exposed",
    optionB: "Deleted messages recovered"
  },

  // ==========================================
  // UNHINGED (Chaotic, absurdity, maximum disruption)
  // ==========================================
  {
    id: 'on-wyr-unh-1',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    text: "Would you rather have an unskippable audio ad play through your microphone whenever you speak on call or have your webcam automatically zoom in on your mouth when chewing?",
    optionA: "Microphone audio ads",
    optionB: "Mouth-cam zoom"
  },
  {
    id: 'on-wyr-unh-2',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    text: "Would you rather have your computer lock up and blast circus music every time you open a private browser tab or have your webcam randomly take a photo and set it as your wallpaper?",
    optionA: "Circus music incognito alarm",
    optionB: "Random surprise webcam wallpaper"
  },
  {
    id: 'on-wyr-unh-3',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    text: "Would you rather be forced to speak exclusively in Twitch chat emote slang for 24 hours ('poggers', 'monkaS', 'KEKW') or narrate all your movements out loud like an NPC?",
    optionA: "Twitch chat slang only",
    optionB: "NPC commentary out loud"
  },
  {
    id: 'on-wyr-unh-4',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    text: "Would you rather have someone remotely control your mouse for 5 minutes without warning once a week or have your auto-correct replace every 10th word with 'daddy'?",
    optionA: "Random mouse hijacking",
    optionB: "'Daddy' auto-correct glitch"
  },

  // ==========================================
  // COUPLES (Romantic, intimate, long-distance connection)
  // ==========================================
  {
    id: 'on-wyr-cpl-1',
    gameId: 'would-you-rather',
    category: 'couples',
    playMode: 'online',
    text: "Would you rather fall asleep on a quiet FaceTime call every single night together or have one 4-hour weekend virtual date with gourmet takeout?",
    optionA: "Nightly FaceTime sleep call",
    optionB: "Gourmet weekend date call"
  },
  {
    id: 'on-wyr-cpl-2',
    gameId: 'would-you-rather',
    category: 'couples',
    playMode: 'online',
    text: "Would you rather receive a spontaneous 2-minute voice note describing why I love you or a surprise package of comfort snacks in the mail?",
    optionA: "Heartfelt voice note",
    optionB: "Surprise snack package"
  },
  {
    id: 'on-wyr-cpl-3',
    gameId: 'would-you-rather',
    category: 'couples',
    playMode: 'online',
    text: "Would you rather watch our favorite comfort movie synchronized on screen-share in our pajamas or spend 3 hours co-op gaming together?",
    optionA: "Pajama screen-share movie",
    optionB: "Late-night co-op gaming"
  },
  {
    id: 'on-wyr-cpl-4',
    gameId: 'would-you-rather',
    category: 'couples',
    playMode: 'online',
    text: "Would you rather I secretly plan a virtual candlelit dinner date for us or write you a multi-page love letter to open while on video call?",
    optionA: "Virtual candlelit dinner",
    optionB: "Multi-page call love letter"
  },

  // ==========================================
  // 18+ (Mature adult topics, risqué hypotheticals)
  // ==========================================
  {
    id: 'on-wyr-18-1',
    gameId: 'would-you-rather',
    category: '18+',
    playMode: 'online',
    text: "Would you rather have someone discover your hidden NSFW photo stash or have them discover your most degenerate Reddit / forum search queries?",
    optionA: "NSFW photo stash",
    optionB: "Degenerate Reddit searches"
  },
  {
    id: 'on-wyr-18-2',
    gameId: 'would-you-rather',
    category: '18+',
    playMode: 'online',
    text: "Would you rather have a private video call with someone while slightly tipsy or receive an unprompted spicy video while sitting in a public coffee shop?",
    optionA: "Tipsy video call",
    optionB: "Spicy video in public cafe"
  },
  {
    id: 'on-wyr-18-3',
    gameId: 'would-you-rather',
    category: '18+',
    playMode: 'online',
    text: "Would you rather confess your most unhinged romantic or sexual obsession to this call or take 3 consecutive penalty drinks right now?",
    optionA: "Confess unhinged obsession",
    optionB: "Take 3 penalty drinks"
  },
  {
    id: 'on-wyr-18-4',
    gameId: 'would-you-rather',
    category: '18+',
    playMode: 'online',
    text: "Would you rather accidentally send an explicit voice note to a family group chat or have a spicy DM displayed on a conference screen during a work presentation?",
    optionA: "Spicy voice note to family",
    optionB: "Spicy DM on conference screen"
  },

  // ==========================================
  // SPICY (Sensual, explicit, late-night remote chemistry)
  // ==========================================
  {
    id: 'on-wyr-spicy-1',
    gameId: 'would-you-rather',
    category: 'spicy',
    playMode: 'online',
    text: "Would you rather do an exclusive 1-on-1 webcam strip-tease or send a continuous 3-minute unfiltered audio whisper telling exactly what you want done to you?",
    optionA: "1-on-1 webcam tease",
    optionB: "3-minute audio whisper"
  },
  {
    id: 'on-wyr-spicy-2',
    gameId: 'would-you-rather',
    category: 'spicy',
    playMode: 'online',
    text: "Would you rather have someone in this call direct your hands for 60 seconds over webcam or tell someone here their most erotic physical trait?",
    optionA: "Directed hands on cam (60s)",
    optionB: "Reveal most erotic trait"
  },
  {
    id: 'on-wyr-spicy-3',
    gameId: 'would-you-rather',
    category: 'spicy',
    playMode: 'online',
    text: "Would you rather trade spicy POV photos back-and-forth or stay connected on voice call while touching yourself until completion?",
    optionA: "Trade spicy POV photos",
    optionB: "Stay on audio until climax"
  },
  {
    id: 'on-wyr-spicy-4',
    gameId: 'would-you-rather',
    category: 'spicy',
    playMode: 'online',
    text: "Would you rather give someone here total control over your remote-controlled toy for an entire gaming match or read an erotic confession with camera on?",
    optionA: "Remote toy control in match",
    optionB: "Live erotic cam reading"
  },

  // ==========================================
  // KIDS (Pure fun, silly, wholesome, age-appropriate)
  // ==========================================
  {
    id: 'on-wyr-kids-1',
    gameId: 'would-you-rather',
    category: 'kids',
    playMode: 'online',
    text: "Would you rather play a game where your character is a flying penguin or a surfing dinosaur?",
    optionA: "Flying penguin",
    optionB: "Surfing dinosaur"
  },
  {
    id: 'on-wyr-kids-2',
    gameId: 'would-you-rather',
    category: 'kids',
    playMode: 'online',
    text: "Would you rather have cartoon sound effects follow you around in real life or be able to talk to your pets on video calls?",
    optionA: "Cartoon sound effects",
    optionB: "Talk to pets on video"
  },
  {
    id: 'on-wyr-kids-3',
    gameId: 'would-you-rather',
    category: 'kids',
    playMode: 'online',
    text: "Would you rather eat ice cream for breakfast every Saturday or pizza for lunch every single Sunday?",
    optionA: "Ice cream breakfast",
    optionB: "Pizza lunch Sundays"
  },
  {
    id: 'on-wyr-kids-4',
    gameId: 'would-you-rather',
    category: 'kids',
    playMode: 'online',
    text: "Would you rather have to wear a giant superhero cape every time you join a video call or wear wacky sunglasses?",
    optionA: "Giant superhero cape",
    optionB: "Wacky sunglasses"
  },
  // ==========================================
  // EXPANDED EASY (Light, relatable remote dilemmas)
  // ==========================================
  {
    id: 'on-wyr-easy-9',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather have every video call automatically play an 80s laugh track every time you speak or have an anime sparkle filter over your eyes permanently?",
    optionA: "80s laugh track",
    optionB: "Anime sparkle eyes"
  },
  {
    id: 'on-wyr-easy-10',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather always accidentally double-tap and like 3-year-old Instagram posts or accidentally send a voice note of you chewing loudly?",
    optionA: "Like 3-year-old post",
    optionB: "Loud chewing voice note"
  },
  {
    id: 'on-wyr-easy-11',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather all your text messages auto-translate to Shakespearean English or pirate talk?",
    optionA: "Shakespearean English",
    optionB: "Pirate slang"
  },
  {
    id: 'on-wyr-easy-12',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather lose the ability to use backspace forever or have your spacebar trigger a random Discord server emoji?",
    optionA: "No backspace forever",
    optionB: "Emoji on every spacebar"
  },
  {
    id: 'on-wyr-easy-13',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather have a 10-second delay on every meme sent to you or only be able to watch YouTube videos in 360p resolution?",
    optionA: "10-second meme delay",
    optionB: "Permanent 360p video"
  },

  // ==========================================
  // EXPANDED MEDIUM (Awkward digital dilemmas)
  // ==========================================
  {
    id: 'on-wyr-med-8',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather screen-share your Spotify Wrapped from last year without hiding anything or reveal your top 3 most-watched Twitch/YouTube streamers?",
    optionA: "Spotify Wrapped reveal",
    optionB: "Top 3 streamers reveal"
  },
  {
    id: 'on-wyr-med-9',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather accidentally call someone on FaceTime while half-asleep in bed or have someone send a screenshot of your deleted message into the main group chat?",
    optionA: "Accidental half-asleep FaceTime",
    optionB: "Deleted message screenshot"
  },
  {
    id: 'on-wyr-med-10',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather have your family find your main Reddit account or have your boss read your Twitter bookmarks?",
    optionA: "Family finds Reddit",
    optionB: "Boss reads bookmarks"
  },
  {
    id: 'on-wyr-med-11',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather have everyone on call know how many hours you spent scrolling TikTok yesterday or know the exact time you woke up today?",
    optionA: "TikTok screen time exposed",
    optionB: "Wake-up time exposed"
  },
  {
    id: 'on-wyr-med-12',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather be forced to react with an enthusiastic thumbs-up to every bad take in chat or never be allowed to use reaction emojis again?",
    optionA: "Compulsory thumbs-up",
    optionB: "Zero reaction emojis"
  },

  // ==========================================
  // EXPANDED EXTREME (High-stakes screen shares)
  // ==========================================
  {
    id: 'on-wyr-ext-6',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather livestream your uncensored phone Notes app for 30 seconds or let the group read your last 3 drafts that you never posted?",
    optionA: "Notes app livestream (30s)",
    optionB: "3 unposted drafts read"
  },
  {
    id: 'on-wyr-ext-7',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather have your camera roll automatically upload your last taken photo to your Instagram story or have your microphone stay live for 10 minutes while you think you're muted?",
    optionA: "Auto-post last photo to story",
    optionB: "10-minute live unmuted mic"
  },
  {
    id: 'on-wyr-ext-8',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather let someone in this call go through your blocked users list and ask why each person is there or screen-share your blocked numbers?",
    optionA: "Blocked users interrogated",
    optionB: "Screen-share blocked numbers"
  },
  {
    id: 'on-wyr-ext-9',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather have an audio alert notify everyone whenever you mute yourself on call or have your webcam flash red whenever you switch to another browser tab?",
    optionA: "Mute audio alert",
    optionB: "Tab switch webcam alert"
  },
  {
    id: 'on-wyr-ext-10',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather confess your most unhinged online purchase in front of this call or let the group pick your Discord profile banner for a week?",
    optionA: "Confess unhinged purchase",
    optionB: "Group picks banner (1 week)"
  },

  // ==========================================
  // EXPANDED UNHINGED (Chaotic webcam & audio chaos)
  // ==========================================
  {
    id: 'on-wyr-unh-5',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    text: "Would you rather every time you join a voice call have a robotic TTS voice announce your battery percentage and screen brightness or have your webcam automatically mirror your video horizontally?",
    optionA: "TTS battery announcement",
    optionB: "Mirrored webcam permanently"
  },
  {
    id: 'on-wyr-unh-6',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    text: "Would you rather have your microphone pitch-shifted up two octaves like a chipmunk for the next hour of gaming or have heavy reverb added to every syllable?",
    optionA: "Chipmunk pitch-shift",
    optionB: "Massive cavernous reverb"
  },
  {
    id: 'on-wyr-unh-7',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    text: "Would you rather only be able to type in all caps on Discord for a full month or have your avatar replaced with a cursed low-res Shrek thumbnail?",
    optionA: "ALL CAPS FOR A MONTH",
    optionB: "Cursed Shrek avatar"
  },
  {
    id: 'on-wyr-unh-8',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    text: "Would you rather have an unskippable 5-second slide whistle sound play every time you enter a voice channel or have your screen dim to 10% whenever anyone says your name?",
    optionA: "Slide whistle entry chime",
    optionB: "Screen dims on your name"
  },

  // ==========================================
  // EXPANDED COUPLES (Long-distance & video intimacy)
  // ==========================================
  {
    id: 'on-wyr-cpl-5',
    gameId: 'would-you-rather',
    category: 'couples',
    playMode: 'online',
    text: "Would you rather spend 5 hours building a Minecraft house together on call or fall asleep on a silent video call while listening to soft rain?",
    optionA: "Minecraft co-op build",
    optionB: "Silent rainy video sleep call"
  },
  {
    id: 'on-wyr-cpl-6',
    gameId: 'would-you-rather',
    category: 'couples',
    playMode: 'online',
    text: "Would you rather write a shared digital bucket list of 20 things we must do together or record a 5-minute audio message about how your life changed when we met?",
    optionA: "Shared digital bucket list",
    optionB: "5-minute audio love message"
  },
  {
    id: 'on-wyr-cpl-7',
    gameId: 'would-you-rather',
    category: 'couples',
    playMode: 'online',
    text: "Would you rather receive an unexpected good morning video note from me every day for a year or a 30-minute late-night deep talk call every Friday?",
    optionA: "Daily morning video note",
    optionB: "Friday deep talk call"
  },
  {
    id: 'on-wyr-cpl-8',
    gameId: 'would-you-rather',
    category: 'couples',
    playMode: 'online',
    text: "Would you rather share a synchronized Spotify listening session for 2 hours with zero talking or stay on video call while we both read our favorite books?",
    optionA: "Synchronized silent Spotify",
    optionB: "Cozy webcam reading session"
  },

  // ==========================================
  // EXPANDED 18+ (Adult online secrets)
  // ==========================================
  {
    id: 'on-wyr-18-5',
    gameId: 'would-you-rather',
    category: '18+',
    playMode: 'online',
    text: "Would you rather have someone on this call discover your secret spicy burner account or hear your most unhinged romantic late-night confession?",
    optionA: "Spicy burner account exposed",
    optionB: "Unhinged late-night confession"
  },
  {
    id: 'on-wyr-18-6',
    gameId: 'would-you-rather',
    category: '18+',
    playMode: 'online',
    text: "Would you rather confess the most embarrassing kink you secretly find hot or take 2 consecutive penalty sips on camera right now?",
    optionA: "Confess secret kink",
    optionB: "Take 2 penalty sips"
  },
  {
    id: 'on-wyr-18-7',
    gameId: 'would-you-rather',
    category: '18+',
    playMode: 'online',
    text: "Would you rather let someone in this call ask you ANY unfiltered adult question with zero skips allowed or show the last NSFW photo you saved?",
    optionA: "1 unfiltered adult question",
    optionB: "Last saved NSFW photo"
  },
  {
    id: 'on-wyr-18-8',
    gameId: 'would-you-rather',
    category: '18+',
    playMode: 'online',
    text: "Would you rather trade a risqué webcam screenshot with someone here or confess what you were wearing the last time you thought about them?",
    optionA: "Trade risqué cam screenshot",
    optionB: "Confess outfit during thought"
  },

  // ==========================================
  // EXPANDED SPICY (Sensual webcam & audio dares)
  // ==========================================
  {
    id: 'on-wyr-spicy-5',
    gameId: 'would-you-rather',
    category: 'spicy',
    playMode: 'online',
    text: "Would you rather do a slow 30-second camera zoom teasing your favorite physical asset or whisper an explicit bedroom fantasy directly into the mic?",
    optionA: "30-second cam tease zoom",
    optionB: "Whispered explicit fantasy"
  },
  {
    id: 'on-wyr-spicy-6',
    gameId: 'would-you-rather',
    category: 'spicy',
    playMode: 'online',
    text: "Would you rather have someone here pick an article of clothing you must remove on camera or describe your most sensitive pleasure spot in vivid detail?",
    optionA: "Remove article of clothing on cam",
    optionB: "Describe pleasure spot in detail"
  },
  {
    id: 'on-wyr-spicy-7',
    gameId: 'would-you-rather',
    category: 'spicy',
    playMode: 'online',
    text: "Would you rather send an unfiltered audio clip of you catching your breath or leave your webcam on while you change your shirt?",
    optionA: "Breathless audio clip",
    optionB: "Webcam on while changing shirt"
  },
  {
    id: 'on-wyr-spicy-8',
    gameId: 'would-you-rather',
    category: 'spicy',
    playMode: 'online',
    text: "Would you rather give someone here complete command over what you do with your hands for 45 seconds or tell them exactly how you would undress them over call?",
    optionA: "45-second hand command on cam",
    optionB: "Describe undressing them on call"
  },

  // ==========================================
  // EXPANDED KIDS (Silly, wholesome digital dilemmas)
  // ==========================================
  {
    id: 'on-wyr-kids-5',
    gameId: 'would-you-rather',
    category: 'kids',
    playMode: 'online',
    text: "Would you rather have a pet dragon that fits inside your pocket or a pet giant panda that gives the best fluffy hugs?",
    optionA: "Pocket dragon",
    optionB: "Giant huggy panda"
  },
  {
    id: 'on-wyr-kids-6',
    gameId: 'would-you-rather',
    category: 'kids',
    playMode: 'online',
    text: "Would you rather be able to jump as high as a two-story building or run as fast as a cheetah while making racecar noises?",
    optionA: "Jump 2 stories high",
    optionB: "Cheetah speed with racecar noises"
  },
  {
    id: 'on-wyr-kids-7',
    gameId: 'would-you-rather',
    category: 'kids',
    playMode: 'online',
    text: "Would you rather only eat waffles with chocolate syrup for a week or build the world's biggest pillow castle in your living room?",
    optionA: "Chocolate waffles week",
    optionB: "World's biggest pillow castle"
  },
  {
    id: 'on-wyr-kids-8',
    gameId: 'would-you-rather',
    category: 'kids',
    playMode: 'online',
    text: "Would you rather have a magic pencil where anything you draw turns into real candy or sneakers that light up and play your favorite cartoon theme song?",
    optionA: "Magic candy drawing pencil",
    optionB: "Musical light-up sneakers"
  },

  // --- ADDITIONAL ONLINE WOULD YOU RATHER EXPANSION (100+ PROMPTS) ---
  // Easy:
  {
    id: 'on-wyr-easy-14',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather have all your voice calls broadcast in a funny autotuned robot voice or have an audience laugh track play every time you stop talking?",
    optionA: "Autotuned robot voice",
    optionB: "Constant audience laugh track"
  },
  {
    id: 'on-wyr-easy-15',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather have to wear giant neon clown glasses on every video call this week or use a potato filter on your face for every call?",
    optionA: "Neon clown glasses",
    optionB: "Permanent potato filter"
  },
  {
    id: 'on-wyr-easy-16',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather your computer wallpaper be permanently set to an embarrassing sleeping photo of yourself or a meme chosen by this group?",
    optionA: "Sleeping selfie",
    optionB: "Group-chosen meme"
  },
  {
    id: 'on-wyr-easy-17',
    gameId: 'would-you-rather',
    category: 'easy',
    playMode: 'online',
    text: "Would you rather accidentally unmute while singing loudly off-key or leave your camera on while making weird faces at yourself in the mirror?",
    optionA: "Unmuted singing loudly",
    optionB: "Webcam mirror faces"
  },

  // Medium:
  {
    id: 'on-wyr-med-13',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather have this entire group read your search history from the past 48 hours or read your last 3 unsent drafted messages?",
    optionA: "Past 48h search history",
    optionB: "3 unsent drafted messages"
  },
  {
    id: 'on-wyr-med-14',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather screen-share your notes app right now with zero warning or show the photo album you have hidden on your phone?",
    optionA: "Screen-share notes app",
    optionB: "Show hidden photo album"
  },
  {
    id: 'on-wyr-med-15',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather accidentally send a romantic message intended for a crush into your family group chat or into this server?",
    optionA: "Family group chat",
    optionB: "This server's chat"
  },
  {
    id: 'on-wyr-med-16',
    gameId: 'would-you-rather',
    category: 'medium',
    playMode: 'online',
    text: "Would you rather have someone on this call roast your desk and room aesthetic or roast your music taste on Spotify?",
    optionA: "Roast desk and room aesthetic",
    optionB: "Roast Spotify music taste"
  },

  // Extreme:
  {
    id: 'on-wyr-ext-11',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather live-stream your computer screen for 1 hour with whatever you are doing or call your most recent ex on speaker right now for 30 seconds?",
    optionA: "1-hour screen live-stream",
    optionB: "Call recent ex on speaker"
  },
  {
    id: 'on-wyr-ext-12',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather have your group chat leaked to your employer or have your camera roll leaked to your parents?",
    optionA: "Group chat to employer",
    optionB: "Camera roll to parents"
  },
  {
    id: 'on-wyr-ext-13',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather confess your most shameful internet obsession to everyone on this call or let the group post one tweet from your account?",
    optionA: "Confess internet obsession",
    optionB: "Group posts from your account"
  },
  {
    id: 'on-wyr-ext-14',
    gameId: 'would-you-rather',
    category: 'extreme',
    playMode: 'online',
    text: "Would you rather be banned from all online gaming and streaming for 6 months or only be able to communicate online using voice notes?",
    optionA: "6-month gaming & stream ban",
    optionB: "Voice notes only forever"
  },

  // Unhinged:
  {
    id: 'on-wyr-unh-9',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    text: "Would you rather drink a blended smoothie made of cereal, hot sauce, and pickle juice on webcam or eat a spoonful of straight butter on camera?",
    optionA: "Pickle hot sauce smoothie",
    optionB: "Spoonful of straight butter"
  },
  {
    id: 'on-wyr-unh-10',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    text: "Would you rather permanently have a 3-second audio delay on every sentence you speak in calls or have a loud rooster crow sound effect play whenever you unmute?",
    optionA: "3-second voice delay",
    optionB: "Rooster crow on unmute"
  },
  {
    id: 'on-wyr-unh-11',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    text: "Would you rather have an AI clone of your voice constantly join random voice channels to argue with strangers or have your search history printed out as a book?",
    optionA: "AI voice clone arguing in calls",
    optionB: "Search history printed as book"
  },
  {
    id: 'on-wyr-unh-12',
    gameId: 'would-you-rather',
    category: 'unhinged',
    playMode: 'online',
    text: "Would you rather sleep on your keyboard with your mic hot on Discord for 8 hours or let everyone in call change your profile banner to whatever they want?",
    optionA: "Sleep on keyboard with hot mic",
    optionB: "Group chooses profile banner"
  },

  // Couples:
  {
    id: 'on-wyr-cpl-9',
    gameId: 'would-you-rather',
    category: 'couples',
    playMode: 'online',
    text: "Would you rather fall asleep on a video call together every single night or wake up to a personalized 2-minute voice note every single morning?",
    optionA: "Sleep on video call every night",
    optionB: "Morning voice note every day"
  },
  {
    id: 'on-wyr-cpl-10',
    gameId: 'would-you-rather',
    category: 'couples',
    playMode: 'online',
    text: "Would you rather spend an entire evening reading each other love letters on a candlelit video call or watch our favorite movie with synced audio in the dark?",
    optionA: "Candlelit love letter reading",
    optionB: "Synced movie in the dark"
  },
  {
    id: 'on-wyr-cpl-11',
    gameId: 'would-you-rather',
    category: 'couples',
    playMode: 'online',
    text: "Would you rather have me surprise you by showing up at your door unannounced or plan an elaborate virtual anniversary date with delivered food?",
    optionA: "Surprise doorstep arrival",
    optionB: "Elaborate virtual date night"
  },
  {
    id: 'on-wyr-cpl-12',
    gameId: 'would-you-rather',
    category: 'couples',
    playMode: 'online',
    text: "Would you rather whisper your deepest secrets into the microphone until 4 AM or make a collaborative playlist that tells the entire story of our relationship?",
    optionA: "Late night mic secrets until 4 AM",
    optionB: "Story playlist together"
  },

  // 18+:
  {
    id: 'on-wyr-18-9',
    gameId: 'would-you-rather',
    category: '18+',
    playMode: 'online',
    text: "Would you rather have a private steamy FaceTime session with someone in this circle or receive a set of explicit photos from them right now?",
    optionA: "Steamy FaceTime session",
    optionB: "Explicit photo set"
  },
  {
    id: 'on-wyr-18-10',
    gameId: 'would-you-rather',
    category: '18+',
    playMode: 'online',
    text: "Would you rather confess your most intense bedroom fantasy out loud on call or roleplay a seductive scenario over microphone for 60 seconds?",
    optionA: "Confess bedroom fantasy",
    optionB: "60-second mic roleplay"
  },
  {
    id: 'on-wyr-18-11',
    gameId: 'would-you-rather',
    category: '18+',
    playMode: 'online',
    text: "Would you rather give someone here complete control over your remote-controlled adult toy or give them complete command over what you wear to bed on camera?",
    optionA: "Toy app control",
    optionB: "Bedtime outfit command on cam"
  },
  {
    id: 'on-wyr-18-12',
    gameId: 'would-you-rather',
    category: '18+',
    playMode: 'online',
    text: "Would you rather have a partner who is completely uninhibited in voice calls or one who sends mind-blowing erotic messages all day long?",
    optionA: "Uninhibited in voice calls",
    optionB: "Mind-blowing texts all day"
  },

  // Spicy:
  {
    id: 'on-wyr-spicy-9',
    gameId: 'would-you-rather',
    category: 'spicy',
    playMode: 'online',
    text: "Would you rather do a slow sensual striptease on camera down to your underwear or let someone on call give you explicit audio commands while you touch yourself?",
    optionA: "Sensual camera striptease",
    optionB: "Audio commands while touching"
  },
  {
    id: 'on-wyr-spicy-10',
    gameId: 'would-you-rather',
    category: 'spicy',
    playMode: 'online',
    text: "Would you rather have your partner watch you reach climax on webcam without them touching themselves or climax together simultaneously on call?",
    optionA: "Watch solo climax on cam",
    optionB: "Simultaneous climax on call"
  },
  {
    id: 'on-wyr-spicy-11',
    gameId: 'would-you-rather',
    category: 'spicy',
    playMode: 'online',
    text: "Would you rather send a 15-second audio clip of your breathy moans to your favorite person here or show off your favorite intimate toy on camera?",
    optionA: "Breathy moan audio clip",
    optionB: "Show intimate toy on camera"
  },
  {
    id: 'on-wyr-spicy-12',
    gameId: 'would-you-rather',
    category: 'spicy',
    playMode: 'online',
    text: "Would you rather have a partner tell you dirty, filthy things in your ear while you're gaming on call or have them send teasing NSFW photos while you're in a meeting?",
    optionA: "Dirty talk while gaming",
    optionB: "NSFW tease during meetings"
  },

  // Kids:
  {
    id: 'on-wyr-kids-9',
    gameId: 'would-you-rather',
    category: 'kids',
    playMode: 'online',
    text: "Would you rather be able to turn your computer screen into a portal to any cartoon world or have a magic pet unicorn that helps with homework?",
    optionA: "Cartoon world portal",
    optionB: "Homework helper unicorn"
  },
  {
    id: 'on-wyr-kids-10',
    gameId: 'would-you-rather',
    category: 'kids',
    playMode: 'online',
    text: "Would you rather have shoes that let you bounce 50 feet into the sky like a kangaroo or a backpack that shoots unlimited bubbles?",
    optionA: "50-foot kangaroo bounce shoes",
    optionB: "Unlimited bubble backpack"
  },
  {
    id: 'on-wyr-kids-11',
    gameId: 'would-you-rather',
    category: 'kids',
    playMode: 'online',
    text: "Would you rather have a bedroom made entirely out of trampolines or a slide from your bed directly into your kitchen?",
    optionA: "Trampoline bedroom",
    optionB: "Bed slide into kitchen"
  },
  {
    id: 'on-wyr-kids-12',
    gameId: 'would-you-rather',
    category: 'kids',
    playMode: 'online',
    text: "Would you rather be able to speak fluent dog and cat or be able to fly like an eagle whenever you wear a red cape?",
    optionA: "Speak fluent dog and cat",
    optionB: "Fly with a red cape"
  }
];


export const ONLINE_WOULD_YOU_RATHER_PROMPTS: PromptItem[] = [...BASE_ONLINE_WOULD_YOU_RATHER_PROMPTS, ...ONLINE_WOULD_YOU_RATHER_EXPANSION];
