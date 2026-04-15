export function Asterism({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-10 ${className}`} aria-hidden>
      <span className="h-px w-20 bg-rule" />
      <span className="font-display text-lg tracking-[0.5em] text-muted-foreground select-none">
        ✽
      </span>
      <span className="h-px w-20 bg-rule" />
    </div>
  );
}

export function Asterisk({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block font-display text-muted-foreground ${className}`}
      aria-hidden
    >
      ✽
    </span>
  );
}
