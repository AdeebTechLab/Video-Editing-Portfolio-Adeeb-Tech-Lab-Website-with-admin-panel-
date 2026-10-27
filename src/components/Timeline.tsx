import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { SAMPLE_FILMS as projects } from '../config/site'
export default function Timeline() {
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(12)
  const [seen, setSeen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seen) {
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
  const frame = projects[Math.min(4, Math.floor(position / 20))]
  return (
    <div className="editing-desk reveal" ref={root}>
      <div className="desk-top">
        <span>
          <i className="status-dot" /> ATL / COMPOSITION STUDY
        </span>
        <span>1920 × 1080 / 24 FPS</span>
      </div>
      <div className="desk-body">
        <div className="preview-monitor">
          <img src={frame.thumbnail} alt={`Timeline preview: ${frame.title}`} loading="lazy" />
          <div className="monitor-caption">
            {frame.title}
            <span>Original motion sample</span>
          </div>
        </div>
        <div className="inspector">
          <p className="eyebrow">The finishing touches</p>
          {['Sequence', 'Color', 'Sound', 'Motion'].map((x, i) => (
            <div key={x}>
              <span>{x}</span>
              <div className="inspector-bar">
                <i style={{ width: `${58 + i * 9}%` }} />
              </div>
            </div>
          ))}
          <p>Artistic process demonstration</p>
        </div>
      </div>
      <div className="timeline-control">
        <button className="icon-button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause timeline' : 'Play timeline'}>
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <span>00:00:{String(Math.floor((position / 100) * 24)).padStart(2, '0')}:00</span>
        <span className="muted">MASTER SEQUENCE</span>
      </div>
      <div className="tracks">
        <div className="ruler">
          <span>00:00</span>
          <span>00:06</span>
          <span>00:12</span>
          <span>00:18</span>
          <span>00:24</span>
        </div>
        <div className="playhead" style={{ left: `calc(52px + (100% - 64px) * ${position / 100})` }} />
        <div className="track">
          <b>V2</b>
          <div className="clip purple" style={{ width: '35%', marginLeft: '18%' }}>
            ◇ TITLES & MOTION ◇
          </div>
          <div className="clip purple" style={{ width: '17%' }}>
            ◇ OUTRO
          </div>
        </div>
        <div className="track">
          <b>V1</b>
          {projects.slice(0, 4).map((p) => (
            <div key={p.id} className="clip picture" style={{ backgroundImage: `url(${p.thumbnail})` }}>
              {p.id}
              <i>↗</i>
            </div>
          ))}
        </div>
        <div className="track">
          <b>A1</b>
          <div className="clip cyan waveform">
            {Array.from({ length: 65 }, (_, i) => (
              <i key={i} style={{ height: `${12 + ((i * 17) % 30)}px` }} />
            ))}
            <span>SOUND DESIGN</span>
          </div>
        </div>
      </div>
      <label className="scrub">
        Scrub the composition
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) => {
            setPlaying(false)
            setPosition(+e.target.value)
          }}
        />
      </label>
    </div>
  )
}
