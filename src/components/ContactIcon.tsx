export default function ContactIcon({ kind }: { kind: "email" | "location" | "whatsapp" | "website" }) {
  return (
    <span className={`contact-icon contact-icon--${kind}`} aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none" focusable="false">
        {kind === "email" && <>
          <rect x="4" y="7" width="24" height="18" rx="4" fill="#fff1d5" />
          <path d="m5 10 11 8 11-8" stroke="#ed5d57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m5 23 7-7m15 7-7-7" stroke="#f5ac63" strokeWidth="2" strokeLinecap="round" />
        </>}
        {kind === "location" && <>
          <ellipse cx="16" cy="27" rx="8" ry="2" fill="#ffba7b" opacity=".5" />
          <path d="M16 3a9 9 0 0 0-9 9c0 7 9 14 9 14s9-7 9-14a9 9 0 0 0-9-9Z" fill="#ff765b" />
          <circle cx="16" cy="12" r="4" fill="#fff1d5" />
        </>}
        {kind === "whatsapp" && <>
          <path d="M27 15.5a11 11 0 0 1-16.5 9.6L5 27l1.8-5.6A11 11 0 1 1 27 15.5Z" fill="#38e58a" stroke="#dcffe9" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="m12 9-2 2c-.4 4 6 10 10 10l2-2-4-3-1.5 1.5-3-3L15 13l-3-4Z" fill="white" stroke="white" strokeLinejoin="round" />
        </>}
        {kind === "website" && <>
          <circle cx="16" cy="16" r="12" fill="#59c9ff" />
          <ellipse cx="16" cy="16" rx="5" ry="12" stroke="#e9faff" strokeWidth="1.8" />
          <path d="M4 16h24M7 9h18M7 23h18" stroke="#e9faff" strokeWidth="1.8" />
          <path d="m21 20 7 3-3 1-1 4-3-8Z" fill="#ffe4a6" stroke="#17344b" strokeWidth="1" strokeLinejoin="round" />
        </>}
      </svg>
    </span>
  );
}
