/** Mechanical editorial checks. Meaning, originality, and tone still need review. */
export function getPromptQualityIssue(text: string): string | null {
  const prompt = text.trim();
  if (/\([^()]*#\d+\)|(?:prompt|question|scenario|confession|challenge)\s*#\d+/i.test(prompt)) return 'Remove the numbered filler variant.';
  if (/absolute most honest|unfiltered opinion or experience regarding|demonstration or impression inspired by|share something (?:nobody|no one) (?:here |in (?:the|this) (?:room|call) )?knows/i.test(prompt)) return 'Replace the template with a specific situation.';
  if (/^(?:what (?:is|was|are)|what['’]s|tell us) your (?:absolute |all.time |ultimate )?(?:favou?rite|best|worst) (?:colou?r|food|movie|cartoon|animal|song|book|game|season|snack|superhero|holiday|subject|sport|meal|vacation|tv show)(?:\s+(?:of all time|ever|right now))?[?!.]*$/i.test(prompt)) return 'Give the question a surprising choice, incident, or consequence.';
  if (/^(?:what (?:is|was)|what['’]s) your (?:biggest|greatest|deepest|wildest) (?:fear|dream|secret|fantasy|turn.on|turn.off|pet peeve)[?!.]*$/i.test(prompt)) return 'Give the question a concrete situation or story trigger.';
  return null;
}

/** Ignore decorative intensifiers when comparing the same idea. */
export function promptIdeaKey(text: string): string {
  return text.toLowerCase()
    .replace(/^(?:point\s*(?:&|and)\s*drink|most likely to|controversial take|confessions?|hot seat):\s*/i, '')
    .replace(/\b(?:actually|genuinely|secretly|literally|absolute|absolutely|completely|ever|really|totally|incredibly|honestly|very)\b/g, '')
    .replace(/[^a-z0-9]/g, '');
}
