import type { RecordDraft } from '../lib/records';

interface RecordFormProps {
  draft: RecordDraft;
  playerOptions: string[];
  onChange: (draft: RecordDraft) => void;
  onSave: () => void;
  disabled: boolean;
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-[0.22em] text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-line bg-[#0d1110] px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/40"
      >
        <option value="">선수 선택</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function RecordForm({ draft, playerOptions, onChange, onSave, disabled }: RecordFormProps) {
  return (
    <div className="space-y-4 rounded-[24px] border border-line bg-panelElevated/70 p-5">
      <div>
        <label htmlFor="record-date" className="text-xs uppercase tracking-[0.22em] text-muted">
          날짜
        </label>
        <input
          id="record-date"
          type="date"
          value={draft.date}
          onChange={(event) => onChange({ ...draft, date: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-line bg-[#0d1110] px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-[22px] border border-line bg-black/15 p-4">
          <p className="text-sm font-medium text-ink">A팀</p>
          <SelectField
            id="record-team-a-1"
            label="선수 1"
            value={draft.teamA[0]}
            options={playerOptions}
            onChange={(value) => onChange({ ...draft, teamA: [value, draft.teamA[1]] })}
          />
          <SelectField
            id="record-team-a-2"
            label="선수 2"
            value={draft.teamA[1]}
            options={playerOptions}
            onChange={(value) => onChange({ ...draft, teamA: [draft.teamA[0], value] })}
          />
        </div>

        <div className="space-y-4 rounded-[22px] border border-line bg-black/15 p-4">
          <p className="text-sm font-medium text-ink">B팀</p>
          <SelectField
            id="record-team-b-1"
            label="선수 1"
            value={draft.teamB[0]}
            options={playerOptions}
            onChange={(value) => onChange({ ...draft, teamB: [value, draft.teamB[1]] })}
          />
          <SelectField
            id="record-team-b-2"
            label="선수 2"
            value={draft.teamB[1]}
            options={playerOptions}
            onChange={(value) => onChange({ ...draft, teamB: [draft.teamB[0], value] })}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.7fr_1fr]">
        <div>
          <label htmlFor="record-winner" className="text-xs uppercase tracking-[0.22em] text-muted">
            승리 팀
          </label>
          <select
            id="record-winner"
            value={draft.winner}
            onChange={(event) => onChange({ ...draft, winner: event.target.value as 'A' | 'B' })}
            className="mt-2 w-full rounded-2xl border border-line bg-[#0d1110] px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/40"
          >
            <option value="A">A팀 승</option>
            <option value="B">B팀 승</option>
          </select>
        </div>

        <div>
          <label htmlFor="record-note" className="text-xs uppercase tracking-[0.22em] text-muted">
            메모
          </label>
          <input
            id="record-note"
            type="text"
            value={draft.note}
            onChange={(event) => onChange({ ...draft, note: event.target.value })}
            placeholder="예: 6-4, 6-3"
            className="mt-2 w-full rounded-2xl border border-line bg-[#0d1110] px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/40"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={disabled}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#0b0f09] transition hover:bg-accentStrong focus:outline-none focus:ring-2 focus:ring-accent/60 disabled:cursor-not-allowed disabled:bg-accent/35"
      >
        기록 저장
      </button>
    </div>
  );
}
