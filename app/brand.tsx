// Identità visiva ComplyAI (D20): logomark + set di icone dei moduli.
// Tutto SVG inline: zero dipendenze, nitido a ogni densità, temabile
// (le icone usano currentColor; il logo ha il gradiente del marchio).

/** Scudo con spunta — il marchio. Stesso disegno della favicon (app/icon.svg). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="cai-brand-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <path
        d="M32 5l23 8.4V30c0 14.8-9.8 24.6-23 29C18.8 54.6 9 44.8 9 30V13.4L32 5z"
        fill="url(#cai-brand-g)"
      />
      <path
        d="M21.5 31.5l7.5 7.5 14-14"
        fill="none"
        stroke="#fff"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Icone dei sei moduli — stile coerente: stroke 1.7, angoli arrotondati, 24px. */
const ICON_PATHS: Record<string, React.ReactNode> = {
  checker: (
    <>
      <path d="M12 3l7 2.5V12c0 4.4-2.9 7.4-7 9-4.1-1.6-7-4.6-7-9V5.5L12 3z" />
      <path d="M8.8 11.9l2.3 2.3 4.3-4.4" />
    </>
  ),
  watcher: (
    <>
      <circle cx="6.5" cy="17.5" r="1.4" fill="currentColor" stroke="none" />
      <path d="M5 11.5a7.5 7.5 0 017.5 7.5" />
      <path d="M5 6a13 13 0 0113 13" />
    </>
  ),
  mapper: (
    <>
      <rect x="3" y="8.5" width="6" height="7" rx="1.5" />
      <rect x="15" y="3.5" width="6" height="5.5" rx="1.5" />
      <rect x="15" y="15" width="6" height="5.5" rx="1.5" />
      <path d="M9 12h2.5a2 2 0 002-2V7.5H15" />
      <path d="M9 12h2.5a2 2 0 012 2v3.5H15" />
    </>
  ),
  audit: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="2" />
      <path d="M8.5 8h7" />
      <path d="M8.5 12h7" />
      <path d="M8.5 16.5l1.7 1.7 3.3-3.4" />
    </>
  ),
  contracts: (
    <>
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
      <path d="M14 3v5h5" />
      <circle cx="11" cy="13.5" r="2.4" />
      <path d="M12.8 15.3l2.4 2.4" />
    </>
  ),
  deadlines: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M12 12.5v3l2 1.2" />
    </>
  ),
};

export function ModuleIcon({ id, className }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {ICON_PATHS[id] ?? ICON_PATHS.checker}
    </svg>
  );
}
