import type { Player } from '../types';

interface PlayerCheckboxProps {
  player: Player;
  checked: boolean;
  onToggle: (playerId: string) => void;
}

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
          <p className="text-xs text-muted">참석 여부를 선택하세요</p>
        </div>
      </div>
      <span
        className={`h-2.5 w-2.5 rounded-full transition ${
          checked ? 'bg-accent shadow-[0_0_18px_rgba(207,233,109,0.55)]' : 'bg-white/12'
        }`}
      />
    </label>
  );
}
