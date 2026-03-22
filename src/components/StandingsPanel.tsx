import type { MatchRecord, PairStanding, PlayerStanding } from '../types';

interface StandingsPanelProps {
  playerStandings: PlayerStanding[];
  pairStandings: PairStanding[];
  records: MatchRecord[];
  onDeleteRecord: (recordId: string) => void;
}

function renderSetSummary(record: MatchRecord) {
  if (!record.sets?.length) {
    return null;
  }

  return record.sets.map((set) => `${set.teamAGames}-${set.teamBGames}`).join(' / ');
}

export function StandingsPanel({
  playerStandings,
  pairStandings,
  records,
  onDeleteRecord,
}: StandingsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[24px] border border-line bg-panelElevated/70 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent/80">Singles Ledger</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">개인 전적</h3>
          </div>

          {playerStandings.length ? (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-muted">
                  <tr className="border-b border-line">
                    <th className="px-3 py-3">순위</th>
                    <th className="px-3 py-3">이름</th>
                    <th className="px-3 py-3">승</th>
                    <th className="px-3 py-3">패</th>
                    <th className="px-3 py-3">승률</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStandings.map((row, index) => (
                    <tr key={row.playerName} className="border-b border-white/5 text-ink last:border-b-0">
                      <td className="px-3 py-3">{index + 1}</td>
                      <td className="px-3 py-3">{row.playerName}</td>
                      <td className="px-3 py-3">{row.wins}</td>
                      <td className="px-3 py-3">{row.losses}</td>
                      <td className="px-3 py-3">{(row.winRate * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-5 rounded-[20px] border border-dashed border-line bg-[#0d100f]/80 px-5 py-8 text-sm text-muted">
              아직 저장된 경기 기록이 없습니다.
            </div>
          )}
        </section>

        <section className="rounded-[24px] border border-line bg-panelElevated/70 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent/80">Doubles Ledger</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">조합 전적</h3>
          </div>

          {pairStandings.length ? (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-muted">
                  <tr className="border-b border-line">
                    <th className="px-3 py-3">순위</th>
                    <th className="px-3 py-3">조합</th>
                    <th className="px-3 py-3">승</th>
                    <th className="px-3 py-3">패</th>
                    <th className="px-3 py-3">승률</th>
                  </tr>
                </thead>
                <tbody>
                  {pairStandings.map((row, index) => (
                    <tr key={row.pairKey} className="border-b border-white/5 text-ink last:border-b-0">
                      <td className="px-3 py-3">{index + 1}</td>
                      <td className="px-3 py-3">{row.players.join(' / ')}</td>
                      <td className="px-3 py-3">{row.wins}</td>
                      <td className="px-3 py-3">{row.losses}</td>
                      <td className="px-3 py-3">{(row.winRate * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-5 rounded-[20px] border border-dashed border-line bg-[#0d100f]/80 px-5 py-8 text-sm text-muted">
              아직 저장된 조합 전적이 없습니다.
            </div>
          )}
        </section>
      </div>

      <section className="rounded-[24px] border border-line bg-panelElevated/70 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent/80">History</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">저장된 기록</h3>
          </div>
          <p className="text-sm text-muted">총 {records.length}경기</p>
        </div>

        <div className="mt-5 space-y-3">
          {records.length ? (
            records.map((record) => (
              <article
                key={record.id}
                className="flex flex-col gap-3 rounded-[20px] border border-line bg-black/15 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm text-muted">{record.date}</p>
                  <p className="mt-1 text-sm text-ink">
                    {record.teamA.join(' / ')} vs {record.teamB.join(' / ')}
                  </p>
                  <p className="mt-1 text-xs text-accent/85">
                    승리: {record.winner === 'A' ? record.teamA.join(' / ') : record.teamB.join(' / ')}
                  </p>
                  {renderSetSummary(record) ? (
                    <p className="mt-1 text-xs text-muted">세트: {renderSetSummary(record)}</p>
                  ) : null}
                  {record.note ? <p className="mt-1 text-xs text-muted">{record.note}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteRecord(record.id)}
                  className="rounded-full border border-line px-3 py-2 text-xs text-muted transition hover:border-accent/40 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  삭제
                </button>
              </article>
            ))
          ) : (
            <div className="rounded-[20px] border border-dashed border-line bg-[#0d100f]/80 px-5 py-8 text-sm text-muted">
              저장된 기록이 아직 없습니다.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
