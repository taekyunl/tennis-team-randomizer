import type { Player } from '../types';

const collator = new Intl.Collator('ko');

export function normalizeSelectedNames(selectedNames: string[]): string[] {
  return [...new Set(selectedNames)].sort((left, right) => collator.compare(left, right));
}

export function createSeedKey(date: string, selectedNames: string[]): string {
  const normalized = normalizeSelectedNames(selectedNames);
  return `${date}__${normalized.join('__')}`;
}

export function getPlayerSeedToken(player: Player): string {
  return player.seedLabel ?? player.name;
}

function xmur3(seed: string) {
  let hash = 1779033703 ^ seed.length;

  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return function createHash() {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
}

function mulberry32(seed: number) {
  return function generateRandom() {
    let next = (seed += 0x6d2b79f5);
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRng(seedKey: string): () => number {
  const hash = xmur3(seedKey);
  return mulberry32(hash());
}
