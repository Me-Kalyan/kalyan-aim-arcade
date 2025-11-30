"use client";

type Difficulty = "easy" | "medium" | "hard";

const labels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function DifficultyToggle({
  value,
  onChange,
}: {
  value: Difficulty;
  onChange: (v: Difficulty) => void;
}) {
  return (
    <div className="inline-flex rounded-full bg-surface-subtle dark:bg-[#1A1A24] p-1 text-xs">
      {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
        const active = value === d;
        return (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
            className={[
              "px-3 py-1 rounded-full transition text-xs font-medium",
              active
                ? "bg-gradient-to-tr from-brand-pink-500 to-brand-pink-400 text-white shadow-sm"
                : "text-ink-soft dark:text-[#8E8E9E] hover:bg-surface-subtle dark:hover:bg-[#1A1A24]",
            ].join(" ")}
          >
            {labels[d]}
          </button>
        );
      })}
    </div>
  );
}

