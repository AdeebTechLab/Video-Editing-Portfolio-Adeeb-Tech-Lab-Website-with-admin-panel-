import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { SAMPLE_FILMS as films } from '../config/site'

const INSPECTOR = [
  { label: 'Sequence', value: 58 },
  { label: 'Color', value: 67 },
  { label: 'Sound', value: 76 },
  { label: 'Motion', value: 85 },
]

/** An editor window that plays through an original sequence, as an artistic look at the editing process. */
export default function Timeline() {
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(12)
  const [seen, setSeen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  // Start playing the first time the editor scrolls into view (unless the visitor prefers less motion).
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && !seen) {
          setSeen(true)
          if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(true)
        }
      },
      { threshold: 0.35 },
    )
    if (root.current) o.observe(root.current)
    return () => o.disconnect()
  }, [seen])

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setPosition((p) => (p + 0.3) % 100), 70)
    return () => clearInterval(timer)
  }, [playing])

  const frame = films[Math.min(films.length - 1, Math.floor(position / (100 / films.length)))]!
  const seconds = String(Math.floor((position / 100) * 24)).padStart(2, '0')

  return (
    <div ref={root} className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a232c] text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]">
      {/* title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="truncate rounded-md bg-white/5 px-3 py-1 font-mono text-[0.68rem] text-white/60">ATL / composition-study.prproj</span>
        </span>
        <span className="hidden shrink-0 font-mono text-[0.68rem] text-white/50 sm:inline">1920 × 1080 · 24 fps</span>
      </div>

      {/* program monitor + inspector */}
      <div className="grid gap-px bg-white/10 md:grid-cols-[1fr_240px]">
        <div className="bg-black/30 p-3 sm:p-4">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
            <img src={frame.thumbnail} alt={`Timeline preview: ${frame.title}`} loading="lazy" className="h-full w-full object-cover" />
            <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-[0.7rem] font-semibold">
              {frame.title}
              <span className="ml-2 font-normal text-white/60">Original motion sample</span>
            </span>
          </div>
        </div>
        <div className="hidden bg-[#1a232c] p-5 md:block">
          <p className="text-xs font-semibold text-[#ffa53a]">The finishing touches</p>
          <ul className="mt-4 space-y-4">
            {INSPECTOR.map((x) => (
              <li key={x.label}>
                <span className="flex justify-between text-[0.7rem] text-white/70">
                  {x.label}
                  <span className="font-mono text-white/45">{x.value}%</span>
                </span>
                <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-[#ff8e01]" style={{ width: `${x.value}%` }} />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.7rem] text-white/45">Artistic process demonstration</p>
        </div>
      </div>

      {/* transport */}
      <div className="flex items-center gap-4 border-y border-white/10 px-4 py-2.5">
        <button
          type="button"
          className="grid size-9 place-items-center rounded-full bg-[#ff8e01] text-[#1a232c] transition hover:bg-[#cc7101]"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? 'Pause timeline' : 'Play timeline'}
        >
          {playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="ml-0.5 size-4" fill="currentColor" />}
        </button>
        <span className="font-mono text-sm text-[#ffa53a]">00:00:{seconds}:00</span>
        <span className="ml-auto text-[0.7rem] font-semibold uppercase tracking-wider text-white/45">Master sequence</span>
      </div>

      {/* tracks */}
      <div className="relative px-3 pb-4 pt-2" aria-hidden="true">
        <div className="ml-10 flex justify-between font-mono text-[0.6rem] text-white/40">
          <span>00:00</span>
          <span>00:06</span>
          <span>00:12</span>
          <span>00:18</span>
          <span>00:24</span>
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center">
            <b className="w-10 shrink-0 font-mono text-[0.65rem] font-semibold text-white/45">V2</b>
            <div className="flex h-8 flex-1 gap-1">
              <span className="ml-[18%] flex w-[35%] items-center truncate rounded-md bg-[#7c5cff]/80 px-2 text-[0.6rem] font-semibold">◇ Titles &amp; motion</span>
              <span className="flex w-[17%] items-center truncate rounded-md bg-[#7c5cff]/80 px-2 text-[0.6rem] font-semibold">◇ Outro</span>
            </div>
          </div>
          <div className="flex items-center">
            <b className="w-10 shrink-0 font-mono text-[0.65rem] font-semibold text-white/45">V1</b>
            <div className="flex h-11 flex-1 gap-1">
              {films.slice(0, 4).map((p) => (
                <span
                  key={p.id}
                  className="flex flex-1 items-end overflow-hidden rounded-md bg-cover bg-center px-1.5 pb-1 text-[0.6rem] font-semibold ring-1 ring-[#7cc4ff]/50"
                  style={{ backgroundImage: `linear-gradient(transparent 40%, rgba(0,0,0,0.65)), url(${p.thumbnail})` }}
                >
                  {p.id}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <b className="w-10 shrink-0 font-mono text-[0.65rem] font-semibold text-white/45">A1</b>
            <div className="flex h-10 flex-1 items-center justify-between gap-px overflow-hidden rounded-md bg-[#3ddcb0]/15 px-1.5">
              {Array.from({ length: 65 }, (_, i) => (
                <i key={i} className={`${playing ? 'wave-bar ' : ''}w-[2px] shrink-0 rounded-full bg-[#3ddcb0]`} style={{ height: `${10 + ((i * 17) % 22)}px`, animationDelay: `${(i % 9) * -0.15}s` }} />
              ))}
            </div>
          </div>
        </div>
        {/* playhead */}
        <span className="pointer-events-none absolute bottom-3 top-1 w-px bg-[#ff8e01]" style={{ left: `calc(3.25rem + (100% - 4rem) * ${position / 100})` }}>
          <span className="absolute -left-[5px] -top-0.5 size-[11px] rotate-45 rounded-[2px] bg-[#ff8e01]" />
        </span>
      </div>
    </div>
  )
}
