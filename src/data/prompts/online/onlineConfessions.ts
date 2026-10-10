import { ONLINE_CONFESSIONS_EXPANSION } from './expansions/onlineConfessionsExpansion';
import { PromptItem } from '../../../types/game';

/**
 * ONLINE CONFESSIONS PROMPTS (105+ High-Quality Remote Prompts)
 * Specifically crafted for remote video and voice calls.
 * Every card features an engaging remote dilemma and a confession starter.
 * Covers all 8 categories: easy, medium, extreme, unhinged, couples, 18+, spicy, kids.
 */
const BASE_ONLINE_CONFESSIONS_PROMPTS: PromptItem[] = [
  // ==========================================
  // EASY (Light, funny, low-stakes digital secrets)
  // ==========================================
  { id: 'on-cnf-easy-1', gameId: 'confessions', category: 'easy', playMode: 'online', text: "What is an online video or game you secretly spent over 100 hours on that you hide from friends?", confessionStarter: "I secretly sank over 100 hours into..." },
  { id: 'on-cnf-easy-2', gameId: 'confessions', category: 'easy', playMode: 'online', text: "What is a silly rumor you once believed because someone on TikTok said it was true?", confessionStarter: "I actually believed that..." },
  { id: 'on-cnf-easy-3', gameId: 'confessions', category: 'easy', playMode: 'online', text: "Have you ever left your camera off just because you were eating an entire pizza in bed?", confessionStarter: "I once hid behind a black screen while..." },
  { id: 'on-cnf-easy-4', gameId: 'confessions', category: 'easy', playMode: 'online', text: "What song have you secretly replayed 15 times in a row this week while gaming alone?", confessionStarter: "I played on repeat..." },
  { id: 'on-cnf-easy-5', gameId: 'confessions', category: 'easy', playMode: 'online', text: "What is the most ridiculous purchase you made online under $20 that is totally useless?", confessionStarter: "I bought a completely useless..." },
  { id: 'on-cnf-easy-6', gameId: 'confessions', category: 'easy', playMode: 'online', text: "What is the most embarrassing search query you typed into YouTube this month?", confessionStarter: "I secretly looked up on YouTube..." },
  { id: 'on-cnf-easy-7', gameId: 'confessions', category: 'easy', playMode: 'online', text: "Have you ever muted yourself on call just to let out a massive yawn or burp?", confessionStarter: "I muted myself on call so I could..." },
  { id: 'on-cnf-easy-8', gameId: 'confessions', category: 'easy', playMode: 'online', text: "What is a cartoon or kids movie you secretly rewatch when you're feeling down?", confessionStarter: "Whenever I'm sad, I secretly rewatch..." },
  { id: 'on-cnf-easy-9', gameId: 'confessions', category: 'easy', playMode: 'online', text: "Have you ever pretended you didn't see someone's DM for 3 hours just because you didn't feel like typing?", confessionStarter: "I left you on delivered because..." },
  { id: 'on-cnf-easy-10', gameId: 'confessions', category: 'easy', playMode: 'online', text: "What weird snack combination do you eat at your desk that would horrify a foodie?", confessionStarter: "My secret gross desk snack is..." },
  { id: 'on-cnf-easy-11', gameId: 'confessions', category: 'easy', playMode: 'online', text: "Have you ever practiced saying something out loud 5 times before unmuting on call?", confessionStarter: "I rehearsed unmuting saying..." },
  { id: 'on-cnf-easy-12', gameId: 'confessions', category: 'easy', playMode: 'online', text: "What is the oldest unwashed hoodie or piece of clothing currently lying near your chair?", confessionStarter: "I haven't washed my favorite hoodie in..." },
  { id: 'on-cnf-easy-13', gameId: 'confessions', category: 'easy', playMode: 'online', text: "What is a mobile game with terrible ads that you actually downloaded and enjoyed?", confessionStarter: "I unironically played that mobile game about..." },
  { id: 'on-cnf-easy-14', gameId: 'confessions', category: 'easy', playMode: 'online', text: "Have you ever nodded along in a video call pretending you understood something when you had zero clue?", confessionStarter: "I nodded along pretending I understood..." },

  // ==========================================
  // MEDIUM (Mildly awkward, personal remote truths)
  // ==========================================
  { id: 'on-cnf-med-1', gameId: 'confessions', category: 'medium', playMode: 'online', text: "What is a message you sent that you instantly regretted the millisecond it marked as delivered?", confessionStarter: "I panicked the second I hit send on..." },
  { id: 'on-cnf-med-2', gameId: 'confessions', category: 'medium', playMode: 'online', text: "What is a petty reason you muted someone or left a group chat without explaining?", confessionStarter: "I rage-quit the group chat because..." },
  { id: 'on-cnf-med-3', gameId: 'confessions', category: 'medium', playMode: 'online', text: "Have you ever pretended your Wi-Fi cut out during a call just to avoid answering a difficult question?", confessionStarter: "I faked a disconnected call when..." },
  { id: 'on-cnf-med-4', gameId: 'confessions', category: 'medium', playMode: 'online', text: "What is an assumption you made about someone in this call when you first saw their profile that was totally wrong?", confessionStarter: "I first thought you were..." },
  { id: 'on-cnf-med-5', gameId: 'confessions', category: 'medium', playMode: 'online', text: "Have you ever stalked an ex or crush's Spotify or Discord status to see who they were listening with?", confessionStarter: "I checked your status at 2 AM to see..." },
  { id: 'on-cnf-med-6', gameId: 'confessions', category: 'medium', playMode: 'online', text: "Have you ever claimed you had poor internet connection just to leave an awkward voice channel?", confessionStarter: "I pretended my Wi-Fi was dying because..." },
  { id: 'on-cnf-med-7', gameId: 'confessions', category: 'medium', playMode: 'online', text: "What is a text you sent to the wrong person that made your heart stop?", confessionStarter: "I accidentally sent a text about someone to..." },
  { id: 'on-cnf-med-8', gameId: 'confessions', category: 'medium', playMode: 'online', text: "Have you ever looked up someone on this call's social media history before you ever had a real conversation with them?", confessionStarter: "I deep-dived your profile before we spoke and saw..." },
  { id: 'on-cnf-med-9', gameId: 'confessions', category: 'medium', playMode: 'online', text: "What is a gift or online game code someone bought for you that you secretly hated or never used?", confessionStarter: "I never touched that gift because..." },
  { id: 'on-cnf-med-10', gameId: 'confessions', category: 'medium', playMode: 'online', text: "Have you ever sent a fake screenshot or edited a photo to get out of hanging out online?", confessionStarter: "I faked a screenshot showing..." },
  { id: 'on-cnf-med-11', gameId: 'confessions', category: 'medium', playMode: 'online', text: "What is something you pretended to like just to impress someone on a Discord server?", confessionStarter: "I pretended to be obsessed with..." },
  { id: 'on-cnf-med-12', gameId: 'confessions', category: 'medium', playMode: 'online', text: "Have you ever stayed in a voice call on deafen just so you looked like you were part of the group?", confessionStarter: "I deafened for an hour because..." },
  { id: 'on-cnf-med-13', gameId: 'confessions', category: 'medium', playMode: 'online', text: "What is the longest you've gone without brushing your teeth while on a 2-day gaming binge?", confessionStarter: "During my 48-hour binge, I went without..." },

  // ==========================================
  // EXTREME (High voltage, tense confessions)
  // ==========================================
  { id: 'on-cnf-ext-1', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "What is something you saw or overheard in a voice call when someone forgot to mute that you never told them?", confessionStarter: "I heard you say when you thought you were muted..." },
  { id: 'on-cnf-ext-2', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "What is the deepest secret you have hidden from the people currently in this call?", confessionStarter: "None of you know that I actually..." },
  { id: 'on-cnf-ext-3', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "Have you ever developed intense romantic feelings for someone purely through late-night Discord calls?", confessionStarter: "I caught heavy feelings over voice chat when..." },
  { id: 'on-cnf-ext-4', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "What is a screenshot in your phone right now that would end a friendship if leaked?", confessionStarter: "I have a saved screenshot of..." },
  { id: 'on-cnf-ext-5', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "Have you ever secretly rooted against someone in this call during a major achievement?", confessionStarter: "I secretly felt envious when..." },
  { id: 'on-cnf-ext-6', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "What is the most toxic habit you have when talking to people online?", confessionStarter: "My worst toxic online habit is..." },
  { id: 'on-cnf-ext-7', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "Have you ever logged into someone else's social media or email account without their permission?", confessionStarter: "I secretly logged into..." },
  { id: 'on-cnf-ext-8', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "Have you ever intentionally provoked someone into an argument online just to watch the chaos unfold?", confessionStarter: "I started that flame war by..." },
  { id: 'on-cnf-ext-9', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "What is the worst lie you ever told to cover up your whereabouts while staying home on Discord?", confessionStarter: "I lied to my family saying I was..." },
  { id: 'on-cnf-ext-10', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "Have you ever used a voice changer or fake webcam loop to deceive someone in a call?", confessionStarter: "I catfished an online group using..." },
  { id: 'on-cnf-ext-11', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "What is something illegal or ethically gray you researched on your computer that made you wipe your cache?", confessionStarter: "I panicked and wiped my cache after researching..." },
  { id: 'on-cnf-ext-12', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "Who in this call have you secretly cried about after a late-night conversation?", confessionStarter: "I actually broke down crying over..." },
  { id: 'on-cnf-ext-13', gameId: 'confessions', category: 'extreme', playMode: 'online', text: "What is an online secret that could genuinely ruin your career or social standing if exposed?", confessionStarter: "If anyone found out that I..." },

  // ==========================================
  // UNHINGED (Maximum absurdity, chaotic rabbit holes)
  // ==========================================
  { id: 'on-cnf-unh-1', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is the most chaotic fake persona or lie you have maintained in an online community?", confessionStarter: "I convinced an entire community that I was..." },
  { id: 'on-cnf-unh-2', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is the weirdest thing you've ever done at your desk while completely forgetting your webcam was on?", confessionStarter: "I once forgot my camera was on and..." },
  { id: 'on-cnf-unh-3', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is the most unhinged impulse purchase you made at 4 AM that arrived in the mail a week later?", confessionStarter: "I drunkenly ordered a..." },
  { id: 'on-cnf-unh-4', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is an imaginary argument you had out loud while home alone that you still get worked up about?", confessionStarter: "I had a full screaming match with..." },
  { id: 'on-cnf-unh-5', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is the weirdest voice or accent you practice when you're completely alone in your room?", confessionStarter: "When alone, I talk to myself in a..." },
  { id: 'on-cnf-unh-6', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is a completely unhinged rabbit hole on Reddit or YouTube that you spent 6 hours researching?", confessionStarter: "I lost an entire night researching..." },
  { id: 'on-cnf-unh-7', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is the longest time you went without leaving your bedroom during an online binge?", confessionStarter: "I didn't step outside my bedroom door for..." },
  { id: 'on-cnf-unh-8', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is an utterly absurd conspiracy theory you genuinely believed for at least a week?", confessionStarter: "I was genuinely convinced that..." },
  { id: 'on-cnf-unh-9', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What bizarre habit do you do when your Wi-Fi router cuts out and you have no internet?", confessionStarter: "When the Wi-Fi died, I paced around my room..." },
  { id: 'on-cnf-unh-10', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "Have you ever typed a full emotional diary entry into an unsent Discord DM to an inactive bot?", confessionStarter: "I poured my soul into a DM to a bot about..." },
  { id: 'on-cnf-unh-11', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is a completely chaotic food challenge you attempted alone at 3 AM?", confessionStarter: "I tried to eat a spoonful of straight..." },
  { id: 'on-cnf-unh-12', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "What is the weirdest noise your microphone has ever picked up during a dead-silent call?", confessionStarter: "My mic accidentally picked up the sound of..." },
  { id: 'on-cnf-unh-13', gameId: 'confessions', category: 'unhinged', playMode: 'online', text: "If you had to reveal what is currently sitting on your computer desktop right now, how messy is it?", confessionStarter: "My desktop currently contains 400 icons of..." },

  // ==========================================
  // COUPLES (Romantic, intimate remote connection)
  // ==========================================
  { id: 'on-cnf-cpl-1', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What is a moment on call where you felt so overwhelming loved that you got goosebumps?", confessionStarter: "My heart melted completely when you..." },
  { id: 'on-cnf-cpl-2', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What is something you find incredibly attractive about me on webcam that you've never said?", confessionStarter: "Every time you're on camera, I secretly love how you..." },
  { id: 'on-cnf-cpl-3', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What is a secret dream date or trip you've planned for us in your head?", confessionStarter: "I secretly planned for us to..." },
  { id: 'on-cnf-cpl-4', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What was the first thing that made you realize I was more than just a friend online?", confessionStarter: "I knew I wanted you when..." },
  { id: 'on-cnf-cpl-5', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What is a secret nickname you secretly call me when talking to yourself or thinking about me?", confessionStarter: "In my thoughts, I secretly call you..." },
  { id: 'on-cnf-cpl-6', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What is a moment where you felt an overwhelming urge to jump through the screen and kiss me?", confessionStarter: "I wanted so badly to kiss you when..." },
  { id: 'on-cnf-cpl-7', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What is something sweet I said in a late-night call that you replay in your mind when lonely?", confessionStarter: "I still remember when you whispered..." },
  { id: 'on-cnf-cpl-8', gameId: 'confessions', category: 'couples', playMode: 'online', text: "Have you ever smelled your own shirt or blanket and wished it carried my scent after a call?", confessionStarter: "After we hung up, I wished my room smelled like..." },
  { id: 'on-cnf-cpl-9', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What song in your playlist reminds you so powerfully of me that you have to pause whatever you're doing?", confessionStarter: "That song always makes me ache for you because..." },
  { id: 'on-cnf-cpl-10', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What is the sweetest thing you have ever written about me in your private journal or notes app?", confessionStarter: "I wrote in my notes that you are..." },
  { id: 'on-cnf-cpl-11', gameId: 'confessions', category: 'couples', playMode: 'online', text: "Have you ever stayed awake on call just watching me sleep because you felt so peaceful?", confessionStarter: "I watched you sleep on webcam and thought..." },
  { id: 'on-cnf-cpl-12', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What was the hardest goodbye we ever had on a video call before hanging up?", confessionStarter: "I fought back tears hanging up when..." },
  { id: 'on-cnf-cpl-13', gameId: 'confessions', category: 'couples', playMode: 'online', text: "What is a future milestone we haven't reached yet that you secretly daydream about every week?", confessionStarter: "I keep daydreaming about the day we..." },

  // ==========================================
  // 18+ (Mature adult remote confessions)
  // ==========================================
  { id: 'on-cnf-18-1', gameId: 'confessions', category: '18+', playMode: 'online', text: "What is your most explicit, uncensored late-night search that you would never admit in public?", confessionStarter: "My most degenerate private search was..." },
  { id: 'on-cnf-18-2', gameId: 'confessions', category: '18+', playMode: 'online', text: "Have you ever had an intense sexual fantasy starring someone currently in this voice call?", confessionStarter: "I've secretly fantasized about..." },
  { id: 'on-cnf-18-3', gameId: 'confessions', category: '18+', playMode: 'online', text: "What was the most scandalous photo or video you've ever taken of yourself?", confessionStarter: "The riskiest thing I've shot was..." },
  { id: 'on-cnf-18-4', gameId: 'confessions', category: '18+', playMode: 'online', text: "Have you ever done something sexual while on an active voice call with someone else?", confessionStarter: "I touched myself on call when..." },
  { id: 'on-cnf-18-5', gameId: 'confessions', category: '18+', playMode: 'online', text: "What is the dirtiest thought you had about someone on this call while they were speaking?", confessionStarter: "While you were talking, I secretly thought..." },
  { id: 'on-cnf-18-6', gameId: 'confessions', category: '18+', playMode: 'online', text: "What is an adult fantasy you have that you have never confessed to any partner in real life?", confessionStarter: "My deepest unconfessed fantasy is..." },
  { id: 'on-cnf-18-7', gameId: 'confessions', category: '18+', playMode: 'online', text: "Have you ever gotten aroused by someone's voice tone or laugh during a casual voice chat?", confessionStarter: "Your voice gave me physical shivers when you..." },
  { id: 'on-cnf-18-8', gameId: 'confessions', category: '18+', playMode: 'online', text: "What is the most daring or reckless place you have ever sent an explicit photo from?", confessionStarter: "I sent a spicy photo from..." },
  { id: 'on-cnf-18-9', gameId: 'confessions', category: '18+', playMode: 'online', text: "Have you ever masturbated immediately after hanging up a video call because you couldn't take it anymore?", confessionStarter: "The second the call ended, I had to..." },
  { id: 'on-cnf-18-10', gameId: 'confessions', category: '18+', playMode: 'online', text: "What is the most explicit message currently saved in your deleted messages folder?", confessionStarter: "I deleted a text that said..." },
  { id: 'on-cnf-18-11', gameId: 'confessions', category: '18+', playMode: 'online', text: "Have you ever visited an adult webcam site or chat room out of pure late-night boredom?", confessionStarter: "I once spent 2 hours browsing..." },
  { id: 'on-cnf-18-12', gameId: 'confessions', category: '18+', playMode: 'online', text: "What is your secret dirty pleasure in adult media that would shock your friends?", confessionStarter: "My secret guilty pleasure kink is..." },
  { id: 'on-cnf-18-13', gameId: 'confessions', category: '18+', playMode: 'online', text: "What is a physical reaction you have when you get sexually frustrated during a long call?", confessionStarter: "When I get frustrated on call, I start..." },

  // ==========================================
  // SPICY (Sensual, explicit erotic confessions)
  // ==========================================
  { id: 'on-cnf-spicy-1', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "What is the dirtiest thing someone has ever said to you over a voice call or phone that made you weak in the knees?", confessionStarter: "The hottest thing whispered into my ear was..." },
  { id: 'on-cnf-spicy-2', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "Describe what you do when you get turned on late at night while on a video or voice call.", confessionStarter: "When I get turned on late at night on call, I..." },
  { id: 'on-cnf-spicy-3', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "What is your absolute wildest fantasy involving webcam intimacy?", confessionStarter: "My ultimate cam fantasy is..." },
  { id: 'on-cnf-spicy-4', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "What involuntary reaction does your body have when you hear a voice that turns you on?", confessionStarter: "When a voice turns me on, my body..." },
  { id: 'on-cnf-spicy-5', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "Describe the hottest late-night audio or video moment you have ever experienced.", confessionStarter: "The most electrifying moment on call was..." },
  { id: 'on-cnf-spicy-6', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "What is a specific word or tone of voice that makes you shiver with arousal instantly?", confessionStarter: "I get instant goosebumps when someone whispers..." },
  { id: 'on-cnf-spicy-7', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "What is your favorite position or angle to be seen from on webcam when being intimate?", confessionStarter: "My sexiest camera angle is..." },
  { id: 'on-cnf-spicy-8', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "Have you ever given yourself multiple orgasms while someone gave you explicit audio commands on headset?", confessionStarter: "I came over and over while listening to..." },
  { id: 'on-cnf-spicy-9', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "What is an explicit command you secretly want someone on this call to give you right now?", confessionStarter: "I secretly want you to tell me to..." },
  { id: 'on-cnf-spicy-10', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "What is the most sensitive erotic spot on your body that you touch when listening to dirty audio?", confessionStarter: "I find myself touching my..." },
  { id: 'on-cnf-spicy-11', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "Have you ever touched yourself on camera while looking into your own webcam feed preview?", confessionStarter: "I got turned on watching my own reflection when..." },
  { id: 'on-cnf-spicy-12', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "What is an intimate toy you own that you wish you could let someone here control remotely?", confessionStarter: "I want to hand over app control of my..." },
  { id: 'on-cnf-spicy-13', gameId: 'confessions', category: 'spicy', playMode: 'online', text: "What sound do you make when you are pushed right over the edge into climax on call?", confessionStarter: "Right when I climax, the sound I make is..." },

  // ==========================================
  // KIDS (Wholesome, silly, family-friendly)
  // ==========================================
  { id: 'on-cnf-kids-1', gameId: 'confessions', category: 'kids', playMode: 'online', text: "What is a silly snack you sneaked into your room past bedtime?", confessionStarter: "I once secretly ate..." },
  { id: 'on-cnf-kids-2', gameId: 'confessions', category: 'kids', playMode: 'online', text: "What is the funniest face you ever made at a mirror when you thought nobody was looking?", confessionStarter: "I practiced making funny faces of..." },
  { id: 'on-cnf-kids-3', gameId: 'confessions', category: 'kids', playMode: 'online', text: "What is a cartoon show you still watch that is meant for younger kids?", confessionStarter: "I still secretly watch..." },
  { id: 'on-cnf-kids-4', gameId: 'confessions', category: 'kids', playMode: 'online', text: "What is a silly song from a cartoon that gets stuck in your head for days?", confessionStarter: "I cannot stop singing..." },
  { id: 'on-cnf-kids-5', gameId: 'confessions', category: 'kids', playMode: 'online', text: "What is a vegetable you secretly hid in a napkin so you wouldn't have to eat it?", confessionStarter: "I secretly hid my..." },
  { id: 'on-cnf-kids-6', gameId: 'confessions', category: 'kids', playMode: 'online', text: "Have you ever blamed a funny noise in your room on an imaginary monster or pet?", confessionStarter: "I blamed the sound on..." },
  { id: 'on-cnf-kids-7', gameId: 'confessions', category: 'kids', playMode: 'online', text: "What is the silliest rule in a board game or video game that you tried to invent?", confessionStarter: "I made up a rule that said..." },
  { id: 'on-cnf-kids-8', gameId: 'confessions', category: 'kids', playMode: 'online', text: "What stuffed animal or toy do you still keep hidden under your pillows?", confessionStarter: "My secret stuffed buddy is..." },
  { id: 'on-cnf-kids-9', gameId: 'confessions', category: 'kids', playMode: 'online', text: "Have you ever pretended to be sick just to stay home and play video games all morning?", confessionStarter: "I faked a cough so I could play..." },
  { id: 'on-cnf-kids-10', gameId: 'confessions', category: 'kids', playMode: 'online', text: "What superhero power do you pretend to have when you're alone in your room?", confessionStarter: "I pretend I have the power of..." },
  { id: 'on-cnf-kids-11', gameId: 'confessions', category: 'kids', playMode: 'online', text: "What is the messiest thing you ever spilled near your computer that you wiped up before anyone noticed?", confessionStarter: "I accidentally spilled..." },
  { id: 'on-cnf-kids-12', gameId: 'confessions', category: 'kids', playMode: 'online', text: "What is a funny dance you do when you open a super lucky pack in a video game?", confessionStarter: "My lucky victory dance looks like..." },
  { id: 'on-cnf-kids-13', gameId: 'confessions', category: 'kids', playMode: 'online', text: "If you had a robot butler, what silly chore would you order it to do every single morning?", confessionStarter: "I would make my robot butler..." }
];


export const ONLINE_CONFESSIONS_PROMPTS: PromptItem[] = [...BASE_ONLINE_CONFESSIONS_PROMPTS, ...ONLINE_CONFESSIONS_EXPANSION];
