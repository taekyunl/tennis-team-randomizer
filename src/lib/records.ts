import type { MatchRecord, PairStanding, PlayerStanding } from '../types';

export interface RecordDraft {
  date: string;
  teamA: [string, string];
  teamB: [string, string];
  winner: 'A' | 'B';
  sets: Array<{
    teamAGames: string;
    teamBGames: string;
  }>;
  note: string;
}

export function createEmptyRecordDraft(date: string): RecordDraft {
  return {
    date,
    teamA: ['', ''],
    teamB: ['', ''],
    winner: 'A',
    sets: [
      { teamAGames: '', teamBGames: '' },
      { teamAGames: '', teamBGames: '' },
      { teamAGames: '', teamBGames: '' },
    ],
    note: '',
  };
}

export function canSaveRecord(draft: RecordDraft): boolean {
  const names = [...draft.teamA, ...draft.teamB].map((name) => name.trim());
  return (
    names.every(Boolean) &&
    new Set(names).size === 4
  );
}

function normalizeSets(draft: RecordDraft) {
  return draft.sets
    .map((set) => ({
      teamAGames: Number.parseInt(set.teamAGames, 10),
      teamBGames: Number.parseInt(set.teamBGames, 10),
    }))
    .filter((set) => Number.isFinite(set.teamAGames) && Number.isFinite(set.teamBGames));
}

function getPairKey(players: [string, string]) {
  return [...players].sort((left, right) => left.localeCompare(right, 'ko')).join(' / ');
}

export function createMatchRecord(draft: RecordDraft): MatchRecord {
  if (!canSaveRecord(draft)) {
    throw new Error('Invalid record draft.');
  }

  return {
    id: crypto.randomUUID(),
    date: draft.date,
    teamA: [draft.teamA[0].trim(), draft.teamA[1].trim()],
    teamB: [draft.teamB[0].trim(), draft.teamB[1].trim()],
    winner: draft.winner,
    sets: normalizeSets(draft),
    note: draft.note.trim(),
    createdAt: new Date().toISOString(),
  };
}

export function computeStandings(records: MatchRecord[]): PlayerStanding[] {
  const table = new Map<string, PlayerStanding>();

  function ensure(playerName: string) {
    if (!table.has(playerName)) {
      table.set(playerName, {
        playerName,
        wins: 0,
        losses: 0,
        games: 0,
        winRate: 0,
        points: 0,
      });
    }

    return table.get(playerName)!;
  }

  for (const record of records) {
    const winningTeam = record.winner === 'A' ? record.teamA : record.teamB;
    const losingTeam = record.winner === 'A' ? record.teamB : record.teamA;

    for (const playerName of winningTeam) {
      const row = ensure(playerName);
      row.wins += 1;
      row.games += 1;
      row.points += 3;
    }

    for (const playerName of losingTeam) {
      const row = ensure(playerName);
      row.losses += 1;
      row.games += 1;
    }
  }

  return [...table.values()]
    .map((row) => ({
      ...row,
      winRate: row.games ? row.wins / row.games : 0,
    }))
    .sort((left, right) => {
      if (right.points !== left.points) {
        return right.points - left.points;
      }
      if (right.winRate !== left.winRate) {
        return right.winRate - left.winRate;
      }
      if (right.wins !== left.wins) {
        return right.wins - left.wins;
      }
      return left.playerName.localeCompare(right.playerName, 'ko');
    });
}

export function computePairStandings(records: MatchRecord[]): PairStanding[] {
  const table = new Map<string, PairStanding>();

  function ensure(pair: [string, string]) {
    const sortedPlayers = [...pair].sort((left, right) => left.localeCompare(right, 'ko')) as [string, string];
    const pairKey = getPairKey(sortedPlayers);

    if (!table.has(pairKey)) {
      table.set(pairKey, {
        pairKey,
        players: sortedPlayers,
        wins: 0,
        losses: 0,
        games: 0,
        winRate: 0,
      });
    }

    return table.get(pairKey)!;
  }

  for (const record of records) {
    const teamA = ensure(record.teamA);
    const teamB = ensure(record.teamB);

    teamA.games += 1;
    teamB.games += 1;

    if (record.winner === 'A') {
      teamA.wins += 1;
      teamB.losses += 1;
    } else {
      teamB.wins += 1;
      teamA.losses += 1;
    }
  }

  return [...table.values()]
    .map((row) => ({
      ...row,
      winRate: row.games ? row.wins / row.games : 0,
    }))
    .sort((left, right) => {
      if (right.wins !== left.wins) {
        return right.wins - left.wins;
      }
      if (right.winRate !== left.winRate) {
        return right.winRate - left.winRate;
      }
      return left.pairKey.localeCompare(right.pairKey, 'ko');
    });
}
