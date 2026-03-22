export type PlayerTier = 'A' | 'B' | 'C';

export interface Player {
  id: string;
  name: string;
  tier: PlayerTier;
  rating: number;
  isGuest?: boolean;
  seedLabel?: string;
  skillHint?: string;
}

export interface Team {
  teamLabel: string;
  members: [Player, Player];
  ratingTotal: number;
}

export interface FairnessMeta {
  score: number;
  standardDeviation: number;
  range: number;
  averagePartnerGap: number;
  maxPartnerGap: number;
  sameTierPairs: number;
  extremePairs: number;
  waitingPenalty: number;
  eligibleCandidateCount: number;
}

export interface PairingCandidate {
  pairs: Array<[Player, Player]>;
  waitingPlayer?: Player;
  score: number;
  signature: string;
  meta: Omit<FairnessMeta, 'eligibleCandidateCount'>;
}

export interface AssignmentResult {
  teams: Team[];
  waitingPlayer?: Player;
  seedKey: string;
  selectedCount: number;
  fairnessMeta: FairnessMeta;
}

export interface MatchRecord {
  id: string;
  date: string;
  teamA: [string, string];
  teamB: [string, string];
  winner: 'A' | 'B';
  sets?: Array<{
    teamAGames: number;
    teamBGames: number;
  }>;
  note?: string;
  createdAt: string;
}

export interface PlayerStanding {
  playerName: string;
  wins: number;
  losses: number;
  games: number;
  winRate: number;
  points: number;
}

export interface PairStanding {
  pairKey: string;
  players: [string, string];
  wins: number;
  losses: number;
  games: number;
  winRate: number;
}
