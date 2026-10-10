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
    id: 'on-dr-easy-3',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Change your Discord server nickname or call display name to 'Chief Clownsman' until the game ends.",
    forfeit: "Do 5 desk push-ups on camera"
  },
  {
    id: 'on-dr-easy-4',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Bring your favorite snack to the webcam and do an exaggerated ASMR eating sound review for 15 seconds.",
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
    id: 'on-dr-easy-6',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Send the 1st recommended GIF when you type 'confused screaming' into the chat.",
    forfeit: "Take 1 remote drink sip"
  },

  // ==========================================
  // MEDIUM (Awkward, interactive, webcam-focused dares)
  // ==========================================
  {
    id: 'on-dr-med-1',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Share your screen for 10 seconds showing only your desktop wallpaper and messy desktop file shortcuts.",
    forfeit: "Take 2 remote penalty sips"
  },
  {
    id: 'on-dr-med-2',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Read the last text notification currently on your phone lock screen out loud without omitting any details.",
    forfeit: "Take 2 remote penalty sips"
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
    id: 'on-dr-med-5',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Send a voice note to the group chat singing the chorus of your most guilty pleasure song.",
    forfeit: "Take 2 remote penalty sips"
  },
  {
    id: 'on-dr-med-6',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Hold complete unbroken eye contact with your webcam lens for 30 seconds without blinking or laughing.",
    forfeit: "Take 2 remote penalty sips"
  },

  // ==========================================
  // EXTREME (High tension, crazy screen shares & social stakes)
  // ==========================================
  {
    id: 'on-dr-ext-1',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Screen-share your browser search history and scroll down through the last 20 entries live on call.",
    forfeit: "Finish your drink or take 3 large penalty gulps"
  },
  {
    id: 'on-dr-ext-2',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Unmute and let the group dictate a text message you must send to your most recent contact on Instagram or WhatsApp.",
    forfeit: "Take 3 heavy penalty sips"
  },
  {
    id: 'on-dr-ext-3',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Show your phone's weekly Screen Time breakdown page to the camera lens without hiding the apps.",
    forfeit: "Take 3 penalty sips"
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

  // ==========================================
  // UNHINGED (Chaotic, absurd, boundary-pushing)
  // ==========================================
  {
    id: 'on-dr-unh-1',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    text: "Grab a bottle of hot sauce or mustard from your kitchen and take a spoonful straight on webcam.",
    forfeit: "Take 3 penalty sips while barking like a dog"
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
  {
    id: 'on-dr-cpl-4',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Order my favorite snack or comfort food to my door on DoorDash or UberEats right now as a surprise delivery.",
    forfeit: "Promise to plan our next entire weekend date"
  },

  // ==========================================
  // 18+ (Mature adult dares, provocative remote interactions)
  // ==========================================
  {
    id: 'on-dr-18-1',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Show your camera roll's 'Hidden' album count or most recently deleted photo count without opening the folder.",
    forfeit: "Take 2 heavy penalty sips"
  },
  {
    id: 'on-dr-18-2',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Unmute and whisper your most scandalous NSFW fantasy into your mic using your deepest, most seductive voice.",
    forfeit: "Take 3 heavy penalty sips"
  },
  {
    id: 'on-dr-18-3',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Reveal the most explicit text or DM you have sent or received in the past 30 days.",
    forfeit: "Take 3 penalty drinks"
  },
  {
    id: 'on-dr-18-4',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Remove one article of clothing on webcam (jacket, socks, outer shirt) and keep it off for the rest of the game.",
    forfeit: "Take 2 penalty sips"
  },

  // ==========================================
  // SPICY (Sensual, sexually explicit remote dares)
  // ==========================================
  {
    id: 'on-dr-spicy-1',
    gameId: 'dare-roulette',
    category: 'spicy',
    playMode: 'online',
    text: "Adjust your webcam angle down, unbutton your top 2 buttons, and slowly trace your collarbone for 20 seconds.",
    forfeit: "Take 3 penalty sips or send an unfiltered spicy photo in private DM"
  },
  {
    id: 'on-dr-spicy-2',
    gameId: 'dare-roulette',
    category: 'spicy',
    playMode: 'online',
    text: "Turn your mic sensitivity up and let out your most genuine, breathless moan directly into the microphone.",
    forfeit: "Take 3 heavy penalty sips"
  },
  {
    id: 'on-dr-spicy-3',
    gameId: 'dare-roulette',
    category: 'spicy',
    playMode: 'online',
    text: "Slip your hand inside your waistband on camera and describe exactly what it feels like right now.",
    forfeit: "Down your entire drink"
  },
  {
    id: 'on-dr-spicy-4',
    gameId: 'dare-roulette',
    category: 'spicy',
    playMode: 'online',
    text: "Lick your lips and whisper in detail exactly how you would take control of the person of your choice in this call.",
    forfeit: "Take 3 penalty drinks"
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
  {
    id: 'on-dr-kids-2',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Make your silliest funny face at the camera and hold it completely frozen for 15 seconds.",
    forfeit: "Make a loud duck quacking sound"
  },
  {
    id: 'on-dr-kids-3',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Sing 'Happy Birthday' to the camera in a squeaky squirrel chipmunk voice.",
    forfeit: "Give yourself a high-five on camera"
  },
  {
    id: 'on-dr-kids-4',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Show the camera your absolute favorite stuffed animal, toy, or drawing and tell why it's the coolest.",
    forfeit: "Do 3 bunny hops on camera"
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
    id: 'on-dr-easy-8',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Speak in a heavy pirate accent every time you speak for the next 2 turns on call.",
    forfeit: "Take 1 sip"
  },
  {
    id: 'on-dr-easy-9',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Show the camera your refrigerator or pantry's weirdest expired sauce bottle.",
    forfeit: "Do 5 desk jumping jacks on cam"
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
    id: 'on-dr-easy-11',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Deliver a dramatic Shakespearean monologue about how much you love chicken nuggets.",
    forfeit: "Take 1 sip"
  },

  // ==========================================
  // EXPANDED MEDIUM (Relatable webcam & call dares)
  // ==========================================
  {
    id: 'on-dr-med-7',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Show your phone battery percentage and most used emoji to the webcam right now.",
    forfeit: "Take 2 remote penalty sips"
  },
  {
    id: 'on-dr-med-8',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Read the last unsent draft in your notes or message app out loud without censoring.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-med-9',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Let the call pick any Wikipedia article and you must read the intro like a breaking news anchor.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-med-10',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Unmute and let the call hear you recite your favorite motivational quote while striking an intense superhero pose.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-med-11',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Change your call nickname to 'Worst Gamer NA' for the next 30 minutes.",
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
    id: 'on-dr-ext-7',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Send a DM to your 3rd most recent contact on Instagram asking 'Do you remember what you promised me?' and show the sent receipt.",
    forfeit: "Take 3 heavy penalty sips"
  },
  {
    id: 'on-dr-ext-8',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Screen-share your YouTube or TikTok watch history from the last 2 hours.",
    forfeit: "Take 3 penalty sips"
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
  {
    id: 'on-dr-unh-7',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    text: "Draw a funny mustache on your face with a washable marker or lipstick live on camera.",
    forfeit: "Take 3 penalty sips"
  },
  {
    id: 'on-dr-unh-8',
    gameId: 'dare-roulette',
    category: 'unhinged',
    playMode: 'online',
    text: "Eat a slice of raw lemon or onion on webcam without making a single reaction face.",
    forfeit: "Take 3 penalty sips"
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
    id: 'on-dr-cpl-6',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Send a private screenshot of your favorite picture of us to the chat and explain why it's special.",
    forfeit: "Take 1 romantic penalty sip together"
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
    id: 'on-dr-18-6',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Show your phone's 'Recently Deleted' photo album counter on webcam without tapping into the album.",
    forfeit: "Take 3 heavy penalty sips"
  },
  {
    id: 'on-dr-18-7',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Remove your socks or shoes on camera and describe your favorite kind of sensual touch.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-18-8',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Rate the vocal attractiveness of everyone on this call from 1-10 with brutal honesty.",
    forfeit: "Take 3 penalty drinks"
  },

  // ==========================================
  // EXPANDED SPICY (Sensual webcam & teasing dares)
  // ==========================================
  {
    id: 'on-dr-spicy-5',
    gameId: 'dare-roulette',
    category: 'spicy',
    playMode: 'online',
    text: "Lower your webcam angle, slowly run your fingertips down your neck and chest for 20 seconds, and hold camera eye contact.",
    forfeit: "Take 3 heavy penalty sips or send a spicy DM"
  },
  {
    id: 'on-dr-spicy-6',
    gameId: 'dare-roulette',
    category: 'spicy',
    playMode: 'online',
    text: "Turn down your room lights, whisper your dirtiest fantasy directly into the microphone for 30 seconds uninterrupted.",
    forfeit: "Down your entire drink"
  },
  {
    id: 'on-dr-spicy-7',
    gameId: 'dare-roulette',
    category: 'spicy',
    playMode: 'online',
    text: "Bite your lip on webcam and show the camera the view from under your desk for 10 seconds.",
    forfeit: "Take 3 penalty drinks"
  },
  {
    id: 'on-dr-spicy-8',
    gameId: 'dare-roulette',
    category: 'spicy',
    playMode: 'online',
    text: "Send a private spicy voice note to the person of your choice in this call telling them exactly what they do to your body.",
    forfeit: "Take 3 penalty drinks"
  },

  // ==========================================
  // EXPANDED KIDS (Silly, wholesome actions)
  // ==========================================
  {
    id: 'on-dr-kids-5',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Do your best superhero landing pose on camera with an epic battle sound effect!",
    forfeit: "Spin around 3 times in your chair"
  },
  {
    id: 'on-dr-kids-6',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Pretend you are an astronaut floating in zero gravity for 20 seconds on webcam!",
    forfeit: "Make a laser blaster sound 5 times"
  },
  {
    id: 'on-dr-kids-7',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Speak like a talking parrot for the next turn, repeating everything someone says!",
    forfeit: "Flap your arms like a bird"
  },
  {
    id: 'on-dr-kids-8',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Draw a funny doodle on a piece of paper in 15 seconds and show it to the camera!",
    forfeit: "Give a big double thumbs-up to the camera"
  },

  // --- ADDITIONAL ONLINE DARE ROULETTE EXPANSION (100+ PROMPTS) ---
  // Easy:
  {
    id: 'on-dr-easy-12',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Type 'I am the keyboard champion' using only your nose in the text chat right now.",
    forfeit: "Take 1 penalty sip"
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
    id: 'on-dr-easy-14',
    gameId: 'dare-roulette',
    category: 'easy',
    playMode: 'online',
    text: "Mute your mic and give a 30-second silent news broadcast using exaggerated mouth movements.",
    forfeit: "Drink 2 sips of water"
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
    id: 'on-dr-med-13',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Show the most chaotic corner of your room on webcam and explain why it's structured that way.",
    forfeit: "Take 2 penalty sips"
  },
  {
    id: 'on-dr-med-14',
    gameId: 'dare-roulette',
    category: 'medium',
    playMode: 'online',
    text: "Go to your camera roll and send the 7th most recent screenshot into the call text channel.",
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

  // Extreme:
  {
    id: 'on-dr-ext-11',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Screen-share your browser history search bar and type the letter 'h' without hitting backspace.",
    forfeit: "Take 3 heavy penalty sips"
  },
  {
    id: 'on-dr-ext-12',
    gameId: 'dare-roulette',
    category: 'extreme',
    playMode: 'online',
    text: "Send a voice note to your contact #3 saying 'Hey, I had a crazy dream about you last night' and do not elaborate.",
    forfeit: "Finish your entire drink"
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
    id: 'on-dr-cpl-11',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Mute other apps, lean in close to the microphone, and whisper 3 things you are going to do to me the next time we meet.",
    forfeit: "Down your drink"
  },
  {
    id: 'on-dr-cpl-12',
    gameId: 'dare-roulette',
    category: 'couples',
    playMode: 'online',
    text: "Sing our special song chorus directly into the mic while looking dead into the camera without breaking eye contact.",
    forfeit: "Take 2 penalty sips"
  },

  // 18+:
  {
    id: 'on-dr-18-9',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Unbutton the top two buttons of your shirt on camera and take a slow, deliberate sip while maintaining eye contact.",
    forfeit: "Take 3 penalty drinks"
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
    id: 'on-dr-18-11',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Describe in vivid, sensual detail what outfit or lingerie makes you feel the most dangerous in bed.",
    forfeit: "Take 2 penalty drinks"
  },
  {
    id: 'on-dr-18-12',
    gameId: 'dare-roulette',
    category: '18+',
    playMode: 'online',
    text: "Let the group hear 3 seconds of a heavy breath into your microphone with the lights dimmed in your room.",
    forfeit: "Take 3 penalty drinks"
  },

  // Spicy:
  {
    id: 'on-dr-spicy-9',
    gameId: 'dare-roulette',
    category: 'spicy',
    playMode: 'online',
    text: "Slowly bite your lower lip, run your hand through your hair, and whisper 'you have no idea what you do to me' into the mic.",
    forfeit: "Take 3 heavy penalty sips"
  },
  {
    id: 'on-dr-spicy-10',
    gameId: 'dare-roulette',
    category: 'spicy',
    playMode: 'online',
    text: "Show the camera your bare collarbones and whisper your favorite place on your body to be kissed.",
    forfeit: "Down your glass"
  },
  {
    id: 'on-dr-spicy-11',
    gameId: 'dare-roulette',
    category: 'spicy',
    playMode: 'online',
    text: "Send a 5-second video DM of your breathing to someone on this call with your eyes half-closed.",
    forfeit: "Take 3 penalty sips"
  },
  {
    id: 'on-dr-spicy-12',
    gameId: 'dare-roulette',
    category: 'spicy',
    playMode: 'online',
    text: "Tell the group your favorite time of day to be touched and the exact pace you like it.",
    forfeit: "Take 3 penalty drinks"
  },

  // Kids:
  {
    id: 'on-dr-kids-9',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Do your best impression of a funny frog hopping on camera for 10 seconds with ribbit sounds!",
    forfeit: "Make 5 funny duck quacks"
  },
  {
    id: 'on-dr-kids-10',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Grab a stuffed animal and have it interview you like a world-famous television reporter!",
    forfeit: "Do 3 giant jumping jacks"
  },
  {
    id: 'on-dr-kids-11',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Make up a 10-second rap about peanut butter and jelly sandwiches right on the spot!",
    forfeit: "Wiggle your ears or nose"
  },
  {
    id: 'on-dr-kids-12',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Balance a clean sock or pillow on your foot while lifting it in front of the camera for 10 seconds!",
    forfeit: "Spin around twice in your chair"
  },
  {
    id: 'on-dr-kids-13',
    gameId: 'dare-roulette',
    category: 'kids',
    playMode: 'online',
    text: "Pretend your computer mouse is a magical spaceship and fly it through the air with spaceship sounds!",
    forfeit: "Give the webcam a high-five"
  }
];


export const ONLINE_DARE_ROULETTE_PROMPTS: PromptItem[] = [...BASE_ONLINE_DARE_ROULETTE_PROMPTS, ...ONLINE_DARE_ROULETTE_EXPANSION];
