import * as React from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  rightSlot,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[1.5rem] font-semibold tracking-tight text-ink-primary dark:text-[#F5F5F5]">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-sm text-ink-soft dark:text-[#8E8E9E]">{description}</p>
        )}
      </div>
      {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
    </div>
  );
}

