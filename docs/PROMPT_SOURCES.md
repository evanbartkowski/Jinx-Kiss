# Researched prompt expansion

Reviewed on October 25, 2026. The expansion adds 86 cards: 43 for each play format. Every card has a source ID, an explicit game/category assignment, and a reuse relationship in `src/data/prompts/researchedPrompts.ts`.

Two questions reproduce items 37 and 213 from Parabol's pinned, MIT-licensed dataset. The other 84 cards are original writing informed by familiar formats and question archetypes. They are not copied commercial cards or claims that these particular new questions have proven popularity.

| Reference | How it informed this expansion |
| --- | --- |
| [Parabol Icebreakers](https://github.com/ParabolInc/icebreakers/blob/35b3f1579852e1e1e535983ab7a503b6e0e44550/lib/api.ts) | Two licensed reproductions and four original conversation starters. |
| [We're Not Really Strangers](https://www.werenotreallystrangers.com/pages/core-game) | Perspective and relationship reflection. Its publisher reports over one million core games sold. |
| [Truth or Drink](https://www.cut.com/truth-or-drink-party-games) | Personal disclosure with an option to pass. Cut reports over 100,000 first-edition copies sold. |
| [The Voting Game](https://dycegames.com/collections/the-voting-game) | Situations that invite revealing player nominations. |
| [Pick Your Poison](https://dycegames.com/collections/pick-your-poison) | Comparable competing dilemmas. |
| [Bad Opinions](https://dycegames.com/collections/bad-opinions) | Debatable claims with clear opposing positions. |
| [Hot Seat](https://dycegames.com/collections/hot-seat) | Spotlight questions about a particular player. |
| [PsyCat: Never Have I Ever](https://psycatgames.com/magazine/party-games/never-ever/) | Short, recognizable admissions rather than hypothetical questions. |
| [PsyCat: Truth or Dare](https://psycatgames.com/magazine/party-games/truth-or-dare/) | Separate personal questions and performable challenges. |
| [Red Flags retailer overview](https://www.gameology.com.au/products/red-flags) | Tradeoffs between appealing qualities and dealbreakers. |
| [Role Models](https://www.jackboxgames.com/games/role-models) | Group-role judgments adapted to player nominations. |

The source registry is `src/data/prompts/sources.ts`. Commercial references are format research, not redistribution licenses or endorsements. Do not label a new card as a licensed copy without checking its source and permission separately.

The complete Parabol notice ships in `public/prompt-sources.txt`, linked from the website footer. Questions are bundled with the app; gameplay makes no requests to third-party question services.

## Category and mechanics review

- Kids uses wholesome imagination, school, toys, and fair play. Adult themes stay in age-confirmed categories.
- Easy stays low pressure; Medium introduces personal admissions; Extreme asks harder social questions.
- Couples concerns shared relationships. Spicy concerns flirting without explicit content. 18+ covers mature dating/nightlife; Unhinged adds adult social judgment and darker humor.
- Truth or Dare requires a type. Would You Rather has two complete alternatives. Hot Takes uses opinions, flags use behaviors, and nomination games ask players to select someone.
- Online challenges work through the call, without involving bystanders or requiring private messages to be shown.

Run `npm run test:prompts` for source attribution, game/category isolation, duplicate checks, and age boundaries. Editorial review remains necessary for meaning and entertainment value.
