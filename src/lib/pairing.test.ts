import { describe, expect, it } from 'vitest';
import { PLAYERS } from '../data/players';
import { assignTeams, generateAllPairings, scorePairing } from './pairing';
import { createSeedKey } from './seed';

function findPlayers(names: string[]) {
  return PLAYERS.filter((player) => names.includes(player.name));
}

function flattenAssignment(result: ReturnType<typeof assignTeams>) {
  const names = result.teams.flatMap((team) => team.members.map((member) => member.name));
  if (result.waitingPlayer) {
    names.push(result.waitingPlayer.name);
  }
  return names.sort();
}

describe('seeded assignment', () => {
  it('returns the same result for the same date and attendee set', () => {
    const players = findPlayers(['이종하', '강인갑', '김령곤', '고영수', '최윤호', '박명선']);
    const first = assignTeams('2026-03-21', players);
    const second = assignTeams('2026-03-21', [...players].reverse());

    expect(first).toEqual(second);
  });

  it('can produce a different result when the date changes', () => {
    const scenarios = [
      ['이종하', '강인갑', '김령곤', '고영수', '최윤호', '박명선'],
      ['이종하', '강인갑', '김령곤', '고영수', '최윤호', '박명선', '김동명', '이태균'],
      ['이종하', '강인갑', '김령곤', '고영수', '최윤호', '박명선', '김동명'],
    ];

    let changed = false;

    for (const names of scenarios) {
      const players = findPlayers(names);
      const first = assignTeams('2026-03-21', players);
      const firstSignature = JSON.stringify(first.teams);

      for (let day = 22; day <= 31; day += 1) {
        const second = assignTeams(`2026-03-${String(day).padStart(2, '0')}`, players);
        expect(second.seedKey).not.toBe(first.seedKey);

        if (JSON.stringify(second.teams) !== firstSignature) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    expect(changed).toBe(true);
  });

  it('changes when the attendee set changes', () => {
    const base = findPlayers(['이종하', '강인갑', '김령곤', '고영수']);
    const first = assignTeams('2026-03-21', base);
    const second = assignTeams('2026-03-21', [...base, PLAYERS[4]]);

    expect(second.seedKey).not.toBe(first.seedKey);
    expect(flattenAssignment(second)).not.toEqual(flattenAssignment(first));
  });

  it('assigns each selected player exactly once when count is even', () => {
    const selected = findPlayers(['이종하', '강인갑', '김령곤', '고영수', '최윤호', '박명선']);
    const result = assignTeams('2026-03-21', selected);
    const assignedNames = flattenAssignment(result);

    expect(result.waitingPlayer).toBeUndefined();
    expect(assignedNames).toEqual(selected.map((player) => player.name).sort());
  });

  it('keeps exactly one waiting player when count is odd', () => {
    const selected = findPlayers(['이종하', '강인갑', '김령곤', '고영수', '최윤호']);
    const result = assignTeams('2026-03-21', selected);
    const assignedNames = flattenAssignment(result);

    expect(result.waitingPlayer).toBeDefined();
    expect(result.teams).toHaveLength(2);
    expect(assignedNames).toEqual(selected.map((player) => player.name).sort());
  });

  it('scores balanced mixed-tier teams better than extreme same-tier teams', () => {
    const players = findPlayers(['이종하', '강인갑', '고영수', '이태균']);
    const balanced = scorePairing(
      [
        [players[0], players[3]],
        [players[1], players[2]],
      ],
      players,
    );
    const extreme = scorePairing(
      [
        [players[0], players[1]],
        [players[2], players[3]],
      ],
      players,
    );

    expect(balanced.score).toBeLessThan(extreme.score);
  });

  it('creates the same seed key regardless of selection order', () => {
    const first = createSeedKey('2026-03-21', ['고영수', '김령곤', '이종하']);
    const second = createSeedKey('2026-03-21', ['이종하', '고영수', '김령곤']);

    expect(first).toBe(second);
  });

  it('generates candidates for odd player counts with waiting-player variants', () => {
    const selected = findPlayers(['이종하', '강인갑', '김령곤', '고영수', '최윤호']);
    const candidates = generateAllPairings(selected);

    expect(candidates.length).toBeGreaterThan(0);
    expect(new Set(candidates.map((candidate) => candidate.waitingPlayer?.name)).size).toBe(selected.length);
  });
});
