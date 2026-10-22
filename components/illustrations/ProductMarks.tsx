export function BiscuitMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden>
      <circle cx="40" cy="40" r="28" fill="#c99708" />
      <circle cx="40" cy="40" r="22" fill="#e8c15a" />
      {[
        [50, 40],
        [45, 49],
        [35, 49],
        [30, 40],
        [35, 31],
        [45, 31],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="#8a5a42" />
      ))}
    </svg>
  );
}

export function SnackMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden>
      <rect x="14" y="22" width="52" height="36" rx="12" fill="#2f8f82" />
      <rect x="20" y="28" width="40" height="10" rx="4" fill="#f6f0e4" />
      <path d="M20 48h40" stroke="#210b1f" strokeWidth="1" />
    </svg>
  );
}

export function MixerMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden>
      <rect x="28" y="10" width="24" height="12" fill="#3b1238" />
      <rect x="18" y="22" width="44" height="40" rx="8" fill="#5b3426" />
      <circle cx="40" cy="42" r="10" fill="#f2c014" />
    </svg>
  );
}
