import { GameCategory, GameId, PlayMode, PromptItem } from '../types/game';
import { getPromptQualityIssue } from './promptQuality';
import { requiresAdultConfirmation } from './contentPolicy';

export const PROMPT_CATEGORIES: GameCategory[] = ['easy', 'medium', 'extreme', 'unhinged', 'couples', '18+', 'spicy', 'kids'];
const GAME_IDS: GameId[] = ['truth-or-dare', 'never-have-i-ever', 'would-you-rather', 'hot-takes', 'dare-roulette', 'red-flag-green-flag', 'truth-or-sip', 'point-and-drink', 'most-likely-to', 'confessions', 'hot-seat', 'chaos-mix'];

// These are content checks, not a substitute for editorial review of new cards.
export const EXPLICIT_CONTENT = /\b(?:sex(?:ual(?:ly)?)?|orgasms?|masturbat\w*|nudes?|nudity|naked|porn\w*|kinks?|kinky|fetish\w*|sext(?:ing|ed|s)?|genitals?|erotic|nsfw|threesomes?|climax|oral (?:session|pleasure|sex)|striptease|strip tease|strip poker|stripping|stripped|adult toys?|sex toys?|butt plugs?|bondage|bdsm|hook(?:ed|ing)? up|hookups?|one.night stand|dirty (?:talk|command|sentence|thought|fantas\w*|whisper\w*|innuendo\w*)|dirtiest|filthy|filthiest|bedroom (?:fantas\w*|technique\w*|props|acts?|compatibility|chemistry|volume|turn\w*)|explicit|quickie|pleasure devices?|hickeys?|(?:get|getting|got|feel|feeling) turned on|turned on by|turns? you on|arous\w*|body shots?|handcuffs?|blindfold\w*|lap dance|spicy (?:photos?|videos?))\b/i;
export const KIDS_MATURE_CONTENT = /\b(?:alcohol\w*|beers?|wines?|vodka|tequila|whisk(?:e)?y|drunk|drinking|hangover|cocktails?|body shots?|dating|dates?|crush(?:es)?|flirt\w*|romantic|kiss(?:ed|ing)?|exes|ex.partner|arrest\w*|illegal|murder|kill|die|death|cigarettes?|vaping|weed|cocaine)\b/i;
export const ADULT_SPICY_CONTEXT = /\b(?:bedroom|submissive|dominant|intimacy|sensual|foreplay|lingerie|moaning|sexual position|being intimate|quickies?|aftercare|restrain\w*|pinned down|mattress|headboard|touching (?:your|them)sel(?:f|ves)|sexiest|aphrodisiac|breathless|intimate (?:photos?|fantas\w*))\b/i;
const QUESTION = /^(?:what|who|which|when|where|why|how|have you|has your|do you|did you|would you|could you)\b/i;

export function promptContentText(prompt: PromptItem): string {
  return [prompt.text, prompt.optionA, prompt.optionB, prompt.scenario, prompt.discussionPrompt, prompt.forfeit, prompt.confessionStarter].filter(Boolean).join(' ');
}

export function getPromptValidationErrors(prompt: PromptItem): string[] {
  const errors: string[] = [];
  if (!prompt || typeof prompt !== 'object') return ['Card must be an object.'];
  if (typeof prompt.id !== 'string' || !prompt.id.trim()) errors.push('Card needs an ID.');
  if (!GAME_IDS.includes(prompt.gameId)) errors.push('Choose a valid game.');
  if (!PROMPT_CATEGORIES.includes(prompt.category)) errors.push('Choose a valid category.');
  if (prompt.playMode && !['online', 'in-person'].includes(prompt.playMode)) errors.push('Choose a valid play mode.');
  if (typeof prompt.text !== 'string' || !prompt.text.trim()) return [...errors, 'Enter a card prompt.'];
  const text = prompt.text.trim();
  const qualityIssue = getPromptQualityIssue(text);
  if (qualityIssue) errors.push(qualityIssue);
  const game = prompt.gameId === 'chaos-mix' ? prompt.originGameId : prompt.gameId;
  if (!game || game === 'chaos-mix') errors.push('Chaos Mix cards must identify their original game.');
  if (game === 'truth-or-dare' && !['truth', 'dare'].includes(prompt.type || '')) errors.push('Choose Truth or Dare for this card.');
  const optionA = typeof prompt.optionA === 'string' ? prompt.optionA.trim() : '';
  const optionB = typeof prompt.optionB === 'string' ? prompt.optionB.trim() : '';
  if (game === 'would-you-rather' && (!optionA || !optionB || optionA.toLowerCase() === optionB.toLowerCase())) errors.push('Would You Rather needs two different, complete options.');
  if (game === 'never-have-i-ever' && !/^never have i ever\b/i.test(text)) errors.push('Start this statement with "Never have I ever".');
  if (['point-and-drink', 'most-likely-to'].includes(game || '') && !/^(?:who\b|which\b|point\b|on the count\b|most likely to\b)/i.test(text)) errors.push('This game needs a question asking players to choose someone in the group.');
  if (game === 'hot-takes' && (QUESTION.test(text) || /\?\s*$/.test(text))) errors.push('Hot Takes needs an opinion players can agree or disagree with.');
  if (game === 'red-flag-green-flag' && QUESTION.test(text)) errors.push('Describe a behavior players can judge as a red or green flag.');
  if ((game === 'dare-roulette' || (game === 'truth-or-dare' && prompt.type === 'dare')) && QUESTION.test(text)) errors.push('A dare must describe an action to perform.');
  const content = promptContentText(prompt).replace(/opposite sex/gi, 'another gender');
  if (!requiresAdultConfirmation(prompt.category) && (EXPLICIT_CONTENT.test(content) || (prompt.category === 'spicy' && ADULT_SPICY_CONTEXT.test(content)))) errors.push('Adult content belongs in 18+ or Unhinged.');
  if (prompt.category === 'kids' && KIDS_MATURE_CONTENT.test(content)) errors.push('Kids cards must avoid adult themes, romance, and drinking.');
  return errors;
}

export function filterPromptsForScope(prompts: PromptItem[], gameId: GameId, category?: GameCategory, playMode: PlayMode = 'in-person'): PromptItem[] {
  return prompts.filter(p => p.gameId === gameId && (!category || p.category === category) && (p.playMode || 'in-person') === playMode && p.isActive !== false && getPromptValidationErrors(p).length === 0);
}

export function promptContentKey(prompt: PromptItem): string {
  return [prompt.originGameId || prompt.gameId, prompt.category, prompt.playMode || 'in-person', prompt.type || '', prompt.text, prompt.optionA || '', prompt.optionB || ''].join('|').toLowerCase().replace(/[^a-z0-9|]/g, '');
}
