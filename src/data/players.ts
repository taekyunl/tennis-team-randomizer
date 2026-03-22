import type { Player } from '../types';

export const PLAYERS: Player[] = [
  { id: 'lee-jongha', name: '이종하', tier: 'A', rating: 3.2 },
  { id: 'kang-ingap', name: '강인갑', tier: 'A', rating: 3.1 },
  { id: 'kim-ryeonggon', name: '김령곤', tier: 'A', rating: 3.0 },
  { id: 'go-yeongsu', name: '고영수', tier: 'B', rating: 2.2 },
  { id: 'choi-yunho', name: '최윤호', tier: 'B', rating: 2.1 },
  { id: 'park-myeongseon', name: '박명선', tier: 'B', rating: 2.0 },
  { id: 'lee-dongmyeong', name: '이동명', tier: 'B', rating: 2.0 },
  { id: 'lee-taegyun', name: '이태균', tier: 'C', rating: 1.2 },
  { id: 'son-hyewon', name: '손혜원', tier: 'C', rating: 1.1 },
  { id: 'kim-hyeyeon', name: '김혜연', tier: 'C', rating: 1.0 },
];

export const PLAYER_MAP = new Map(PLAYERS.map((player) => [player.id, player]));
