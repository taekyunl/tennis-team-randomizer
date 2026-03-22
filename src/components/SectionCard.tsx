import type { PropsWithChildren, ReactNode } from 'react';

interface SectionCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionCard({ title, description, action, children }: SectionCardProps) {
  return (
    <section className="rounded-[28px] border border-line bg-panel/90 p-5 shadow-card backdrop-blur sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent/80">Section</p>
          <h2 className="mt-2 text-xl font-semibold text-ink">{title}</h2>
          {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
