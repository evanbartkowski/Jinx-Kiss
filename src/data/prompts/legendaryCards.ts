import { PromptItem } from '../../types/game';

/**
 * JINX KISS — RARE LEGENDARY CARDS
 * Curated, high-voltage, unforgettable Legendary prompts for each of the 8 categories.
 * Each card features `isLegendary: true`, `rarity: 'legendary'`, and an epic `legendaryTitle`.
 */
export const LEGENDARY_CARDS: PromptItem[] = [
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
    text: 'If you were forced to eat only one bizarre food combination for every meal for a whole year (like ketchup on ice cream or broccoli dipped in chocolate), what would you choose and why?'
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
    text: 'Never have I ever tried a bite of dog biscuit or cat treats just to see what it tasted like.'
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
    text: 'The Sloth Challenge: You must perform every single movement and speech in super slow motion (1/10th speed) for the next 2 full rounds! If you speed up or break character, do 5 frog hops!'
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
    text: 'Name the one rule at home or school you break almost every single day, or do the Chicken Dance for 30 seconds!'
  },
  {
    id: 'leg-kids-9',
    gameId: 'point-and-drink',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'On the count of 3, point to the player who would accidentally set off the fire alarm while trying to microwave popcorn!'
  },
  {
    id: 'leg-kids-10',
    gameId: 'most-likely-to',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to build a secret cardboard fort in their backyard and successfully hide in it for 3 days without getting caught?'
  },
  {
    id: 'leg-kids-11',
    gameId: 'confessions',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the most ridiculous made-up story you told on the playground that other kids actually believed 100%!'
  },
  {
    id: 'leg-kids-12',
    gameId: 'hot-seat',
    category: 'kids',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'The 45-Second Silly Blitz: You have 45 seconds to answer 5 lightning-fast silly questions from the group without laughing or saying "um" once!'
  },

  // ==========================================
  // 2. EASY CATEGORY (Fun, low-stakes, memorable)
  // ==========================================
  {
    id: 'leg-easy-1',
    gameId: 'truth-or-dare',
    category: 'easy',
    type: 'truth',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'Unlock your phone right now, open your photo gallery, and show the group the 7th most recent photo or screenshot without explaining why you have it.'
  },
  {
    id: 'leg-easy-2',
    gameId: 'truth-or-dare',
    category: 'easy',
    type: 'dare',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY DARE ★',
    text: 'Dramatic Opera: Sing your next 3 sentences or comments to the room in full theatrical operatic vibrato with dramatic hand gestures!'
  },
  {
    id: 'leg-easy-3',
    gameId: 'would-you-rather',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather have all your Google search queries from the last 7 days read out loud by Siri to everyone here OR let the person to your left post a text status on your social media?',
    optionA: 'Siri reads last 7 days of Google searches',
    optionB: 'Player on left posts a status on your account'
  },
  {
    id: 'leg-easy-4',
    gameId: 'never-have-i-ever',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever stalked someone so deeply on social media that I accidentally double-tapped and liked a post from 5 years ago in sheer panic.'
  },
  {
    id: 'leg-easy-5',
    gameId: 'hot-takes',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'People who dont return shopping carts to the corral should be placed on a federal no-fly list. It is the ultimate test of human decency.',
    discussionPrompt: 'Do you judge someone immediately if they leave a cart in an empty parking spot?'
  },
  {
    id: 'leg-easy-6',
    gameId: 'dare-roulette',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'The Celebrity Impression: The group picks a famous persona (Gordon Ramsay, Batman, or Christopher Walken); you must speak entirely in their voice until your next turn!'
  },
  {
    id: 'leg-easy-7',
    gameId: 'red-flag-green-flag',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'On the first date, they ask to taste food directly off your fork before you have even taken your first bite.'
  },
  {
    id: 'leg-easy-8',
    gameId: 'truth-or-sip',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'Admit the most superficial reason you ever ghosted someone or stopped talking to a potential crush, or take 2 sips!'
  },
  {
    id: 'leg-easy-9',
    gameId: 'point-and-drink',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to the person in the room who would accidentally join a cult simply because they were too polite to say no to free snacks and tea!'
  },
  {
    id: 'leg-easy-10',
    gameId: 'most-likely-to',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to win the lottery and blow through all the money on ridiculous gadgets and useless investments within 18 months?'
  },
  {
    id: 'leg-easy-11',
    gameId: 'confessions',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the dumbest late-night purchase you made online that arrived in the mail and made you immediately question your sanity.'
  },
  {
    id: 'leg-easy-12',
    gameId: 'hot-seat',
    category: 'easy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'The Awkward Era Trial: The group has 60 seconds to interrogate you about your most embarrassing teenage phase. Full honesty required!'
  },

  // ==========================================
  // 3. MEDIUM CATEGORY (Personal, witty, juicy)
  // ==========================================
  {
    id: 'leg-med-1',
    gameId: 'truth-or-dare',
    category: 'medium',
    type: 'truth',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'Who in this room would you trust the LEAST with your unlocked phone for 10 minutes, and what specific thing are you terrified they would find?'
  },
  {
    id: 'leg-med-2',
    gameId: 'truth-or-dare',
    category: 'medium',
    type: 'dare',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY DARE ★',
    text: 'The Speakerphone Mystery: Call a mutual friend not in this room right now on speakerphone, and urgently whisper: "Whatever happens tonight, do NOT check my trunk." Hang up after 15 seconds without laughing!'
  },
  {
    id: 'leg-med-3',
    gameId: 'would-you-rather',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather everyone in this room see your hidden/deleted photo album OR everyone in this room see your last 10 text messages with your ex or current crush?',
    optionA: 'Everyone sees hidden/deleted album',
    optionB: 'Everyone sees last 10 texts with ex/crush'
  },
  {
    id: 'leg-med-4',
    gameId: 'never-have-i-ever',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever pretended to have a sudden family emergency or fake illness just to escape hanging out with someone in this room.'
  },
  {
    id: 'leg-med-5',
    gameId: 'hot-takes',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: '90% of best friend groups have one member everyone secretly talks about behind their back, and someone in this room knows exactly who it is.',
    discussionPrompt: 'Is this true in your past or present social circles?'
  },
  {
    id: 'leg-med-6',
    gameId: 'dare-roulette',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'The Story Post Auction: The player to your left gets to write a one-sentence story post and publish it on your Instagram or Snapchat right now (must stay up for at least 15 minutes)!'
  },
  {
    id: 'leg-med-7',
    gameId: 'red-flag-green-flag',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'They maintain a private spreadsheet scoring every date they have ever been on based on punctuality, charisma, hygiene, and spending habits.'
  },
  {
    id: 'leg-med-8',
    gameId: 'truth-or-sip',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'Name someone you know who you think is an absolute walking disaster of a human being, or drain your entire cup right now!'
  },
  {
    id: 'leg-med-9',
    gameId: 'point-and-drink',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to the person whose dating life is currently the most entertaining disaster to watch from the sidelines. Winner takes 2 drinks!'
  },
  {
    id: 'leg-med-10',
    gameId: 'most-likely-to',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to accidentally get arrested at an airport for making a terribly timed sarcastic remark to security?'
  },
  {
    id: 'leg-med-11',
    gameId: 'confessions',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the most petty, passive-aggressive revenge you have ever carried out against a roommate, ex, or coworker that they still dont know was you.'
  },
  {
    id: 'leg-med-12',
    gameId: 'hot-seat',
    category: 'medium',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'Rapid Fire Trial: You cannot hesitate for more than 2 seconds. Answer 5 juicy personal questions chosen on the spot by 5 different players!'
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
    text: 'The Phone Gauntlet: Hand your unlocked phone to the player on your left for 60 seconds with full permission to inspect your photos and texts OR down a penalty potion concocted by the entire room right now!'
  },
  {
    id: 'leg-ext-2',
    gameId: 'truth-or-dare',
    category: 'extreme',
    type: 'truth',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'What is the most scandalous secret you know about someone sitting in this room right now that you swore to take to your grave?'
  },
  {
    id: 'leg-ext-3',
    gameId: 'would-you-rather',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather let the group scroll through your deleted photos folder for 60 uninterrupted seconds OR let someone give you a temporary buzzcut stripe / permanent marker tattoo?',
    optionA: '60 seconds of group scrolling deleted photos',
    optionB: 'Permanent marker facial tattoo for 24 hours'
  },
  {
    id: 'leg-ext-4',
    gameId: 'never-have-i-ever',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever hooked up in a dangerously public venue where we were literally seconds away from getting caught by security or police.'
  },
  {
    id: 'leg-ext-5',
    gameId: 'hot-takes',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'Monogamy is an unnatural social construct that 80% of humans secretly struggle with, whether they admit it to their partner or not.',
    discussionPrompt: 'Do you believe humans are biologically built for lifelong monogamy?'
  },
  {
    id: 'leg-ext-6',
    gameId: 'dare-roulette',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'Body Shot Roulette: Complete a high-velocity body shot off the collarbone or stomach of the player chosen by group vote, or take 3 double penalty drinks right now!'
  },
  {
    id: 'leg-ext-7',
    gameId: 'red-flag-green-flag',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'They casually mention that they still share their permanent live location with their ex-partner "just in case an emergency happens".'
  },
  {
    id: 'leg-ext-8',
    gameId: 'truth-or-sip',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'Reveal the deepest, darkest secret you have actively hidden from your closest friends or family, or finish your entire drink and take another penalty sip!'
  },
  {
    id: 'leg-ext-9',
    gameId: 'point-and-drink',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to the person who would survive the least amount of time in a survival situation. Most voted player must finish their drink!'
  },
  {
    id: 'leg-ext-10',
    gameId: 'most-likely-to',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to fake their death and flee to South America under an assumed identity after a terrible financial blunder?'
  },
  {
    id: 'leg-ext-11',
    gameId: 'confessions',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the biggest lie on your resume, dating profile, or social reputation that you have been successfully upholding for years.'
  },
  {
    id: 'leg-ext-12',
    gameId: 'hot-seat',
    category: 'extreme',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'The Spanish Inquisition: 90 seconds in the hot seat! The group can ask you any 3 unfiltered questions. If you refuse any, 3 penalty shots!'
  },

  // ==========================================
  // 5. UNHINGED CATEGORY (Absurd, surreal, chaos)
  // ==========================================
  {
    id: 'leg-unh-1',
    gameId: 'truth-or-dare',
    category: 'unhinged',
    type: 'dare',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CHAOS DARE ★',
    text: 'The Exorcism: Lay flat on the floor while the room gathers in a circle chanting bogus Latin incantations around you. You must rise up like Dracula without bending your knees or using your arms!'
  },
  {
    id: 'leg-unh-2',
    gameId: 'truth-or-dare',
    category: 'unhinged',
    type: 'truth',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CHAOS TRUTH ★',
    text: 'If you were legally required to replace one of your bodily fluids with a commercial condiment (mayonnaise, sriracha, ranch), which one and how does your day-to-day life change?'
  },
  {
    id: 'leg-unh-3',
    gameId: 'would-you-rather',
    category: 'unhinged',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather have a live laugh track play loudly in your head every time you speak for a month OR have your inner monologue broadcast via Bluetooth to nearby cars at stoplights?',
    optionA: 'Loud cartoon laugh track every time you talk',
    optionB: 'Inner monologue broadcast via Bluetooth'
  },
  {
    id: 'leg-unh-4',
    gameId: 'never-have-i-ever',
    category: 'unhinged',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever had a completely serious 10-minute philosophical debate with a housepet or an inanimate piece of furniture while stone-cold sober.'
  },
  {
    id: 'leg-unh-5',
    gameId: 'hot-takes',
    category: 'unhinged',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'Society would be 400% more polite if every human was required by law to carry a water gun filled with cold pickle juice at all times.',
    discussionPrompt: 'Who in this room would abuse the pickle juice gun immediately?'
  },
  {
    id: 'leg-unh-6',
    gameId: 'dare-roulette',
    category: 'unhinged',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'The Ransom Call: Call a 24hr diner on speakerphone, ask for "Detective Sullivan", and urgently whisper: "The package has hatched. What do I do with the teeth?" Stay on until they hang up!'
  },
  {
    id: 'leg-unh-7',
    gameId: 'red-flag-green-flag',
    category: 'unhinged',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'They sleep in a three-piece suit and formal dress shoes every night "in case a Victorian burglar breaks in and demands a gentleman duel".'
  },
  {
    id: 'leg-unh-8',
    gameId: 'truth-or-sip',
    category: 'unhinged',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'What is the most cursed, deranged thought that has randomly popped into your head while standing in a quiet elevator with strangers? Spill it or take 3 drinks!'
  },
  {
    id: 'leg-unh-9',
    gameId: 'point-and-drink',
    category: 'unhinged',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to the person who looks the most like they secretly operate an illegal underground ferret wrestling tournament in their basement!'
  },
  {
    id: 'leg-unh-10',
    gameId: 'most-likely-to',
    category: 'unhinged',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to accidentally found a legitimate religious cult because they got way too enthusiastic about sourdough bread baking?'
  },
  {
    id: 'leg-unh-11',
    gameId: 'confessions',
    category: 'unhinged',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the weirdest, most unhinged sensory habit you do in complete isolation that would make everyone here slowly back away from you.'
  },
  {
    id: 'leg-unh-12',
    gameId: 'hot-seat',
    category: 'unhinged',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'The Madness Chamber: 60 seconds where you must defend the most insane conspiracy theory the group invents for you with 100% genuine unblinking passion!'
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
    text: 'The 60-Second Stare Down: Sit knee-to-knee with your partner, hold both their hands, and look into their eyes for 60 seconds without laughing or breaking contact. Then whisper the exact moment you fell completely in love with them.'
  },
  {
    id: 'leg-cpl-2',
    gameId: 'truth-or-dare',
    category: 'couples',
    type: 'truth',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY COUPLES TRUTH ★',
    text: 'What is a deep emotional longing, romantic fantasy, or vulnerability you have been afraid to voice to your partner because you feared judgment?'
  },
  {
    id: 'leg-cpl-3',
    gameId: 'would-you-rather',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather have your partner be able to read your exact thoughts whenever they touch your hand OR relive your most awkward first date every single anniversary?',
    optionA: 'Partner reads your thoughts on physical contact',
    optionB: 'Relive awkward first date every single anniversary'
  },
  {
    id: 'leg-cpl-4',
    gameId: 'never-have-i-ever',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever stayed up past 2am re-reading old text messages and looking at photos from when we first started dating while smiling like an idiot.'
  },
  {
    id: 'leg-cpl-5',
    gameId: 'hot-takes',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'In every long-term relationship, one person loves slightly harder and cares slightly more, and that power balance shifts back and forth constantly.',
    discussionPrompt: 'Do you agree that love in relationships is rarely a perfect 50/50 balance?'
  },
  {
    id: 'leg-cpl-6',
    gameId: 'dare-roulette',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'The Slow Burn: Give your partner a slow, gentle 60-second neck and shoulder massage while whispering 3 distinct things that make them completely irresistible to you.'
  },
  {
    id: 'leg-cpl-7',
    gameId: 'red-flag-green-flag',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'They planned out your entire future wedding, house decor, and baby names on Pinterest by week 2 of dating.'
  },
  {
    id: 'leg-cpl-8',
    gameId: 'truth-or-sip',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'Admit the one specific look, outfit, or gesture your partner wears that makes you instantly lose all self-control. Answer or both take a sip!'
  },
  {
    id: 'leg-cpl-9',
    gameId: 'point-and-drink',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to who said "I love you" first, and who takes 3x longer to apologize after a stupid argument. Loser takes a sip!'
  },
  {
    id: 'leg-cpl-10',
    gameId: 'most-likely-to',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to impulsively book a weekend flight to a romantic city because they missed each other too much?'
  },
  {
    id: 'leg-cpl-11',
    gameId: 'confessions',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the sweetest, most embarrassing thing you secretly did just to impress your partner without them ever finding out.'
  },
  {
    id: 'leg-cpl-12',
    gameId: 'hot-seat',
    category: 'couples',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'Couples Interrogation: Your partner has 60 seconds of complete immunity to ask you 3 burning questions you have been dodging. Complete honesty required!'
  },

  // ==========================================
  // 7. SPICY CATEGORY (Flirty, dirty talk, kinks)
  // ==========================================
  {
    id: 'leg-spicy-1',
    gameId: 'truth-or-dare',
    category: 'spicy',
    type: 'dare',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPICY DARE ★',
    text: 'Sensory Overload: Blindfold yourself. The player of your choice will slowly trace their fingertips and warm breath along your neck, jawline, and collarbone for 30 seconds. If you pull away or shiver visibly, take a drink!'
  },
  {
    id: 'leg-spicy-2',
    gameId: 'truth-or-dare',
    category: 'spicy',
    type: 'truth',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPICY TRUTH ★',
    text: 'Describe in tantalizing, mouth-watering detail the hottest sexual fantasy you replay in your mind that you have not lived out in reality yet.'
  },
  {
    id: 'leg-spicy-3',
    gameId: 'would-you-rather',
    category: 'spicy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather be handcuffed to the person across from you in bed with zero control over what happens next OR take total dominant control while they obey your every whisper?',
    optionA: 'Handcuffed with zero control in bed',
    optionB: 'Total dominant control with them obeying'
  },
  {
    id: 'leg-spicy-4',
    gameId: 'never-have-i-ever',
    category: 'spicy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever sent a nude or risky photo so daring that my heart was pounding out of my chest for the next 20 minutes.'
  },
  {
    id: 'leg-spicy-5',
    gameId: 'hot-takes',
    category: 'spicy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'Polite, quiet sex is overrated; if you aren\'t leaving marks, losing your breath, and talking dirty, you\'re doing it completely wrong.',
    discussionPrompt: 'Do you prefer intense passionate dirty talk or gentle romantic rhythm?'
  },
  {
    id: 'leg-spicy-6',
    gameId: 'dare-roulette',
    category: 'spicy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'The Temperature Check: Slide your hand under the shirt of the player on your right and place your palm directly over their bare chest and heartbeat for 25 uninterrupted seconds while maintaining eye contact!'
  },
  {
    id: 'leg-spicy-7',
    gameId: 'red-flag-green-flag',
    category: 'spicy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'On date two, they tell you they own silk blindfolds, handcuffs, and a feather tickler and expect you to take charge on night one.'
  },
  {
    id: 'leg-spicy-8',
    gameId: 'truth-or-sip',
    category: 'spicy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'What is the dirtiest or most taboo kink you secretly find yourself aroused by? Confess all details or finish your entire drink!'
  },
  {
    id: 'leg-spicy-9',
    gameId: 'point-and-drink',
    category: 'spicy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to the person whose whisper or touch would give you the most instant physical reaction. Chosen player distributes 3 drinks!'
  },
  {
    id: 'leg-spicy-10',
    gameId: 'most-likely-to',
    category: 'spicy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to possess a secret bedroom drawer packed with toys and accessories that would shock their parents to death?'
  },
  {
    id: 'leg-spicy-11',
    gameId: 'confessions',
    category: 'spicy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the dirtiest, most unexpected thought you have had about someone sitting in this room right now.'
  },
  {
    id: 'leg-spicy-12',
    gameId: 'hot-seat',
    category: 'spicy',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: 'Spicy Trial: 60 seconds on the hot seat! The group can ask you 3 explicit questions about your dirty talk, endurance, and bedroom kinks. Total honesty only!'
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
    text: 'Bedroom Demonstration: Demonstrate using hand motions, breathing, and posture your absolute favorite rhythm, position, and the exact words that make you lose complete control in the bedroom!'
  },
  {
    id: 'leg-18p-2',
    gameId: 'truth-or-dare',
    category: '18+',
    type: 'truth',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY 18+ TRUTH ★',
    text: 'Describe the wildest, most intense orgasm you have ever experienced in your life: where were you, what was happening, and what made it unforgettable?'
  },
  {
    id: 'leg-18p-3',
    gameId: 'would-you-rather',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SHOWDOWN ★',
    text: 'Would you rather have an entire uninterrupted weekend of rough, unrestrained passion in a luxury penthouse OR a high-adrenaline hookup in a location where someone could walk in at any second?',
    optionA: 'Unrestrained weekend in luxury penthouse',
    optionB: 'High-adrenaline hookup where you could get caught'
  },
  {
    id: 'leg-18p-4',
    gameId: 'never-have-i-ever',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Never have I ever had sex in an outdoor balcony, airplane bathroom, moving car, or public swimming pool.'
  },
  {
    id: 'leg-18p-5',
    gameId: 'hot-takes',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT TAKE ★',
    text: 'Bedroom compatibility is 75% of a relationship\'s survival, and anyone claiming emotional connection overrides physical chemistry is lying to themselves.',
    discussionPrompt: 'Can a relationship survive without great sexual chemistry?'
  },
  {
    id: 'leg-18p-6',
    gameId: 'dare-roulette',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY SPINNER ★',
    text: 'The Explicit Whisper: Lean over and whisper the single most graphic, dirty sexual act you want done to you right now directly into the ear of the player chosen by group vote!'
  },
  {
    id: 'leg-18p-7',
    gameId: 'red-flag-green-flag',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY JUDGMENT ★',
    text: 'They demand light choking, hair pulling, and being given explicit verbal commands every single time you are in bed.'
  },
  {
    id: 'leg-18p-8',
    gameId: 'truth-or-sip',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY TRUTH ★',
    text: 'What is the kinky sexual act you tried once that shocked you because you ended up genuinely loving it? Spill everything or take 4 drinks!'
  },
  {
    id: 'leg-18p-9',
    gameId: 'point-and-drink',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY POINT ★',
    text: 'Point to the person who looks the most innocent on the outside but is secretly the wildest behind closed bedroom doors. Most votes takes 3 drinks!'
  },
  {
    id: 'leg-18p-10',
    gameId: 'most-likely-to',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONSENSUS ★',
    text: 'Who is most likely to accidentally scream someone else\'s name or a completely ridiculous phrase in the heat of passion?'
  },
  {
    id: 'leg-18p-11',
    gameId: 'confessions',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY CONFESSION ★',
    text: 'Confess the most taboo, explicit scenario you have ever searched for in incognito mode that you would die of embarrassment if exposed.'
  },
  {
    id: 'leg-18p-12',
    gameId: 'hot-seat',
    category: '18+',
    isLegendary: true,
    rarity: 'legendary',
    legendaryTitle: '★ LEGENDARY HOT SEAT ★',
    text: '18+ Bedroom Interrogation: 60 seconds of raw bedroom truth! The group can ask you anything about your anatomy, kinks, stamina, and wildest fantasies!'
  },
];
