import { PLAYERS } from '../data/players';
import type { GuestDraft } from '../lib/guest';

const sortedPlayers = [...PLAYERS].sort((left, right) => left.name.localeCompare(right.name, 'ko'));

interface GuestFormProps {
  guest: GuestDraft;
  onChange: (guestId: string, field: keyof Omit<GuestDraft, 'id'>, value: string) => void;
  onRemove: (guestId: string) => void;
}

export function GuestForm({ guest, onChange, onRemove }: GuestFormProps) {
  return (
    <div className="rounded-[24px] border border-line bg-panelElevated/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink">게스트</p>
        <button
          type="button"
          onClick={() => onRemove(guest.id)}
          className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-accent/40 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          삭제
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[0.95fr_1fr_1fr]">
        <div>
          <label htmlFor={`${guest.id}-name`} className="text-xs uppercase tracking-[0.22em] text-muted">
            이름
          </label>
          <input
            id={`${guest.id}-name`}
            type="text"
            value={guest.name}
            onChange={(event) => onChange(guest.id, 'name', event.target.value)}
            placeholder="예: 홍길동"
            className="mt-2 w-full rounded-2xl border border-line bg-[#0d1110] px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/40"
          />
        </div>

        <div>
          <label htmlFor={`${guest.id}-stronger`} className="text-xs uppercase tracking-[0.22em] text-muted">
            이 사람보단 약하고
          </label>
          <select
            id={`${guest.id}-stronger`}
            value={guest.strongerPlayerId}
            onChange={(event) => onChange(guest.id, 'strongerPlayerId', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-[#0d1110] px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/40"
          >
            {sortedPlayers.map((player) => (
              <option key={player.id} value={player.name}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${guest.id}-weaker`} className="text-xs uppercase tracking-[0.22em] text-muted">
            이 사람보단 강한 편
          </label>
          <select
            id={`${guest.id}-weaker`}
            value={guest.weakerPlayerId}
            onChange={(event) => onChange(guest.id, 'weakerPlayerId', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-[#0d1110] px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/40"
          >
            {sortedPlayers.map((player) => (
              <option key={player.id} value={player.name}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
