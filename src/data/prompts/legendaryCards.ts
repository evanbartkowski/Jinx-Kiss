import { PromptItem } from '../../types/game';
import { UNHINGED_LEGENDARY_CARDS } from './unhinged';

/**
 * JINX KISS — RARE LEGENDARY CARDS
 * Curated, high-voltage, unforgettable Legendary prompts for each of the 8 categories.
 * Each card features `isLegendary: true`, `rarity: 'legendary'`, and an epic `legendaryTitle`.
 */
export const LEGENDARY_CARDS: PromptItem[] = [
  ...UNHINGED_LEGENDARY_CARDS,
  // ==========================================
  // 1. KIDS CATEGORY (Super silly, epic, clean)
  // ==========================================
  {
    id: 'leg-kids-1',
    gameId: 'truth-or-dare',
    category: 'kids',
    type: 'dare',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY DARE ★',
    text: 'The Alien Royalty: For the next 3 rounds, you are the Grand Emperor of Planet Zorg! You must speak only in a high-pitched alien robot voice, and everyone must bow before speaking to you!'
  },
  {
    id: 'leg-kids-2',
    gameId: 'truth-or-dare',
    category: 'kids',
    type: 'truth',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'The Bizarre Feast: If you had to eat only one weird food combo for every meal for a whole year (ketchup on pancakes, chocolate milk with pickles, or mustard on watermelon), what are you choosing and what does your breakfast look like?'
  },
  {
    id: 'leg-kids-3',
    gameId: 'would-you-rather',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather have feathers instead of hair and squawk like a rooster whenever someone sneezes OR have roller skates permanently attached to your feet for an entire week?',
    optionA: 'Feather hair & rooster squawk on every sneeze',
    optionB: 'Permanent roller skates on your feet for 7 days'
  },
  {
    id: 'leg-kids-4',
    gameId: 'never-have-i-ever',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever tried a bite of a dog biscuit or pet treat on a dare just to see what it tasted like.'
  },
  {
    id: 'leg-kids-5',
    gameId: 'hot-takes',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'Pizza crust is completely useless and only exists as an edible napkin handle to prevent grease on your fingers.',
    discussionPrompt: 'Do you eat your crust or leave the bone pile on the plate?'
  },
  {
    id: 'leg-kids-6',
    gameId: 'dare-roulette',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'The Sloth Curse: You must perform every single movement and word in super slow motion (1/10th speed) for the next 2 full rounds! If you break character, do 10 frog hops!'
  },
  {
    id: 'leg-kids-7',
    gameId: 'red-flag-green-flag',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'They eat cereal by pouring the milk into the bowl FIRST, then adding 4 spoonfuls of cereal at a time so it never gets soggy.'
  },
  {
    id: 'leg-kids-8',
    gameId: 'truth-or-sip',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY FORFEIT ★',
    text: 'The Master Rulebreaker: Confess the funniest rule you broke at home or school without getting caught, or perform the Chicken Dance with full rooster sounds for 30 seconds!',
    "forfeit": "Do your funniest animal impression."
  },
  {
    id: 'leg-kids-9',
    gameId: 'point-and-drink',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'On the count of 3, point to the player who would accidentally set off the fire alarm while trying to toast a Pop-Tart!'
  },
  {
    id: 'leg-kids-10',
    gameId: 'most-likely-to',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to build a secret cardboard fort in the living room and successfully live in it for an entire weekend without being found?'
  },
  {
    id: 'leg-kids-11',
    gameId: 'confessions',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the most ridiculous made-up story you told on the playground that other kids actually believed was 100% scientific fact!'
  },
  {
    id: 'leg-kids-12',
    gameId: 'hot-seat',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'The 45-Second Silly Blitz: You have 45 seconds to answer 5 lightning-fast silly questions from the group without laughing or cracking a smile once!'
  },

  // ==========================================
  // 2. EASY CATEGORY (Fun, low-stakes, memorable)
  // ==========================================
  {
    id: 'leg-easy-1',
    gameId: 'truth-or-dare',
    category: 'easy',
    type: "dare",
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '? LEGENDARY DARE ?',
    text: 'The Camera Roll Lottery: Unlock your phone right now, open your photo gallery, scroll with your eyes closed for 5 seconds, and show the photo your finger lands on to the entire room!'
  },
  {
    id: 'leg-easy-2',
    gameId: 'truth-or-dare',
    category: 'easy',
    type: 'dare',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY DARE ★',
    text: 'The Shakespearian Curse: Deliver your next 3 comments or answers in full dramatic Shakespearean soliloquy, with theatrical pauses and hand gestures, or do 10 pushups!'
  },
  {
    id: 'leg-easy-3',
    gameId: 'would-you-rather',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather have all your Google search queries from the past 14 days read aloud by Siri to everyone here OR let the person to your left post a 5-word text status on your primary social account?',
    optionA: 'Siri reads last 14 days of Google searches',
    optionB: 'Player on left posts a status on your account'
  },
  {
    id: 'leg-easy-4',
    gameId: 'never-have-i-ever',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever stalked someone so far back on Instagram or TikTok that I accidentally liked a post or photo from over 4 years ago in sheer panic.'
  },
  {
    id: 'leg-easy-5',
    gameId: 'hot-takes',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'Leaving a shopping cart stranded in an empty parking space instead of walking it to the corral reveals that someone is an untrustworthy person at their core.',
    discussionPrompt: 'Do you judge someone immediately if they leave a cart in an empty parking spot?'
  },
  {
    id: 'leg-easy-6',
    gameId: 'dare-roulette',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'The Voice Mimic Roulette: The room assigns you a recognizable persona (Gordon Ramsay, Batman, or Siri); you cannot break character or voice until your next turn or take 2 drinks!'
  },
  {
    id: 'leg-easy-7',
    gameId: 'red-flag-green-flag',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'On the first date, they reach over without asking and take food off your plate before you have even taken your first bite.'
  },
  {
    id: 'leg-easy-8',
    gameId: 'truth-or-sip',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'The Petty Ghost Confession: Name the single most ridiculous or petty reason you ever ghosted someone or stopped texting back, or take 2 hefty sips!',
    "forfeit": "Take a sip of any drink, or pass."
  },
  {
    id: 'leg-easy-9',
    gameId: 'point-and-drink',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to the person in the room who would accidentally join an eccentric cult simply because they were too polite to say no to free snacks and chamomile tea!'
  },
  {
    id: 'leg-easy-10',
    gameId: 'most-likely-to',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to win a massive jackpot and blow every cent on absurd gadgets, weird collectibles, and impulsive vacations within 18 months?'
  },
  {
    id: 'leg-easy-11',
    gameId: 'confessions',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the dumbest late-night 2 AM online purchase you made that arrived at your door and made you instantly question your financial judgment.'
  },
  {
    id: 'leg-easy-12',
    gameId: 'hot-seat',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'The Nostalgia Interrogation: The room has 60 uninterrupted seconds to cross-examine you about your most cringe-inducing middle school phase. Full truth required!'
  },
  {
    id: 'leg-med-2',
    gameId: 'truth-or-dare',
    category: 'medium',
    type: 'dare',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY DARE ★',
    text: 'The Urgent Speakerphone Call: Call a mutual friend not in this room on speakerphone and urgently whisper: "Whatever happens tonight, do NOT check my trunk." Hang up immediately after 15 seconds without laughing!'
  },
  {
    id: 'leg-med-4',
    gameId: 'never-have-i-ever',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever invented a fake family emergency, phantom illness, or imaginary work crisis just to escape hanging out with someone in this room.'
  },
  {
    id: 'leg-med-5',
    gameId: 'hot-takes',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'Every close friend group has one member everyone secretly vents about behind their back, and someone in this room knows exactly who it is.',
    discussionPrompt: 'Is this true in your past or present social circles?'
  },
  {
    id: 'leg-med-6',
    gameId: 'dare-roulette',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'The Public Broadcast: The player to your right writes a mysterious, cryptic one-sentence story status and publishes it on your social feed for 20 minutes, or you take 3 penalty sips!'
  },
  {
    id: 'leg-med-7',
    gameId: 'red-flag-green-flag',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'They keep a private spreadsheet or notes document ranking everyone they have ever dated with numerical scores on hygiene, conversation, and emotional stability.'
  },
  {
    id: 'leg-med-8',
    gameId: 'truth-or-sip',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'The Brutal Truth: Name someone you personally know who you think is an absolute disaster of a human being, with full reasoning, or finish your entire drink right now!',
    "forfeit": "Take a sip of any drink, or pass."
  },
  {
    id: 'leg-med-9',
    gameId: 'point-and-drink',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to the person whose current love life or situationship is the most entertaining, high-drama disaster to watch from the sidelines. Winner takes 2 drinks!'
  },
  {
    id: 'leg-med-10',
    gameId: 'most-likely-to',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to get detained at an international airport for making a sarcastic, terribly timed comment to border security?'
  },
  {
    id: 'leg-med-11',
    gameId: 'confessions',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the most petty, calculated revenge you ever pulled off against a roommate, ex, or coworker that they still have no idea was done by you.'
  },
  {
    id: 'leg-med-12',
    gameId: 'hot-seat',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'The Rapid-Fire Inquest: 60 seconds of zero hesitation! The group can ask you 5 consecutive juicy personal questions, and you have 2 seconds max to answer each!'
  },

  // ==========================================
  // 4. EXTREME CATEGORY (Wild, high-stakes, bold)
  // ==========================================
  {
    id: 'leg-ext-1',
    gameId: 'truth-or-dare',
    category: 'extreme',
    type: 'dare',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY DARE ★',
    text: 'The Central Table Surveillance: Unlock your phone and place it face-up in the dead center of the table. For the next 3 rounds, ANY text, call, or notification that comes in MUST be read out loud to the room by whoever grabs it first!'
  },
  {
    id: 'leg-ext-2',
    gameId: 'truth-or-dare',
    category: 'extreme',
    type: 'truth',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'The Forbidden Truth: What is the single most scandalous secret you know about someone sitting in this room that you swore on your life you would take to the grave?'
  },
  {
    id: 'leg-ext-3',
    gameId: 'would-you-rather',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather let the room scroll through your "Recently Deleted" photo folder for 60 uninterrupted seconds OR let the group pick a temporary marker tattoo to draw on your face/neck for the night?',
    optionA: '60 seconds of group scrolling deleted photos',
    optionB: 'Group draws marker tattoo on your face/neck'
  },
  {
    id: 'leg-ext-4',
    gameId: 'never-have-i-ever',
    category: "18+",
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever hooked up in a dangerously public or forbidden location where we were literally seconds away from getting arrested or caught by security.'
  },
  {
    id: 'leg-ext-5',
    gameId: 'hot-takes',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'True lifelong monogamy is an unnatural social construct that at least 70% of people secretly fight against, whether they ever admit it to their partner or not.',
    discussionPrompt: 'Do you believe humans are biologically built for lifelong monogamy?'
  },
  {
    id: 'leg-ext-7',
    gameId: 'red-flag-green-flag',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'They casually reveal that they still have permanent real-time GPS location sharing enabled with their ex "just in case an emergency happens".'
  },
  {
    id: 'leg-ext-8',
    gameId: 'truth-or-sip',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'The Deep Vault: Confess the deepest, darkest secret or morally gray act you have actively concealed from your closest friends and family, or drain your entire drink and take another penalty!',
    "forfeit": "Take a sip of any drink, or pass."
  },
  {
    id: 'leg-ext-9',
    gameId: 'point-and-drink',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to the person in this room who would survive the absolute shortest amount of time if dropped into an apocalyptic survival scenario. Most voted finishes their drink!'
  },
  {
    id: 'leg-ext-10',
    gameId: 'most-likely-to',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to fake their own disappearance or assume a completely new identity in another country to escape their mounting personal drama?'
  },
  {
    id: 'leg-ext-11',
    gameId: 'confessions',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the most reckless, legally dubious, or unhinged thing you have ever done that by all rights should have landed you in jail or hospital.'
  },
  {
    id: 'leg-ext-12',
    gameId: 'hot-seat',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'The Grand Inquisitor: 90 seconds in the hot seat with zero immunity! The group can ask you 3 unfiltered, no-limits questions. Refuse any and you take 3 double penalty drinks!'
  },

  // ==========================================
  // 6. COUPLES CATEGORY (Romantic tension, love)
  // ==========================================
  {
    id: 'leg-cpl-1',
    gameId: 'truth-or-dare',
    category: 'couples',
    type: 'dare',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY COUPLES DARE ★',
    text: 'The Soul Lock: Sit knee-to-knee with your partner, interlock fingers, and hold unbroken eye contact for 60 seconds without speaking, laughing, or looking away. When time is up, whisper the exact moment you knew you were head-over-heels in love with them.'
  },
  {
    id: 'leg-cpl-2',
    gameId: 'truth-or-dare',
    category: 'couples',
    type: 'truth',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY COUPLES TRUTH ★',
    text: 'The Unspoken Longing: What is a deep emotional longing, romantic fantasy, or vulnerable secret you have hesitated to say out loud to your partner because you feared being judged or misunderstood?'
  },
  {
    id: 'leg-cpl-3',
    gameId: 'would-you-rather',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather have your partner be able to hear your exact unfiltered thoughts whenever they touch your skin OR have to relive your most awkward first date every single anniversary for the rest of your lives?',
    optionA: 'Partner hears your thoughts on skin contact',
    optionB: 'Relive awkward first date every anniversary'
  },
  {
    id: 'leg-cpl-4',
    gameId: 'never-have-i-ever',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever stayed awake past 2 AM silently looking at my partner sleeping while being overwhelmed by a wave of pure gratitude that they chose me.'
  },
  {
    id: 'leg-cpl-5',
    gameId: 'hot-takes',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'In every long-term relationship, one person secretly loves slightly harder and cares slightly more, and that power balance shifts back and forth constantly over time.',
    discussionPrompt: 'Do you agree that love in relationships is rarely a perfect 50/50 balance?'
  },
  {
    id: 'leg-cpl-6',
    gameId: 'dare-roulette',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'The Electric Touch: Close your eyes. Your partner has 45 seconds to trace their fingertips, lips, and breath across your neck, collarbone, and hands. If your heartbeat does not visibly race, you owe them breakfast in bed tomorrow!'
  },
  {
    id: 'leg-cpl-7',
    gameId: 'red-flag-green-flag',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'By date number two, they already had a secret private Pinterest board with your wedding theme, living room furniture layout, and joint pet names fully organized.'
  },
  {
    id: 'leg-cpl-8',
    gameId: 'truth-or-sip',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'The Irresistible Trigger: Confess the one specific outfit, scent, glance, or gesture your partner does that makes you instantly lose all composure and self-control. Answer or both take a sip!',
    "forfeit": "Take a sip of any drink, or pass."
  },
  {
    id: 'leg-cpl-9',
    gameId: 'point-and-drink',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to who in the relationship fell in love first, and point to who takes 5x longer to swallow their pride and apologize after an argument. Loser takes a sip!'
  },
  {
    id: 'leg-cpl-12',
    gameId: 'hot-seat',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'The Immunity Interrogation: Your partner has 60 seconds of complete, unconditional immunity to ask you 3 burning questions you have been dodging or deflecting. Total honesty required!'
  },

  // ==========================================
  // 7. SPICY CATEGORY (Flirty, dirty talk, kinks)
  // ==========================================
  {
    id: 'leg-spicy-1',
    gameId: 'truth-or-dare',
    category: "18+",
    type: 'dare',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPICY DARE ★',
    text: 'The Sensory Blindfold: Put on a blindfold. The player of your choice has 35 seconds to slowly trace their warm breath, fingertips, and whispers along your neck, jawline, and collarbone without touching your lips. If you shiver or pull back, take 2 penalty drinks!'
  },
  {
    id: 'leg-spicy-2',
    gameId: 'truth-or-dare',
    category: "18+",
    type: 'truth',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPICY TRUTH ★',
    text: 'The Raw Fantasy: Describe in vivid, heart-pounding detail the single dirtiest, most tantalizing sexual fantasy you replay in your mind that you have never confessed out loud to anyone.'
  },
  {
    id: 'leg-spicy-3',
    gameId: 'would-you-rather',
    category: "18+",
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather be handcuffed to the bed with zero control over what the other person does to tease you OR have total dominant control where they must obey every whispered command you give?',
    optionA: 'Handcuffed with zero control in bed',
    optionB: 'Total dominant control with them obeying'
  },
  {
    id: 'leg-spicy-4',
    gameId: 'never-have-i-ever',
    category: "18+",
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever taken and sent a risky photo so explicit and daring that my pulse was pounding in my throat for the next 20 minutes waiting for their reaction.'
  },
  {
    id: 'leg-spicy-5',
    gameId: 'hot-takes',
    category: "18+",
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'Quiet, polite sex is completely overrated; if you aren\'t leaving marks, losing your breath, and talking filthy, you are doing it completely wrong.',
    discussionPrompt: 'Do you prefer intense passionate dirty talk or gentle romantic rhythm?'
  },
  {
    id: 'leg-spicy-6',
    gameId: 'dare-roulette',
    category: "18+",
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'The Pulse Check: Slide your hand under the shirt of the person on your right and place your palm directly over their bare chest and heartbeat for 25 uninterrupted seconds while holding unbroken eye contact!'
  },
  {
    id: 'leg-spicy-7',
    gameId: 'red-flag-green-flag',
    category: "18+",
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'On date two, they casually mention that their nightstand is fully stocked with silk restraints, blindfolds, and massage oils, and they expect you to take charge on night one.'
  },
  {
    id: 'leg-spicy-8',
    gameId: 'truth-or-sip',
    category: "18+",
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'The Forbidden Kink: What is the filthiest, most unexpected kink you have ever been turned on by? Confess every detail with total honesty or finish your entire drink right now!',
    "forfeit": "Take a sip of any drink, or pass."
  },
  {
    id: 'leg-spicy-9',
    gameId: 'point-and-drink',
    category: "18+",
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to the person whose touch or whisper would cause the most instantaneous, uncontrollable physical reaction in your body. Selected player gives out 3 drinks!'
  },
  {
    id: 'leg-spicy-10',
    gameId: 'most-likely-to',
    category: "18+",
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to own a locked bedside drawer filled with toys, accessories, and gear that would give their parents a heart attack if ever discovered?'
  },
  {
    id: 'leg-spicy-11',
    gameId: 'confessions',
    category: "18+",
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the single dirtiest, most explicit thought or daydream you have had about someone sitting in this room right now.'
  },
  {
    id: 'leg-spicy-12',
    gameId: 'hot-seat',
    category: "18+",
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'The Spicy Crucible: 60 seconds on the hot seat! The group can ask you 3 explicit questions about your dirty talk, endurance, and bedroom kinks. Total honesty only!'
  },

  // ==========================================
  // 8. 18+ CATEGORY (NSFW, explicit, bedroom)
  // ==========================================
  {
    id: 'leg-18p-1',
    gameId: 'truth-or-dare',
    category: '18+',
    type: 'dare',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY 18+ DARE ★',
    text: 'The Bedroom Blueprint: Demonstrate using hand gestures, posture, rhythm, and breathing your absolute favorite position and the exact words spoken that make you lose all self-control in the bedroom!'
  },
  {
    id: 'leg-18p-2',
    gameId: 'truth-or-dare',
    category: '18+',
    type: 'truth',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY 18+ TRUTH ★',
    text: 'The Peak Orgasm: Describe the single wildest, most intense orgasm of your life: where were you, what was happening, what made it so overwhelming, and who made it happen?'
  },
  {
    id: 'leg-18p-3',
    gameId: 'would-you-rather',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather have a 72-hour uninterrupted weekend of rough, uninhibited passion in a secluded penthouse OR a high-adrenaline hookup in a location where someone could walk in on you at any second?',
    optionA: 'Uninhibited weekend in secluded penthouse',
    optionB: 'High-adrenaline hookup where you could get caught'
  },
  {
    id: 'leg-18p-4',
    gameId: 'never-have-i-ever',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever hooked up in an outdoor balcony, moving vehicle, swimming pool, or dressing room with people right outside.'
  },
  {
    id: 'leg-18p-5',
    gameId: 'hot-takes',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'Sexual compatibility accounts for at least 75% of a relationship\'s long-term survival, and anyone claiming emotional connection overrides physical chemistry is lying to themselves.',
    discussionPrompt: 'Can a relationship survive without great sexual chemistry?'
  },
  {
    id: 'leg-18p-6',
    gameId: 'dare-roulette',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'The Graphic Whisper: Lean in and whisper the single filthiest, most explicit sexual act you crave right now directly into the ear of the player chosen by group vote!'
  },
  {
    id: 'leg-18p-7',
    gameId: 'red-flag-green-flag',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'They require being pinned down, light hair pulling, and being given explicit verbal commands every single time you are in bed together.'
  },
  {
    id: 'leg-18p-8',
    gameId: 'truth-or-sip',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'The Kinky Revelation: What is a taboo sexual act or kink you tried once that completely caught you off guard because you ended up genuinely obsessed with it? Spill it all or take 4 drinks!',
    "forfeit": "Take a sip of any drink, or pass."
  },
  {
    id: 'leg-18p-9',
    gameId: 'point-and-drink',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to the person who looks the most innocent and composed on the outside, but is secretly the most ravenous and wild behind closed bedroom doors. Most votes drinks 3!'
  },
  {
    id: 'leg-18p-10',
    gameId: 'most-likely-to',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to accidentally moan someone else\'s name or a completely ridiculous phrase in the absolute heat of passion?'
  },
  {
    id: 'leg-18p-11',
    gameId: 'confessions',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the most taboo, explicit scenario you have ever searched in incognito mode that would leave you mortified if your browsing history was leaked to this room.'
  },
  {
    id: 'leg-editorial-spicy-truth', gameId: 'truth-or-dare', category: 'spicy', type: 'truth',
    isLegendary: true, rarity: 'legendary', legendaryTitle: 'LEGENDARY MISSED SIGNAL',
    text: 'Tell the story of a moment when you realized someone had been flirting with you long after the conversation ended. What line would you finally say back?'
  },
  {
    id: 'leg-editorial-spicy-dare', gameId: 'truth-or-dare', category: 'spicy', type: 'dare',
    isLegendary: true, rarity: 'legendary', legendaryTitle: 'LEGENDARY ROMANTIC AUDITION',
    text: 'With a willing player, audition for a romantic film scene. The group supplies an absurd location and an inconvenient prop; you have 45 seconds to make the chemistry convincing.'
  }
];
