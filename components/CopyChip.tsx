"use client";

import { useToast } from "@/lib/toast";

export function CopyChip({ text }: { text: string }) {
  const { toast } = useToast();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: text,
        variant: "success",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Clipboard is not available in this environment.",
        variant: "error",
      });
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-auto inline-flex items-center rounded-pill border border-surface-border bg-surface-card px-2.5 py-1 text-[11px] text-ink-soft hover:bg-surface-subtle"
    >
      Copy
    </button>
  );
}

