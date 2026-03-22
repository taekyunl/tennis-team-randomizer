interface SeedInfoProps {
  seedKey: string;
}

export function SeedInfo({ seedKey }: SeedInfoProps) {
  const [seedDate, ...seedRest] = seedKey.split('__');

  return (
    <div className="rounded-[24px] border border-line bg-[#0d100f] p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-accent/80">Current Seed</p>
      <p className="mt-3 font-mono text-sm text-ink">Seed: {seedDate}</p>
      <p className="mt-2 break-all font-mono text-sm leading-6 text-muted">{seedRest.join(' | ')}</p>
    </div>
  );
}
