import type { Team } from '../types';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <article className="rounded-[24px] border border-line bg-panelElevated/80 p-5 shadow-glow">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-accent/75">Team</p>
          <h3 className="mt-2 text-lg font-semibold text-ink">{team.teamLabel}</h3>
        </div>
        <p className="font-mono text-xs text-muted">합산 {team.ratingTotal.toFixed(1)}</p>
      </div>
      <div className="mt-6 space-y-3">
        {team.members.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-base font-medium text-ink"
          >
            {member.name}
          </div>
        ))}
      </div>
    </article>
  );
}
