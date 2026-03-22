interface SeedInfoProps {
  seedKey: string;
}

export function SeedInfo({ seedKey }: SeedInfoProps) {
  return (
    <div className="rounded-[24px] border border-line bg-[#0d100f] p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-accent/80">현재 시드</p>
      <p className="mt-3 break-all font-mono text-sm leading-6 text-muted">{seedKey.split('__').join(' | ')}</p>
    </div>
  );
}
