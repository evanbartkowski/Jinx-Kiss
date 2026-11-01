import { GameId } from '../types/game';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { AppView } from '../App';

export function updatePageSEO(view: AppView, gameId?: GameId) {
  let title = 'JinxKiss - Ultimate Online Party Card Games | Truth or Dare, Never Have I Ever & More';
  let description = 'Play JinxKiss: 12 free online & in-person party card games with friends. Truth or Dare, Never Have I Ever, Would You Rather, Point and Drink, and live multiplayer rooms.';
  let path = '';

  if (view === 'game' && gameId && GAMES_CONFIG[gameId]) {
    const game = GAMES_CONFIG[gameId];
    title = `${game.title} - JinxKiss Party Game | Play Online & In-Person`;
    description = `${game.description} Play ${game.title} online or in-person with friends across Easy, Medium, Extreme, Unhinged, Couples, and 18+ categories.`;
    path = `game/${gameId}`;
  } else if (view === 'multiplayer') {
    title = 'Party Rooms - Realtime Multiplayer Party Games Online | JinxKiss';
    description = 'Join or host a realtime multiplayer party room on JinxKiss. Play party card games with friends over Zoom, Discord, or FaceTime using 5-digit room codes.';
    path = 'rooms';
  } else if (view === 'party-setup' || view === 'party-game') {
    title = 'Party Mode - Ultimate Custom Party Card Game Experience | JinxKiss';
    description = 'Customize player names, turn timers, drinking penalties, and curate categories for the ultimate group party game night.';
    path = 'party';
  } else if (view === 'my-decks' || view === 'create-deck' || view === 'edit-deck') {
    title = 'Custom Decks & Community Cards - Create Your Own Party Game | JinxKiss';
    description = 'Browse, create, and share custom party card decks with unique truths, dares, dilemmas, and callouts on JinxKiss.';
    path = 'my-decks';
  } else if (view === 'profile') {
    title = 'Player Profile & Game Stats | JinxKiss';
    description = 'View your JinxKiss game history, voting records, created decks, and achievements.';
    path = 'profile';
  }

  // Update Document Title
  document.title = title;

  // Update Meta Description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', description);
  }

  // Update Open Graph Tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute('content', path ? `https://jinxkiss-cfbaf.web.app/#/${path}` : 'https://jinxkiss-cfbaf.web.app/');
  }

  // Update Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', path ? `https://jinxkiss-cfbaf.web.app/${path}` : 'https://jinxkiss-cfbaf.web.app/');
  }
}
