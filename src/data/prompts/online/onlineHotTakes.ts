import { PromptItem } from '../../../types/game';

/**
 * ONLINE HOT TAKES PROMPTS
 * Specifically crafted for remote voice chats, Discord server debates, and video calls.
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
export const ONLINE_HOT_TAKES_PROMPTS: PromptItem[] = [
  // ==========================================
  // EASY (Fun, low-stakes digital & internet takes)
  // ==========================================
  {
    id: 'on-ht-easy-1',
    gameId: 'hot-takes',
    category: 'easy',
    playMode: 'online',
    text: "Keeping your webcam turned off with a blank black square in a small hangout call is socially hostile.",
    discussionPrompt: "Camera on vs camera off: is it basic courtesy or personal freedom?"
  },
  {
    id: 'on-ht-easy-2',
    gameId: 'hot-takes',
    category: 'easy',
    playMode: 'online',
    text: "Sending a 3-minute voice note instead of a 2-sentence text message is pure selfish laziness.",
    discussionPrompt: "Are voice notes convenient or do they hold the receiver hostage?"
  },
  {
    id: 'on-ht-easy-3',
    gameId: 'hot-takes',
    category: 'easy',
    playMode: 'online',
    text: "People who reply to texts within 3 seconds have zero mystery and need a hobby.",
    discussionPrompt: "Is lightning-fast texting attentive or slightly desperate?"
  },
  {
    id: 'on-ht-easy-4',
    gameId: 'hot-takes',
    category: 'easy',
    playMode: 'online',
    text: "Custom Discord server emojis and soundboards are 100x funnier than real-life conversations.",
    discussionPrompt: "Has digital meme culture outpaced standard banter?"
  },
  {
    id: 'on-ht-easy-5',
    gameId: 'hot-takes',
    category: 'easy',
    playMode: 'online',
    text: "Playing cozy single-player games while on mute in a group voice channel is peak human relaxation.",
    discussionPrompt: "Parallel play on Discord: antisocial or therapeutic?"
  },
  {
    id: 'on-ht-easy-6',
    gameId: 'hot-takes',
    category: 'easy',
    playMode: 'online',
    text: "Putting an exclamation mark in a work Slack or Discord message is compulsory unless you want to sound angry.",
    discussionPrompt: "Has punctuation become an emotional battlefield?"
  },

  // ==========================================
  // MEDIUM (Relatable awkwardness & online social etiquette)
  // ==========================================
  {
    id: 'on-ht-med-1',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "If you leave someone on 'Read' for more than 4 hours without explaining, you are actively sending a silent insult.",
    discussionPrompt: "Read receipts: transparency or emotional warfare?"
  },
  {
    id: 'on-ht-med-2',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "Lurking in an open voice channel on deafen or mute while listening to friends talk is creepy, not casual.",
    discussionPrompt: "Deafen-lurking: harmless presence or digital eavesdropping?"
  },
  {
    id: 'on-ht-med-3',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "Curating a private 'Finsta' or alternate Twitter account to post vents is healthier than talking to a therapist.",
    discussionPrompt: "Do private dump accounts help process emotion or amplify drama?"
  },
  {
    id: 'on-ht-med-4',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "Unfollowing or soft-blocking an ex on social media is emotional maturity, not bitterness.",
    discussionPrompt: "Does staying mutual with an ex show security or lingering attachment?"
  },
  {
    id: 'on-ht-med-5',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "People who post gym mirror thirst traps on their main story definitely want specific people's DMs, not fitness tracking.",
    discussionPrompt: "Gym stories: accountability or covert validation bait?"
  },
  {
    id: 'on-ht-med-6',
    gameId: 'hot-takes',
    category: 'medium',
    playMode: 'online',
    text: "Your Spotify Wrapped or Top Artists reveals your true emotional instability more accurately than your zodiac sign.",
    discussionPrompt: "What does music taste genuinely tell you about a person?"
  },

  // ==========================================
  // EXTREME (Spicy controversy, strong online tensions)
  // ==========================================
  {
    id: 'on-ht-ext-1',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "Ghosting someone after 3+ dates is completely acceptable if you owe them no moral debt and the vibe is toxic.",
    discussionPrompt: "Is ghosting ever justified, or is direct closure non-negotiable?"
  },
  {
    id: 'on-ht-ext-2',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "Checking your significant other's follow list or Discord mutuals is not paranoia—it's basic due diligence.",
    discussionPrompt: "Where is the line between healthy boundary checking and toxic surveillance?"
  },
  {
    id: 'on-ht-ext-3',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "Online friendships formed through Discord and gaming can be deeper and more authentic than 90% of in-person friendships.",
    discussionPrompt: "Does physical presence matter when soul connections happen over headset?"
  },
  {
    id: 'on-ht-ext-4',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "Having a secret group chat that excludes one specific person from the main group is toxic and cowardly.",
    discussionPrompt: "Is the 'side group chat' an inevitable social release or mean-spirited?"
  },
  {
    id: 'on-ht-ext-5',
    gameId: 'hot-takes',
    category: 'extreme',
    playMode: 'online',
    text: "If you wouldn't say it to someone's face over video call, typing it in text chat makes you a fraud.",
    discussionPrompt: "Does text communication breed artificial bravery?"
  },

  // ==========================================
  // UNHINGED (Absurd, wild, provocative internet culture)
  // ==========================================
  {
    id: 'on-ht-unh-1',
    gameId: 'hot-takes',
    category: 'unhinged',
    playMode: 'online',
    text: "Discord moderators who run roleplay servers deserve a salary and public pension for their service.",
    discussionPrompt: "Are Discord mods unsung heroes or power-hungry keyboard warriors?"
  },
  {
    id: 'on-ht-unh-2',
    gameId: 'hot-takes',
    category: 'unhinged',
    playMode: 'online',
    text: "We should normalize muting yourself mid-call to scream into a pillow without explaining why.",
    discussionPrompt: "Is tactical unannounced screaming a valid coping mechanism?"
  },
  {
    id: 'on-ht-unh-3',
    gameId: 'hot-takes',
    category: 'unhinged',
    playMode: 'online',
    text: "People who use light mode on Discord or IDEs are genuine sociopaths who cannot be trusted around children.",
    discussionPrompt: "Why does dark mode hold such cultural dominance?"
  },
  {
    id: 'on-ht-unh-4',
    gameId: 'hot-takes',
    category: 'unhinged',
    playMode: 'online',
    text: "Watching 3 TikToks at 2x speed simultaneously is the future of intellectual consumption.",
    discussionPrompt: "Has short-form brain rot reached its zenith or is this just evolving cognition?"
  },

  // ==========================================
  // COUPLES (Romantic, vulnerable, long-distance relationships)
  // ==========================================
  {
    id: 'on-ht-cpl-1',
    gameId: 'hot-takes',
    category: 'couples',
    playMode: 'online',
    text: "Sleeping on an open FaceTime call every night is the most romantic thing long-distance couples can do.",
    discussionPrompt: "Is nightly sleep calling intimate devotion or codependency?"
  },
  {
    id: 'on-ht-cpl-2',
    gameId: 'hot-takes',
    category: 'couples',
    playMode: 'online',
    text: "Sharing your live location 24/7 with your partner is an act of deep peace of mind, not a lack of trust.",
    discussionPrompt: "Does Life360/FindMy create safety or suffocating surveillance?"
  },
  {
    id: 'on-ht-cpl-3',
    gameId: 'hot-takes',
    category: 'couples',
    playMode: 'online',
    text: "A well-written digital love letter or customized playlist can hit harder than an expensive bought gift.",
    discussionPrompt: "Does emotional effort over screens rival material gifts in person?"
  },
  {
    id: 'on-ht-cpl-4',
    gameId: 'hot-takes',
    category: 'couples',
    playMode: 'online',
    text: "If you don't post your partner on your social media at least once in 6 months, you are hiding them.",
    discussionPrompt: "Social media posting: public pride or performative insecurity?"
  },

  // ==========================================
  // 18+ (Mature adult discussions, dating apps, boundary setting)
  // ==========================================
  {
    id: 'on-ht-18-1',
    gameId: 'hot-takes',
    category: '18+',
    playMode: 'online',
    text: "Sending unsolicited spicy photos is never okay, but sending dry boring 'hey' texts is an equal waste of time.",
    discussionPrompt: "What is the proper etiquette for escalating flirting online?"
  },
  {
    id: 'on-ht-18-2',
    gameId: 'hot-takes',
    category: '18+',
    playMode: 'online',
    text: "Phone sex and spicy FaceTime calls require more vulnerability and vocal confidence than physical intimacy.",
    discussionPrompt: "Is audio intimacy more exposing than physical contact?"
  },
  {
    id: 'on-ht-18-3',
    gameId: 'hot-takes',
    category: '18+',
    playMode: 'online',
    text: "Dating apps have permanently ruined romance and made people treat human connection like fast-fashion shopping.",
    discussionPrompt: "Has Tinder and Hinge optimized connection or destroyed long-term empathy?"
  },
  {
    id: 'on-ht-18-4',
    gameId: 'hot-takes',
    category: '18+',
    playMode: 'online',
    text: "People who save explicit photos on Snapchat instead of letting them expire have questionable motives.",
    discussionPrompt: "Saving temporary media: mutual archive or privacy violation?"
  },

  // ==========================================
  // SPICY (Sensual, sexually explicit remote takes)
  // ==========================================
  {
    id: 'on-ht-spicy-1',
    gameId: 'hot-takes',
    category: 'spicy',
    playMode: 'online',
    text: "A partner who knows how to talk dirty with confidence over a voice call is more attractive than someone with a 10/10 body.",
    discussionPrompt: "Does verbal dominance and dirty talk outweigh physical aesthetics?"
  },
  {
    id: 'on-ht-spicy-2',
    gameId: 'hot-takes',
    category: 'spicy',
    playMode: 'online',
    text: "Watching someone touch themselves on webcam is often more intensely erotic than actual in-person intercourse.",
    discussionPrompt: "Why is voyeurism and mutual masturbation on cam so addictive?"
  },
  {
    id: 'on-ht-spicy-3',
    gameId: 'hot-takes',
    category: 'spicy',
    playMode: 'online',
    text: "Teasing someone all day over text with explicit descriptions and POV photos makes the eventual climax 10x more explosive.",
    discussionPrompt: "Is all-day sexual anticipation the most underrated kink?"
  },
  {
    id: 'on-ht-spicy-4',
    gameId: 'hot-takes',
    category: 'spicy',
    playMode: 'online',
    text: "Having a dedicated kink or roleplay persona in DMs brings out desires you would never dare act out in real life.",
    discussionPrompt: "Does online anonymity unlock our true unfiltered sexuality?"
  },

  // ==========================================
  // KIDS (Pure fun, silly, age-appropriate internet takes)
  // ==========================================
  {
    id: 'on-ht-kids-1',
    gameId: 'hot-takes',
    category: 'kids',
    playMode: 'online',
    text: "Minecraft music is the best background music to fall asleep to in the whole world.",
    discussionPrompt: "Is C418's soundtrack the greatest video game music ever made?"
  },
  {
    id: 'on-ht-kids-2',
    gameId: 'hot-takes',
    category: 'kids',
    playMode: 'online',
    text: "Playing with Lego bricks is way more fun than playing games on an iPad or tablet.",
    discussionPrompt: "Physical building toys vs digital video games: which wins?"
  },
  {
    id: 'on-ht-kids-3',
    gameId: 'hot-takes',
    category: 'kids',
    playMode: 'online',
    text: "Funny cat videos on the internet will always be 100 times cooler than dog videos.",
    discussionPrompt: "Who is the undisputed king of funny internet pets?"
  },
  {
    id: 'on-ht-kids-4',
    gameId: 'hot-takes',
    category: 'kids',
    playMode: 'online',
    text: "Having pizza with extra cheese for every birthday party should be an official world rule.",
    discussionPrompt: "What is the absolute number one birthday party meal?"
  }
];
