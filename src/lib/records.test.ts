import { describe, expect, it } from 'vitest';
import { canSaveRecord, computePairStandings, computeStandings } from './records';
import type { MatchRecord } from '../types';

describe('records', () => {
  it('validates that a match record needs four distinct players', () => {
    expect(
      canSaveRecord({
        date: '2026-03-21',
        teamA: ['이종하', '강인갑'],
        teamB: ['김령곤', '고영수'],
        winner: 'A',
        note: '',
      }),
    ).toBe(true);

    expect(
      canSaveRecord({
        date: '2026-03-21',
        teamA: ['이종하', '강인갑'],
        teamB: ['이종하', '고영수'],
        winner: 'A',
        note: '',
      }),
    ).toBe(false);
  });

  it('computes standings from saved match records', () => {
    const records: MatchRecord[] = [
      {
        id: '1',
        date: '2026-03-21',
        teamA: ['이종하', '강인갑'],
        teamB: ['김령곤', '고영수'],
        winner: 'A',
        note: '',
        createdAt: '2026-03-21T10:00:00.000Z',
      },
      {
        id: '2',
        date: '2026-03-22',
        teamA: ['이종하', '고영수'],
        teamB: ['김령곤', '강인갑'],
        winner: 'B',
        note: '',
        createdAt: '2026-03-22T10:00:00.000Z',
      },
    ];

    const standings = computeStandings(records);

    expect(standings[0]).toMatchObject({ playerName: '강인갑', attendance: 2, wins: 2, losses: 0 });
    expect(standings.find((row) => row.playerName === '고영수')).toMatchObject({ attendance: 2, wins: 0, losses: 2 });
  });

  it('computes pair standings separately', () => {
    const records: MatchRecord[] = [
      {
        id: '1',
        date: '2026-03-21',
        teamA: ['이종하', '강인갑'],
        teamB: ['김령곤', '고영수'],
        winner: 'A',
        note: '',
        createdAt: '2026-03-21T10:00:00.000Z',
      },
      {
        id: '2',
        date: '2026-03-28',
        teamA: ['이종하', '강인갑'],
        teamB: ['최윤호', '박명선'],
        winner: 'A',
        note: '',
        createdAt: '2026-03-28T10:00:00.000Z',
      },
    ];

    const pairStandings = computePairStandings(records);

    expect(pairStandings[0]).toMatchObject({
      players: ['강인갑', '이종하'],
      wins: 2,
      losses: 0,
    });
  });
});
