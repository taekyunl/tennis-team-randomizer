export type PlayerTier = 'A' | 'B' | 'C';

export interface Player {
  id: string;
  name: string;
  tier: PlayerTier;
  rating: number;
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
