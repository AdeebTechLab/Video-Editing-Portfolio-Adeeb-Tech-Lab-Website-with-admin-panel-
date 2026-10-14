import { useId } from "react";

const palettes = [
  ["#ff8a48", "#ff496b"], ["#66d9ff", "#7873ff"],
  ["#ff66b0", "#a878ff"], ["#b98aff", "#5ce4ed"],
  ["#ffcd6b", "#ff6b91"], ["#58e6b1", "#50a8ff"],
  ["#ff9b59", "#ec62db"], ["#70b8ff", "#a68aff"],
  ["#7bf0d1", "#e8b1ff"],
];

export default function ServiceArtwork({ service }: { service: number }) {
  const id = useId().replace(/:/g, "");
  const [primary, secondary] = palettes[service % palettes.length];
  const vertical = service === 2;
  if (service >= 0 && service <= 8) {
    return (
      <div className="editing-service-image">
        <img src={["/images/videoediting.png", "/images/youtoube.png", "/images/shortreal.png", "/images/motiongrafic.png", "/images/colore.png", "/images/sound.png", "/images/sanimatic.png", "/images/pordcast.png", "/images/transitions.png"][service]} alt={["Video editing workspace", "YouTube and long-form video editing", "Reels and Shorts video editing", "Motion graphics editing", "Color grading and finishing", "Sound editing and synchronization", "Promotional and cinematic video editing", "Podcast editing", "Video transitions and effects"][service]} width={720} height={480} loading="lazy" />
      </div>
    );
  }
  return (
    <div className="editing-artwork" aria-hidden="true">
      <svg viewBox="0 0 440 300" fill="none" focusable="false">
        <defs>
          <linearGradient id={`${id}-color`} x1="90" y1="40" x2="350" y2="250" gradientUnits="userSpaceOnUse">
            <stop stopColor={primary} /><stop offset="1" stopColor={secondary} />
          </linearGradient>
          <radialGradient id={`${id}-halo`}><stop stopColor={primary} stopOpacity=".22" /><stop offset="1" stopColor={primary} stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx="220" cy="140" rx="220" ry="140" fill={`url(#${id}-halo)`} />
        <circle cx="220" cy="136" r="113" stroke={primary} strokeOpacity=".15" strokeDasharray="4 8" />
        <path d="M25 88h36m-18-18v36M363 191h24m-12-12v24" stroke={secondary} strokeOpacity=".65" strokeWidth="2" />
        <g className="artwork-float">
          <rect x="65" y="52" width="280" height="176" rx="15" fill="#111722" stroke={primary} strokeOpacity=".35" transform="rotate(-6 205 140)" />
          <rect x={vertical ? 148 : 85} y="42" width={vertical ? 136 : 270} height="170" rx="13" fill="#141a27" stroke="#ffffff25" />
          <path d={vertical ? "M160 179 190 119 219 155 244 101 272 179Z" : "M97 179 151 108 204 156 260 83 343 179Z"} fill={`url(#${id}-color)`} opacity=".85" />
          <circle cx={vertical ? 238 : 295} cy="80" r="19" fill={primary} opacity=".9" />
          <path d={vertical ? "M160 188h111" : "M98 188h244"} stroke="#ffffff25" />
          <rect x="101" y="56" width="43" height="6" rx="3" fill="#ffffff55" />
          <circle cx="218" cy="128" r="25" fill="#0b1028" fillOpacity=".65" stroke="#ffffff70" />
          <path d="m212 117 17 11-17 11v-22Z" fill="white" />
        </g>
        <g>
          <rect x="40" y="204" width="360" height="77" rx="12" fill="#101521" stroke="#ffffff20" />
          <path d="M57 217h325" stroke="#ffffff15" />
          {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${61 + i * 24} 212v6`} stroke="#ffffff40" />)}
          <rect x="59" y="229" width="92" height="16" rx="4" fill={primary} fillOpacity=".8" />
          <rect x="157" y="229" width="127" height="16" rx="4" fill={secondary} fillOpacity=".75" />
          <rect x="290" y="229" width="90" height="16" rx="4" fill={primary} fillOpacity=".5" />
          {Array.from({ length: 48 }, (_, i) => {
            const height = 4 + Math.abs(Math.sin(i * 1.7)) * 10;
            return <path key={i} d={`M${62 + i * 6.7} ${261 - height / 2}v${height}`} stroke="#63e7bd" strokeWidth="2" strokeLinecap="round" />;
          })}
          <g className="artwork-playhead"><path d="M220 213v59" stroke="white" strokeWidth="1.5" /><path d="m215 211 5 6 5-6" fill="white" /></g>
        </g>
        <g className="artwork-badge">
          <rect x="316" y="106" width="93" height="65" rx="12" fill="#171e2e" stroke={secondary} strokeOpacity=".5" />
          {service === 4 ? <><circle cx="345" cy="138" r="16" stroke={primary} strokeWidth="5" /><circle cx="365" cy="138" r="16" stroke={secondary} strokeWidth="5" /><circle cx="355" cy="125" r="16" stroke="#63e7bd" strokeWidth="5" /></> : service === 5 || service === 7 ?
            [10, 23, 36, 19, 30, 13].map((h, i) => <rect key={i} x={332 + i * 11} y={138 - h / 2} width="5" height={h} rx="2.5" fill={i % 2 ? primary : secondary} />) :
            <><rect x="333" y="121" width="40" height="25" rx="5" stroke={primary} strokeWidth="2" /><rect x="348" y="132" width="40" height="25" rx="5" fill="#171e2e" stroke={secondary} strokeWidth="2" /></>}
        </g>
        <path d="m59 148 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" fill={primary} />
        <circle cx="373" cy="52" r="4" fill={secondary} />
      </svg>
    </div>
  );
}
