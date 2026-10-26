import { GameCategory, GameId, PlayMode, PromptItem } from '../../types/game';
import { PromptSourceId } from './sources';

type Extras = Pick<PromptItem, 'type' | 'optionA' | 'optionB' | 'discussionPrompt'> & { originalItemId?: string };
type Seed = [id: string, gameId: GameId, category: GameCategory, playMode: PlayMode, text: string, extras?: Extras];
const options = (optionA: string, optionB: string): Extras => ({ optionA, optionB });

// Commercial references inform the format only. Their card wording is not copied.
// The two Parabol entries marked originalItemId are exact, licensed reproductions.
const SEEDS: Record<PromptSourceId, Seed[]> = {
  parabol: [
    ['inedible', 'truth-or-dare', 'easy', 'in-person', 'If you could safely eat any inedible object, what would it be?', { type: 'truth', originalItemId: '37' }],
    ['undeserved-hate', 'hot-seat', 'easy', 'online', "What's something that doesn't deserve the hate it gets?", { originalItemId: '213' }],
    ['useless-expertise', 'hot-seat', 'easy', 'in-person', 'Which useless skill could you teach a convincing masterclass in with no preparation?'],
    ['unexpected-help', 'confessions', 'medium', 'online', 'Confess a small problem you made worse because asking for help felt embarrassing.'],
    ['mood-report', 'truth-or-dare', 'kids', 'online', 'Describe today as a weather forecast for a planet where everyone feels exactly like you.', { type: 'truth' }],
    ['explain-school', 'truth-or-dare', 'kids', 'in-person', 'Explain a normal school rule to a visitor who has never heard of school.', { type: 'dare' }],
  ],
  wnrs: [
    ['changed-assumption', 'truth-or-dare', 'medium', 'in-person', 'What did you assume about someone here that one conversation completely overturned?', { type: 'truth' }],
    ['missed-strength', 'hot-seat', 'medium', 'online', 'Which strength would your friends recognize in you before you would admit it yourself?'],
    ['quiet-milestone', 'truth-or-sip', 'couples', 'in-person', 'Which ordinary moment made our relationship feel more serious than a big anniversary?'],
    ['better-question', 'truth-or-dare', 'couples', 'online', 'What should I ask when you say your day was fine but your voice disagrees?', { type: 'truth' }],
    ['unseen-effort', 'confessions', 'couples', 'in-person', 'Confess something your partner quietly does that you noticed but never properly thanked them for.'],
    ['different-memory', 'hot-seat', 'couples', 'online', 'Which shared memory do you suspect your partner remembers very differently?'],
    ['new-understanding', 'truth-or-dare', 'couples', 'in-person', 'Which recent disagreement taught you something useful about how your partner needs support?', { type: 'truth' }],
    ['next-chapter', 'truth-or-sip', 'couples', 'online', 'What ordinary part of our future would you be excited to stop imagining and start living?'],
  ],
  cut: [
    ['unearned-confidence', 'truth-or-sip', 'medium', 'in-person', 'What do people trust you to handle that you are mostly improvising?'],
    ['secret-relief', 'confessions', 'medium', 'online', 'Confess a cancelled plan that disappointed everyone else but secretly rescued your evening.'],
    ['owed-correction', 'truth-or-sip', 'extreme', 'in-person', 'What flattering story about you needs a correction you have been avoiding?'],
    ['unfair-judgment', 'truth-or-sip', 'extreme', 'online', 'Which criticism of a friend became much harder to defend after you did the same thing?'],
    ['date-exit', 'truth-or-sip', '18+', 'in-person', 'What did a date say that made you start mentally calculating how soon you could leave?'],
    ['morning-account', 'confessions', '18+', 'online', 'Confess a night-out decision that required an unusually creative explanation the next morning.'],
    ['wrong-villain', 'truth-or-sip', 'unhinged', 'in-person', 'Which breakup story gets less sympathetic every time you remember another detail you left out?'],
    ['hot-exception', 'truth-or-sip', 'unhinged', 'online', 'What bullshit did you forgive because the person delivering it was ridiculously attractive?'],
  ],
  voting: [
    ['accidental-host', 'point-and-drink', 'easy', 'in-person', 'Who would become the host of a party they only stopped by to borrow something from?'],
    ['lost-itinerary', 'most-likely-to', 'easy', 'online', 'Who is most likely to plan the entire trip and forget which day they booked it for?'],
    ['expensive-entrance', 'point-and-drink', 'medium', 'in-person', 'Who would spend more on looking successful at a reunion than they spent on the actual holiday?'],
    ['new-identity', 'most-likely-to', 'medium', 'online', 'Who is most likely to join a new server and immediately reinvent their entire personality?'],
    ['loyal-witness', 'point-and-drink', 'extreme', 'in-person', 'Who would defend a friend so aggressively that everyone becomes suspicious of both of them?'],
    ['receipts-backfire', 'most-likely-to', 'unhinged', 'online', 'Who is most likely to bring receipts to an argument that prove they were the asshole?'],
    ['date-rescue', 'point-and-drink', 'couples', 'in-person', 'Who would rescue their partner from an awkward conversation and accidentally make it more awkward?'],
    ['performative-grief', 'most-likely-to', 'unhinged', 'online', 'Who is most likely to check their engagement statistics halfway through a dramatic farewell post?'],
  ],
  poison: [
    ['late-or-lost', 'would-you-rather', 'easy', 'in-person', '', options('arrive early at the wrong restaurant', 'arrive late at the right restaurant wearing the wrong outfit')],
    ['honest-reviews', 'would-you-rather', 'medium', 'online', '', options('hear your friends rate your advice', 'hear your friends rate how well you take theirs')],
    ['public-correction', 'would-you-rather', 'extreme', 'in-person', '', options('admit your biggest exaggeration to this group', 'let this group correctly guess it before you explain')],
    ['crush-commentary', 'would-you-rather', 'spicy', 'online', '', options('hear your crush describe your flirting', 'have to explain your flirting strategy to your crush')],
    ['shared-routine', 'would-you-rather', 'couples', 'in-person', '', options('let your partner plan every weekend for a month', 'plan every weekend without asking their preferences')],
    ['afterparty-or-date', 'would-you-rather', '18+', 'online', '', options('explain last night to your most judgmental friend', 'explain your dating history to your least discreet relative')],
    ['one-honest-friend', 'would-you-rather', 'unhinged', 'in-person', '', options('learn which friend tolerates you', 'learn exactly what keeps them from leaving')],
    ['tiny-or-loud', 'would-you-rather', 'kids', 'online', '', options('have a tiny marching band announce snack time', 'have your backpack sing whenever you forget something')],
  ],
  opinions: [
    ['last-slice', 'hot-takes', 'easy', 'in-person', 'The person offering everyone the last slice usually wants permission to eat it themselves.'],
    ['voice-note-length', 'hot-takes', 'medium', 'online', 'A long voice note needs a better excuse than the sender not wanting to type.'],
    ['loyalty-limit', 'hot-takes', 'extreme', 'in-person', 'A friendship that cannot survive one honest disagreement has mostly survived through avoidance.'],
    ['public-maturity', 'hot-takes', 'unhinged', 'online', 'Some people announce personal growth because admitting they lost the argument would sound less impressive.'],
    ['decision-fatigue', 'hot-takes', 'couples', 'in-person', 'Remembering which decisions exhaust your partner matters more than planning impressive surprises.'],
    ['date-budget', 'hot-takes', '18+', 'online', 'An expensive first date cannot compensate for making the other person feel like an audience.'],
    ['awkward-charm', 'hot-takes', 'spicy', 'in-person', 'A nervous compliment that notices something specific beats a flawless line that could be sent to anyone.'],
    ['school-vote', 'hot-takes', 'kids', 'online', 'Students should get one weekly vote that the grown-ups at school actually have to follow.'],
  ],
  seat: [
    ['wrong-dream-job', 'hot-seat', 'easy', 'in-person', 'What job would your friends assign you based on one misleading fact about your personality?'],
    ['predictable-excuse', 'hot-seat', 'medium', 'online', 'What excuse could everyone on this call correctly predict before you finished the first sentence?'],
    ['expensive-principle', 'hot-seat', 'extreme', 'in-person', 'Which principle would become inconvenient fastest if following it cost you a close friendship?'],
    ['jury-of-exes', 'hot-seat', 'unhinged', 'online', 'What would your exes agree about that you would immediately dismiss as a conspiracy?'],
    ['partner-trivia', 'hot-seat', 'couples', 'in-person', 'What boring detail about your partner would you notice had changed before anyone else did?'],
    ['night-out-role', 'hot-seat', '18+', 'online', 'What job does your group quietly assign you on a night out, and how badly have you performed it?'],
    ['flirt-giveaway', 'hot-seat', 'spicy', 'in-person', 'What do you start doing differently when you want someone to notice you but refuse to admit it?'],
    ['backpack-secret', 'hot-seat', 'kids', 'online', 'What would your backpack tell your teacher about you that your toys would try to deny?'],
  ],
  nhie: [
    ['wrong-greeting', 'never-have-i-ever', 'easy', 'in-person', 'Never have I ever returned a greeting in the wrong language and committed to it anyway.'],
    ['borrowed-expertise', 'never-have-i-ever', 'medium', 'online', 'Never have I ever researched someone\'s hobby mainly so I could sound interesting in our next chat.'],
    ['false-alibi', 'never-have-i-ever', 'extreme', 'in-person', 'Never have I ever agreed to cover for a friend before finding out what I was covering.'],
    ['gossip-investment', 'never-have-i-ever', 'unhinged', 'online', 'Never have I ever defended a terrible relationship because admitting my advice was shit felt worse.'],
    ['partner-habit', 'never-have-i-ever', 'couples', 'in-person', 'Never have I ever caught myself using a phrase I once teased my partner for saying.'],
    ['date-research', 'never-have-i-ever', '18+', 'online', 'Never have I ever researched a date so thoroughly that I nearly mentioned something they had not told me.'],
    ['strategic-seat', 'never-have-i-ever', 'spicy', 'in-person', 'Never have I ever changed seats for a reason that sounded much less obvious in my head.'],
    ['toy-alibi', 'never-have-i-ever', 'kids', 'online', 'Never have I ever blamed a missing snack on a toy and invented evidence to support the story.'],
  ],
  tod: [
    ['no-smile', 'truth-or-dare', 'easy', 'in-person', 'Explain why laughing should be banned while the group tries to make you smile.', { type: 'dare' }],
    ['misread-word', 'truth-or-dare', 'medium', 'online', 'What word did you use confidently before discovering everyone understood something different?', { type: 'truth' }],
    ['honest-commercial', 'dare-roulette', 'medium', 'in-person', 'Advertise your worst habit as though a customer has just discovered the catch.'],
    ['group-roast', 'dare-roulette', 'extreme', 'online', 'Let a willing player nominate one annoying habit of yours. Give its strongest possible defense.'],
    ['partner-guess', 'truth-or-dare', 'couples', 'in-person', 'Guess which tiny inconvenience has bothered your partner most this week, then let them correct you.', { type: 'dare' }],
    ['flirty-dialogue', 'dare-roulette', 'spicy', 'online', 'With a willing player, turn an ordinary disagreement about choosing a film into an obvious date invitation.'],
    ['invented-word', 'truth-or-dare', 'kids', 'in-person', 'What name would you give the feeling of finding something just after you stopped looking?', { type: 'truth' }],
    ['silent-story', 'dare-roulette', 'kids', 'online', 'Tell a story using only three sound effects. Let the call explain what they think happened.'],
  ],
  flags: [
    ['menu-expert', 'red-flag-green-flag', 'easy', 'in-person', 'They know the menu by heart but still ask everyone else what they would enjoy ordering.'],
    ['generous-audience', 'red-flag-green-flag', 'medium', 'online', 'They help you generously, then bring it up whenever the group needs an example of generosity.'],
    ['loyalty-price', 'red-flag-green-flag', 'extreme', 'in-person', 'They defend you fiercely but expect agreement with every decision as the price of that loyalty.'],
    ['ex-compensation', 'red-flag-green-flag', 'unhinged', 'online', 'They describe every ex as a disaster but proudly take credit for keeping the relationship going.'],
    ['perfect-plan', 'red-flag-green-flag', 'couples', 'in-person', 'Your partner plans wonderful surprises but gets offended when you would rather have a quiet evening.'],
    ['date-courtesy', 'red-flag-green-flag', '18+', 'online', 'They split the first-date bill fairly, then publicly review the date without asking how you feel about it.'],
    ['private-compliment', 'red-flag-green-flag', 'spicy', 'in-person', 'They flirt confidently in private but pretend not to know you when friends notice the chemistry.'],
    ['fair-rules', 'red-flag-green-flag', 'kids', 'online', 'They explain a new game patiently, then quietly skip the rule that would make them lose.'],
  ],
  roles: [
    ['airport-guide', 'most-likely-to', 'easy', 'in-person', 'Who is most likely to become the group\'s airport guide despite never knowing which gate they need?'],
    ['chat-lawyer', 'point-and-drink', 'medium', 'online', 'Who would become the group chat\'s defense lawyer before checking whether the accused actually did it?'],
    ['reunion-host', 'most-likely-to', 'extreme', 'in-person', 'Who is most likely to host a reunion and accidentally arrange the seating like a revenge plan?'],
    ['reality-villain', 'point-and-drink', 'unhinged', 'online', 'Who would become the villain of a dating show and blame the edit before episode one aired?'],
    ['shared-holiday', 'most-likely-to', 'couples', 'in-person', 'Who is most likely to become the unofficial holiday planner because their partner cannot survive another spontaneous itinerary?'],
    ['bar-negotiator', 'point-and-drink', '18+', 'online', 'Who would volunteer to settle the bar tab and somehow finish with three new financial enemies?'],
    ['crush-coach', 'most-likely-to', 'spicy', 'in-person', 'Who is most likely to become everyone\'s flirting coach while being hopeless around their own crush?'],
    ['team-captain', 'point-and-drink', 'kids', 'online', 'Who would become captain of a treasure hunt and spend the first hour designing the team flag?'],
  ],
};

export const RESEARCHED_PROMPTS: PromptItem[] = (Object.entries(SEEDS) as [PromptSourceId, Seed[]][]).flatMap(([sourceId, seeds]) => seeds.map(([key, gameId, category, playMode, text, extras = {}]) => {
  const { originalItemId, ...fields } = extras;
  return {
    id: `researched-${sourceId}-${key}`, gameId, category, playMode,
    text: fields.optionA && fields.optionB ? `Would you rather ${fields.optionA} or ${fields.optionB}?` : text,
    ...fields,
    ...(gameId === 'truth-or-sip' ? { forfeit: category === 'kids' ? 'Make a silly sound, or pass.' : 'Take a sip of any drink, or pass.' } : {}),
    provenance: { sourceId, relationship: originalItemId ? 'licensed-copy' as const : 'format-inspired' as const, ...(originalItemId ? { originalItemId } : {}) },
  };
}));

export const RESEARCHED_IN_PERSON_PROMPTS = RESEARCHED_PROMPTS.filter(p => p.playMode === 'in-person');
export const RESEARCHED_ONLINE_PROMPTS = RESEARCHED_PROMPTS.filter(p => p.playMode === 'online');
