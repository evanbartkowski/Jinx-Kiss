import { usePlayingDeck } from '../context/PlayingDeckContext';
import { rollForLegendaryCard } from '../utils/legendaryCards';

// A custom deck only draws its own cards, including any rare cards its author added.
const keepDeckCard: typeof rollForLegendaryCard = prompt => prompt;
export function useLegendaryDraw() {
  return usePlayingDeck() ? keepDeckCard : rollForLegendaryCard;
}
