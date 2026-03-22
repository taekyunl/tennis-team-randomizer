import type { AssignmentResult, PairingCandidate, Player } from '../types';
import { createSeedKey, createSeededRng, getPlayerSeedToken } from './seed';

const collator = new Intl.Collator('ko');
const WEAK_PLAYER_NAMES = new Set(['손혜원', '이태균', '김혜연']);

function sortPlayers(players: Player[]): Player[] {
  return [...players].sort((left, right) => collator.compare(left.name, right.name));
}

function createSignature(pairs: Array<[Player, Player]>, waitingPlayer?: Player): string {
  const pairSignature = pairs
    .map(([left, right]) => [left.name, right.name].sort((a, b) => collator.compare(a, b)).join('+'))
    .sort((a, b) => collator.compare(a, b))
    .join('__');

  return waitingPlayer ? `${pairSignature}__waiting:${waitingPlayer.name}` : pairSignature;
}

function isForbiddenWeakPair(left: Player, right: Player) {
  return WEAK_PLAYER_NAMES.has(left.name) && WEAK_PLAYER_NAMES.has(right.name);
}

export function scorePairing(
  pairs: Array<[Player, Player]>,
  _players: Player[],
  waitingPlayer?: Player,
): Omit<PairingCandidate, 'pairs' | 'waitingPlayer' | 'signature'>['meta'] & { score: number } {
  const forbiddenPairCount = pairs.filter(([left, right]) => isForbiddenWeakPair(left, right)).length;
  const score = forbiddenPairCount;

  return {
    score,
    standardDeviation: 0,
    range: 0,
    averagePartnerGap: 0,
    maxPartnerGap: 0,
    sameTierPairs: forbiddenPairCount,
    extremePairs: 0,
    waitingPenalty: waitingPlayer ? 0 : 0,
  };
}

function buildPairings(
  remaining: Player[],
  originalPlayers: Player[],
  waitingPlayer: Player | undefined,
  pairs: Array<[Player, Player]>,
  candidates: PairingCandidate[],
) {
  if (remaining.length === 0) {
    const meta = scorePairing(pairs, originalPlayers, waitingPlayer);
    candidates.push({
      pairs: [...pairs],
      waitingPlayer,
      score: meta.score,
      signature: createSignature(pairs, waitingPlayer),
      meta,
    });
    return;
  }

  const [first, ...rest] = remaining;

  for (let index = 0; index < rest.length; index += 1) {
    const second = rest[index];
    const nextRemaining = rest.filter((_, playerIndex) => playerIndex !== index);
    pairs.push([first, second]);
    buildPairings(nextRemaining, originalPlayers, waitingPlayer, pairs, candidates);
    pairs.pop();
  }
}

export function generateAllPairings(players: Player[]): PairingCandidate[] {
  const sortedPlayers = sortPlayers(players);
  const candidates: PairingCandidate[] = [];

  if (sortedPlayers.length < 2) {
    return candidates;
  }

  if (sortedPlayers.length % 2 === 0) {
    buildPairings(sortedPlayers, sortedPlayers, undefined, [], candidates);
  } else {
    for (const waitingPlayer of sortedPlayers) {
      const activePlayers = sortedPlayers.filter((player) => player.id !== waitingPlayer.id);
      buildPairings(activePlayers, sortedPlayers, waitingPlayer, [], candidates);
    }
  }

  return candidates.sort((left, right) => collator.compare(left.signature, right.signature));
}

export function pickDeterministicCandidate(
  candidates: PairingCandidate[],
  rng: () => number,
): { candidate: PairingCandidate; eligibleCandidateCount: number } {
  if (candidates.length === 0) {
    throw new Error('No pairing candidates available.');
  }

  const bestScore = Math.min(...candidates.map((candidate) => candidate.score));
  const eligibleCandidates = candidates.filter((candidate) => candidate.score === bestScore);
  const selectedIndex = Math.floor(rng() * eligibleCandidates.length);

  return {
    candidate: eligibleCandidates[selectedIndex] ?? eligibleCandidates[0],
    eligibleCandidateCount: eligibleCandidates.length,
  };
}

export function assignTeams(date: string, selectedPlayers: Player[]): AssignmentResult {
  const normalizedPlayers = sortPlayers(selectedPlayers);

  if (normalizedPlayers.length < 2) {
    throw new Error('At least two players are required.');
  }

  const seedKey = createSeedKey(
    date,
    normalizedPlayers.map((player) => getPlayerSeedToken(player)),
  );
  const rng = createSeededRng(seedKey);
  const candidates = generateAllPairings(normalizedPlayers);
  const { candidate, eligibleCandidateCount } = pickDeterministicCandidate(candidates, rng);

  const teams = candidate.pairs.map(([left, right], index) => ({
    teamLabel: `${index + 1}조`,
    members: [left, right] as [Player, Player],
    ratingTotal: Number((left.rating + right.rating).toFixed(2)),
  }));

  return {
    teams,
    waitingPlayer: candidate.waitingPlayer,
    seedKey,
    selectedCount: normalizedPlayers.length,
    fairnessMeta: {
      ...candidate.meta,
      score: Number(candidate.score.toFixed(4)),
      standardDeviation: Number(candidate.meta.standardDeviation.toFixed(4)),
      range: Number(candidate.meta.range.toFixed(4)),
      waitingPenalty: Number(candidate.meta.waitingPenalty.toFixed(4)),
      eligibleCandidateCount,
    },
  };
}
