import { PLAYERS } from '../data/players';
import type { Player, PlayerTier } from '../types';

export interface GuestDraft {
  id: string;
  name: string;
  strongerPlayerId: string;
  weakerPlayerId: string;
}

function getTierFromRating(rating: number): PlayerTier {
  if (rating >= 2.7) {
    return 'A';
  }
  if (rating >= 1.7) {
    return 'B';
  }
  return 'C';
}

export function createEmptyGuestDraft(): GuestDraft {
  return {
    id: `guest-${crypto.randomUUID()}`,
    name: '',
    strongerPlayerId: '고영수',
    weakerPlayerId: '박명선',
  };
}

export function createGuestPlayer(draft: GuestDraft): Player | null {
  const trimmedName = draft.name.trim();
  if (!trimmedName) {
    return null;
  }

  const strongerPlayer = PLAYERS.find((player) => player.name === draft.strongerPlayerId);
  const weakerPlayer = PLAYERS.find((player) => player.name === draft.weakerPlayerId);

  if (!strongerPlayer || !weakerPlayer) {
    return null;
  }

  const high = Math.max(strongerPlayer.rating, weakerPlayer.rating);
  const low = Math.min(strongerPlayer.rating, weakerPlayer.rating);
  const rating = Number(((high + low) / 2).toFixed(2));
  const skillHint = `${strongerPlayer.name} - ${weakerPlayer.name} 사이`;

  return {
    id: draft.id,
    name: trimmedName,
    tier: getTierFromRating(rating),
    rating,
    isGuest: true,
    seedLabel: `게스트:${trimmedName}:${skillHint}`,
    skillHint,
  };
}
