import type { Player } from '../types';

interface PlayerCheckboxProps {
  player: Player;
  checked: boolean;
  onToggle: (playerId: string) => void;
}

const tierLabel = {
  A: '상',
  B: '중',
  C: '하',
} as const;

export function PlayerCheckbox({ player, checked, onToggle }: PlayerCheckboxProps) {
  return (
    <label
      htmlFor={player.id}
      className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-panelElevated/70 px-4 py-3 transition hover:border-accent/35 hover:bg-panelElevated"
    >
      <div className="flex items-center gap-3">
        <input
          id={player.id}
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(player.id)}
          className="h-4 w-4 rounded border-accentDeep bg-canvas text-accent focus:ring-2 focus:ring-accent/60 focus:ring-offset-0"
        />
        <div>
          <p className="text-sm font-medium text-ink">{player.name}</p>
          <p className="text-xs text-muted">rating {player.rating.toFixed(1)}</p>
        </div>
      </div>
      <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accentStrong">
        {tierLabel[player.tier]} 티어
      </span>
    </label>
  );
}
