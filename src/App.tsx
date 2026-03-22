import { useEffect, useMemo, useState } from 'react';
import { PLAYERS } from './data/players';
import { GuestForm } from './components/GuestForm';
import { RecordForm } from './components/RecordForm';
import { StandingsPanel } from './components/StandingsPanel';
import { assignTeams } from './lib/pairing';
import { createEmptyGuestDraft, createGuestPlayer, type GuestDraft } from './lib/guest';
import {
  canSaveRecord,
  computePairStandings,
  computeStandings,
  createEmptyRecordDraft,
  createMatchRecord,
  type RecordDraft,
} from './lib/records';
import { createSeedKey, getPlayerSeedToken } from './lib/seed';
import type { AssignmentResult, MatchRecord } from './types';
import { PlayerCheckbox } from './components/PlayerCheckbox';
import { SectionCard } from './components/SectionCard';
import { SeedInfo } from './components/SeedInfo';
import { TeamCard } from './components/TeamCard';

const STORAGE_KEY = 'tennis-team-randomizer:state';
type AppTab = 'assignment' | 'records';

interface StoredState {
  date: string;
  selectedIds: string[];
  guests: GuestDraft[];
  records: MatchRecord[];
}

function getTodayDate() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}

function loadInitialState(): StoredState {
  const today = getTodayDate();
  const fallback = { date: today, selectedIds: PLAYERS.map((player) => player.id), guests: [], records: [] };

  const params = new URLSearchParams(window.location.search);
  const queryDate = params.get('date');
  const queryPlayers = params.get('players');

  if (queryDate || queryPlayers) {
    return {
      date: queryDate ?? today,
      selectedIds: queryPlayers ? queryPlayers.split(',').filter(Boolean) : fallback.selectedIds,
      guests: [],
      records: [],
    };
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(saved) as StoredState;
    return {
      date: parsed.date || today,
      selectedIds: parsed.selectedIds?.length ? parsed.selectedIds : fallback.selectedIds,
      guests: Array.isArray(parsed.guests) ? parsed.guests : [],
      records: Array.isArray(parsed.records) ? parsed.records : [],
    };
  } catch {
    return fallback;
  }
}

function formatCopyText(result: AssignmentResult) {
  const lines = [`날짜: ${result.seedKey.split('__')[0]}`];

  for (const team of result.teams) {
    lines.push(`${team.teamLabel}: ${team.members[0].name} - ${team.members[1].name}`);
  }

  if (result.waitingPlayer) {
    lines.push(`대기: ${result.waitingPlayer.name}`);
  }

  return lines.join('\n');
}

export default function App() {
  const initialState = useMemo(loadInitialState, []);
  const [date, setDate] = useState(initialState.date);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialState.selectedIds);
  const [guestDrafts, setGuestDrafts] = useState<GuestDraft[]>(initialState.guests);
  const [records, setRecords] = useState<MatchRecord[]>(initialState.records);
  const [activeTab, setActiveTab] = useState<AppTab>('assignment');
  const [result, setResult] = useState<AssignmentResult | null>(null);
  const [recordDraft, setRecordDraft] = useState<RecordDraft>(createEmptyRecordDraft(initialState.date));
  const [copyLabel, setCopyLabel] = useState('결과 복사');

  const baseSelectedPlayers = useMemo(
    () => PLAYERS.filter((player) => selectedIds.includes(player.id)),
    [selectedIds],
  );

  const guestPlayers = useMemo(
    () => guestDrafts.map((guest) => createGuestPlayer(guest)).filter((guest): guest is NonNullable<typeof guest> => Boolean(guest)),
    [guestDrafts],
  );

  const selectedPlayers = useMemo(() => [...baseSelectedPlayers, ...guestPlayers], [baseSelectedPlayers, guestPlayers]);
  const availablePlayerNames = useMemo(
    () => selectedPlayers.map((player) => player.name).sort((left, right) => left.localeCompare(right, 'ko')),
    [selectedPlayers],
  );
  const standings = useMemo(() => computeStandings(records), [records]);
  const pairStandings = useMemo(() => computePairStandings(records), [records]);

  const previewSeed = useMemo(
    () => createSeedKey(date, selectedPlayers.map((player) => getPlayerSeedToken(player))),
    [date, selectedPlayers],
  );

  useEffect(() => {
    const state = { date, selectedIds, guests: guestDrafts, records };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    const params = new URLSearchParams();
    params.set('date', date);
    if (selectedIds.length) {
      params.set('players', selectedIds.join(','));
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    setResult(null);
  }, [date, selectedIds, guestDrafts, records]);

  useEffect(() => {
    setRecordDraft((current) => ({ ...current, date }));
  }, [date]);

  useEffect(() => {
    if (selectedPlayers.length >= 2) {
      setResult(assignTeams(date, selectedPlayers));
    }
  }, []);

  function togglePlayer(playerId: string) {
    setSelectedIds((current) =>
      current.includes(playerId) ? current.filter((id) => id !== playerId) : [...current, playerId],
    );
  }

  function handleGuestChange(guestId: string, field: keyof Omit<GuestDraft, 'id'>, value: string) {
    setGuestDrafts((current) =>
      current.map((guest) => (guest.id === guestId ? { ...guest, [field]: value } : guest)),
    );
  }

  function handleAddGuest() {
    setGuestDrafts((current) => [...current, createEmptyGuestDraft()]);
  }

  function handleRemoveGuest(guestId: string) {
    setGuestDrafts((current) => current.filter((guest) => guest.id !== guestId));
  }

  function handleSaveRecord() {
    if (!canSaveRecord(recordDraft)) {
      return;
    }

    const record = createMatchRecord(recordDraft);
    setRecords((current) => [record, ...current]);
    setRecordDraft(createEmptyRecordDraft(date));
  }

  function handleDeleteRecord(recordId: string) {
    setRecords((current) => current.filter((record) => record.id !== recordId));
  }

  function useAssignmentForRecord(teamIndexA: number, teamIndexB: number) {
    if (!result) {
      return;
    }

    const teamA = result.teams[teamIndexA];
    const teamB = result.teams[teamIndexB];

    if (!teamA || !teamB) {
      return;
    }

    setActiveTab('records');
    setRecordDraft({
      date,
      teamA: [teamA.members[0].name, teamA.members[1].name],
      teamB: [teamB.members[0].name, teamB.members[1].name],
      winner: 'A',
      note: '',
    });
  }

  function handleAssignTeams() {
    if (selectedPlayers.length < 2) {
      setResult(null);
      return;
    }

    setResult(assignTeams(date, selectedPlayers));
  }

  async function handleCopyResult() {
    if (!result) {
      return;
    }

    await navigator.clipboard.writeText(formatCopyText(result));
    setCopyLabel('복사 완료');
    window.setTimeout(() => setCopyLabel('결과 복사'), 1600);
  }

  return (
    <div className="min-h-screen bg-canvas bg-texture text-ink">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 lg:px-10">
        <header className="relative overflow-hidden rounded-[32px] border border-line bg-[#0f1312]/90 px-6 py-8 shadow-glow sm:px-8 sm:py-10">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,rgba(207,233,109,0.16),transparent_62%)] lg:block" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          <p className="text-xs uppercase tracking-[0.34em] text-accent/80">AUSTIN FRIDAY TENNIS</p>
          <div className="mt-6 max-w-5xl">
            <p className="font-display text-[3.1rem] font-semibold uppercase leading-[0.9] tracking-[0.12em] text-[#f4f1e8] sm:text-[4.8rem] lg:text-[6.4rem]">
              Austin
            </p>
            <p className="mt-1 font-display text-[3.1rem] font-semibold uppercase leading-[0.9] tracking-[0.22em] text-[#d7d2c3] sm:text-[4.8rem] lg:text-[6.4rem]">
              Friday Tennis
            </p>
          </div>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.32em] text-white/38">
            Seeded doubles assignment, records, rankings
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            날짜와 참석자 조합을 기준으로, 같은 조건이면 항상 같은 결과가 나오는 복식 파트너
            배정기입니다.
          </p>

          <div className="mt-8 inline-flex rounded-full border border-line bg-black/20 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('assignment')}
              className={`rounded-full px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                activeTab === 'assignment' ? 'bg-accent text-[#0b0f09]' : 'text-muted hover:text-ink'
              }`}
            >
              팀 배정
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('records')}
              className={`rounded-full px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                activeTab === 'records' ? 'bg-accent text-[#0b0f09]' : 'text-muted hover:text-ink'
              }`}
            >
              기록
            </button>
          </div>
        </header>

        {activeTab === 'assignment' ? (
          <main className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <SectionCard
                title="Seed"
                description="Seed는 날짜로 고릅니다. 같은 날짜 + 같은 참석자면 항상 같은 결과가 나옵니다."
                action={
                  <button
                    type="button"
                    onClick={() => setDate(getTodayDate())}
                    className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    오늘 날짜로
                  </button>
                }
              >
                <label htmlFor="assignment-date" className="block text-sm font-medium text-ink">
                  Seed : 날짜
                </label>
                <input
                  id="assignment-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-line bg-[#0d1110] px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/40"
                />
              </SectionCard>

              <SectionCard
                title="참석자 선택"
                description={`선택된 인원 ${selectedPlayers.length}명`}
                action={
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedIds(PLAYERS.map((player) => player.id))}
                      className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      전체 선택
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedIds([])}
                      className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      전체 해제
                    </button>
                  </div>
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {PLAYERS.map((player) => (
                    <PlayerCheckbox
                      key={player.id}
                      player={player}
                      checked={selectedIds.includes(player.id)}
                      onToggle={togglePlayer}
                    />
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="게스트 입력"
                description="그날만 참석하는 게스트가 있으면 추가하세요. 실력 기준은 가나다순 선수 목록에서 고릅니다."
                action={
                  <button
                    type="button"
                    onClick={handleAddGuest}
                    className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#0b0f09] transition hover:bg-accentStrong focus:outline-none focus:ring-2 focus:ring-accent/60"
                  >
                    게스트 추가
                  </button>
                }
              >
                <div className="space-y-3">
                  {guestDrafts.length ? (
                    guestDrafts.map((guest) => (
                      <GuestForm
                        key={guest.id}
                        guest={guest}
                        onChange={handleGuestChange}
                        onRemove={handleRemoveGuest}
                      />
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-line bg-[#0d100f]/80 px-5 py-8 text-sm text-muted">
                      아직 추가된 게스트가 없습니다.
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>

            <div className="space-y-6">
              <SectionCard
                title="배정 결과"
                description={
                  selectedPlayers.length < 2
                    ? '최소 2명 이상 선택해 주세요.'
                    : '결과는 seed 기반으로 고정되며, 홀수 인원은 1명이 대기합니다.'
                }
                action={
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAssignTeams}
                      disabled={selectedPlayers.length < 2}
                      className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#0b0f09] transition hover:bg-accentStrong focus:outline-none focus:ring-2 focus:ring-accent/60 disabled:cursor-not-allowed disabled:bg-accent/35"
                    >
                      팀 배정하기
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyResult}
                      disabled={!result}
                      className="rounded-full border border-line px-4 py-2.5 text-sm text-muted transition hover:border-accent/40 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {copyLabel}
                    </button>
                  </div>
                }
              >
                {result ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {result.teams.map((team) => (
                        <TeamCard key={team.teamLabel} team={team} />
                      ))}
                    </div>

                    {result.teams.length >= 2 ? (
                      <button
                        type="button"
                        onClick={() => useAssignmentForRecord(0, 1)}
                        className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/50"
                      >
                        1조 vs 2조 기록으로 가져가기
                      </button>
                    ) : null}

                    {result.waitingPlayer ? (
                      <div className="rounded-[24px] border border-dashed border-accent/25 bg-accent/5 p-5">
                        <p className="text-xs uppercase tracking-[0.24em] text-accent/75">Waiting</p>
                        <h3 className="mt-2 text-lg font-semibold text-ink">대기</h3>
                        <p className="mt-4 text-base font-medium text-ink">{result.waitingPlayer.name}</p>
                        <p className="mt-2 text-sm text-muted">홀수 인원이라 1명은 대기입니다.</p>
                      </div>
                    ) : null}

                    <div className="grid gap-3 rounded-[24px] border border-line bg-[#0d100f] p-4 text-sm text-muted sm:grid-cols-2">
                      <p>후보군 수: {result.fairnessMeta.eligibleCandidateCount}</p>
                      <p>공정성 점수: {result.fairnessMeta.score}</p>
                      <p>팀 합산 표준편차: {result.fairnessMeta.standardDeviation}</p>
                      <p>최대 편차 범위: {result.fairnessMeta.range}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-line bg-[#0d100f]/80 px-5 py-10 text-center text-sm text-muted">
                    최소 2명 이상 선택해 주세요.
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Seed 정보" description="날짜 seed와 참석자 집합만으로 결과가 결정됩니다.">
                <SeedInfo seedKey={previewSeed} />
              </SectionCard>
            </div>
          </main>
        ) : (
          <main className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionCard
              title="기록 입력"
              description="경기 결과를 저장하면 아래 순위표에 즉시 반영됩니다."
            >
              <RecordForm
                draft={recordDraft}
                playerOptions={availablePlayerNames}
                onChange={setRecordDraft}
                onSave={handleSaveRecord}
                disabled={!canSaveRecord(recordDraft)}
              />
            </SectionCard>

            <StandingsPanel
              playerStandings={standings}
              pairStandings={pairStandings}
              records={records}
              onDeleteRecord={handleDeleteRecord}
            />
          </main>
        )}
      </div>
    </div>
  );
}
