import type { MatchRecord } from '../types';

export const INITIAL_RECORDS: MatchRecord[] = [
  {
    id: '2026-03-22-match-1',
    date: '2026-03-22',
    teamA: ['김령곤', '이태균'],
    teamB: ['이종하', '고영수'],
    winner: 'A',
    note: '4:2',
    createdAt: '2026-03-22T09:00:00.000Z',
  },
  {
    id: '2026-03-22-match-2',
    date: '2026-03-22',
    teamA: ['김령곤', '이태균'],
    teamB: ['강인갑', '손혜원'],
    winner: 'B',
    note: '1:4',
    createdAt: '2026-03-22T09:10:00.000Z',
  },
  {
    id: '2026-03-22-match-3',
    date: '2026-03-22',
    teamA: ['강인갑', '손혜원'],
    teamB: ['이종하', '고영수'],
    winner: 'B',
    note: '1:4',
    createdAt: '2026-03-22T09:20:00.000Z',
  },
  {
    id: '2026-03-22-match-4',
    date: '2026-03-22',
    teamA: ['김령곤', '이태균'],
    teamB: ['이종하', '고영수'],
    winner: 'B',
    note: '1:4',
    createdAt: '2026-03-22T09:30:00.000Z',
  },
  {
    id: '2026-03-22-match-5',
    date: '2026-03-22',
    teamA: ['김령곤', '이태균'],
    teamB: ['강인갑', '손혜원'],
    winner: 'A',
    note: '4:1',
    createdAt: '2026-03-22T09:40:00.000Z',
  },
];
