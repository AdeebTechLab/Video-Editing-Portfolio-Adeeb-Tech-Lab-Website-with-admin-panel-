// The sections of the portfolio home page. The markup and class names match the original single-page
// portfolio; the content comes from the admin panel (src/data/site-data.json and this browser's changes).
import { useState } from 'react'
import { ArrowUpRight, ArrowDown, Play, ChevronRight } from 'lucide-react'
import { useContent } from '../../hooks/useContent'
import type { Video } from '../../lib/types'
import { usePlayVideo } from '../layout/VideoPlayerContext'
import { Heading } from '../ui'
import Timeline from '../Timeline'
import ServiceArtwork from '../ServiceArtwork'
import { ServiceIcon } from '../ServiceIcon'

/** Item number: 01, 02 … 10 */
export function Num({ i }: { i: number }) {
  return (
    <>
      {i < 9 && '0'}
      {i + 1}
    </>
  )
}

const ALL = { id: 'all', name: 'All Projects' }

function sourceLabel(video: Video) {
  if (video.isDemo) return 'ORIGINAL SAMPLE'
  if (video.videoType === 'vimeo') return 'VIMEO VIDEO'
  if (video.videoType === 'mp4') return 'MP4 VIDEO'
  return 'YOUTUBE VIDEO'
}

export function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-grid" />
      <div className="hero-orb" />
      <div className="hero-content">
        <p className="eyebrow intro-reveal">
          <i className="status-dot" /> ADEEB TECH LAB / CREATIVE VIDEO PRODUCTION
        </p>
        <h1>
          <span>WE DON’T</span>
          <span>JUST EDIT.</span>
          <span className="impact">
            WE CREATE <em>IMPACT.</em>
          </span>
        </h1>
        <div className="hero-bottom">
          <p>
            Cinematic Video Editing, Motion Graphics &amp;
            <br />
            Visual Storytelling by Adeeb Tech Lab.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#work">
              Explore our work <ArrowUpRight size={19} />
            </a>
            <a className="button" href="#contact">
              Start a project <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="hero-film">
        <div className="hero-art">
          <img src="/images/hero.png" alt="Adeeb Tech Lab creative video editing" fetchPriority="high" />
        </div>
      </div>
      <div className="hero-foot">
        <a href="#showreel">
          <ArrowDown size={15} /> Scroll to discover
        </a>
        <span>STORY. RHYTHM. EMOTION.</span>
        <span>BAHAWALPUR, PAKISTAN</span>
      </div>
    </section>
  )
}

export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div>
        EDITING <i>✳</i> MOTION <i>✳</i> STORYTELLING <i>✳</i> CREATIVITY <i>✳</i> PRODUCTION <i>✳</i> PRECISION <i>✳</i> EDITING <i>✳</i> MOTION{' '}
        <i>✳</i> STORYTELLING <i>✳</i>
      </div>
    </div>
  )
}

export function ShowreelSection() {
  return (
    <section id="showreel" className="section">
      <div className="heading-split">
        <Heading number="02" kicker="Visual storytelling">
          EVERY FRAME
          <br />
          TELLS A <em>STORY.</em>
        </Heading>
        <p className="side-copy">Explore the creative energy, precision, and storytelling behind our video production work.</p>
      </div>

      <div className="showreel-frame reveal">
        <img src="/images/fullediting.png" alt="Full video editing workspace" loading="lazy" />
      </div>
    </section>
  )
}

export function AboutSection() {
  const { settings } = useContent()
  return (
    <section id="about" className="section about">
      <div className="founder-photo reveal">
        <img src={settings.founderImage} alt={`${settings.founderName}, CEO of ${settings.companyName}`} loading="lazy" />
        <div className="photo-label">
          {settings.founderName.toUpperCase()}
          <span>{settings.founderRole.toUpperCase()}</span>
        </div>
        <span className="photo-corner">ATL / 01</span>
      </div>
      <div>
        <Heading number="03" kicker="About the studio">
          CREATIVITY
          <br />
          IN <em>MOTION.</em>
        </Heading>
        <p className="intro">
          A sharp eye. A considered cut.
          <br />A story worth watching.
        </p>
        <p className="muted">
          Adeeb Tech Lab offers video editing and graphic design as part of its creative digital work. Led by Salman Adeeb, CEO and video editor, this portfolio
          brings the focus to moving images and visual storytelling.
        </p>
        <p className="muted">
          Salman’s official portfolio lists video editing, green screen work and animation experience. Our approach begins with your idea: finding the rhythm,
          shaping the narrative and refining the details that make a film feel complete.
        </p>
        <div className="production-label">
          <i className="status-dot" /> CRAFTING STORIES FRAME BY FRAME
        </div>
      </div>
    </section>
  )
}

export function ServicesSection() {
  const { services } = useContent()
  const [service, setService] = useState(0)
  const selected = Math.min(service, Math.max(services.length - 1, 0))
  const current = services[selected]
  return (
    <section id="services" className="section">
      <Heading number="04" kicker="Creative capabilities">
        YOUR VISION.
        <br />
        OUR EDITING <em>EXPERTISE.</em>
      </Heading>
      <p className="muted service-note">
        Video editing is a confirmed offering. The formats and finishing options below are proposed scopes to discuss for your project.
      </p>
      <div className="services-layout">
        <div className="services-list">
          {services.map((s, i) => (
            <button
              key={s.id}
              className={`service-row ${selected === i ? 'selected' : ''}`}
              onClick={() => setService(i)}
              aria-expanded={selected === i}
              aria-controls="service-preview"
            >
              <span className="service-number">
                <Num i={i} />
              </span>
              <ServiceIcon name={s.icon} size={22} />
              <span>{s.name}</span>
              <ArrowUpRight size={20} />
            </button>
          ))}
        </div>
        <div className="service-preview" id="service-preview">
          {current && (
            <>
              <ServiceArtwork key={selected} service={selected} image={current.image} alt={current.imageAlt} />
              <p className="eyebrow">{current.label}</p>
              <h3>{current.name}</h3>
              <p className="muted">{current.description}</p>
              <a href="#contact" className="text-link">
                Discuss this service <ArrowUpRight size={17} />
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export function WorkSection() {
  const { videos, featuredFirst, categories, categoryById } = useContent()
  const play = usePlayVideo()
  const [filter, setFilter] = useState(ALL.id)
  // Only videos in an existing category are listed; categories without videos are hidden.
  const listed = videos.filter((v) => categoryById.has(v.categoryId))
  const categoryOptions = [ALL, ...categories.filter((c) => listed.some((v) => v.categoryId === c.id))]
  const currentFilter = categoryOptions.some((c) => c.id === filter) ? filter : ALL.id
  const categoryName = (video: Video) => categoryById.get(video.categoryId)?.name ?? ''
  // All Projects shows the latest video of each category; a category shows all its videos, featured first.
  const latestByCategory = new Map<string, Video>()
  for (const project of listed) {
    if (!latestByCategory.has(project.categoryId)) latestByCategory.set(project.categoryId, project)
  }
  const visibleProjects = currentFilter === ALL.id ? [...latestByCategory.values()] : featuredFirst.filter((project) => project.categoryId === currentFilter)
  return (
    <section id="work" className="section work">
      <div className="heading-split">
        <Heading number="05" kicker="Portfolio / selected projects">
          SELECTED <em>WORK.</em>
        </Heading>
        <p className="side-copy">
          Visual stories crafted with creativity and precision.
          <span>Explore our latest videos and play them right here.</span>
        </p>
      </div>
      <div className="filters" aria-label="Filter projects">
        {categoryOptions.map((c) => (
          <button key={c.id} className={currentFilter === c.id ? 'selected' : ''} aria-pressed={currentFilter === c.id} onClick={() => setFilter(c.id)}>
            {c.name}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {visibleProjects.length} projects shown
      </p>
      <div className="project-grid">
        {visibleProjects.map((p, i) => (
          <button key={p.id} className={`project ${i === 0 ? 'featured' : ''}`} data-cursor="VIEW" onClick={() => play(p)} aria-label={`Play ${p.title}`}>
            <div className="project-image">
              <img src={p.thumbnail} alt={`${p.title} video thumbnail`} loading="lazy" />
              <span className="sample-tag">{sourceLabel(p)}</span>
              <span className="project-play">
                <Play size={21} fill="currentColor" />
              </span>
              <span className="duration">{p.duration}</span>
            </div>
            <div className="project-info">
              <div>
                <p>{categoryName(p)}</p>
                <h3>{p.title}</h3>
                <span>{p.description}</span>
              </div>
              <ArrowUpRight size={23} />
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

export function TimelineSection() {
  return (
    <section id="timeline" className="section">
      <div className="heading-split">
        <Heading number="06" kicker="Inside the edit">
          WHERE THE
          <br />
          <em>MAGIC</em> HAPPENS.
        </Heading>
        <p className="side-copy">
          One story. Many layers.
          <br />
          Explore an artistic interpretation of the editing process.
        </p>
      </div>
      <Timeline />
    </section>
  )
}

export function ToolsSection() {
  const { settings, tools } = useContent()
  return (
    <section id="tools" className="section tools">
      <Heading number="07" kicker="The creative toolkit">
        THE TOOLS BEHIND
        <br />
        THE <em>CREATIVITY.</em>
      </Heading>
      <div className="tool-grid">
        {tools.map((t) => (
          <article className="tool reveal" key={t.id}>
            <span className="tool-mark tool-logo" style={{ borderColor: `${t.color}40` }}>
              <img src={t.logo} alt={`${t.name} logo`} width={56} height={56} loading="lazy" referrerPolicy="no-referrer" />
            </span>
            <h3>{t.name}</h3>
            <p>{t.description}</p>
          </article>
        ))}
      </div>
      <p className="muted">Our creative toolkit for editing, color and finishing. Creative scopes are discussed per project.</p>
      <div className="skills">
        {settings.skills.map((s) => (
          <span key={s}>
            {s}
            <i>↗</i>
          </span>
        ))}
      </div>
    </section>
  )
}

export function ProcessSection() {
  const { settings } = useContent()
  return (
    <section id="process" className="section">
      <Heading number="08" kicker="Our proposed workflow">
        FROM RAW FOOTAGE
        <br />
        TO FINAL <em>MASTERPIECE.</em>
      </Heading>
      <div className="process-line">
        {settings.process.map((p, i) => (
          <article className="process-step reveal" key={`${p.title}-${i}`}>
            <div>
              <span>
                <Num i={i} />
              </span>
              <ArrowUpRight size={22} />
            </div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ComparisonSection() {
  const { settings } = useContent()
  const [compare, setCompare] = useState(50)
  return (
    <section id="comparison" className="section">
      <div className="heading-split">
        <Heading number="09" kicker="The finishing difference">
          SEE THE
          <br />
          <em>TRANSFORMATION.</em>
        </Heading>
        <p className="side-copy">
          Same composition. A different feeling.
          <span>{settings.comparison.label}</span>
        </p>
      </div>
      <div className="comparison reveal" data-cursor="DRAG">
        <img className="before" src={settings.comparison.before} alt="Original graphic with flat neutral color" loading="lazy" />
        <div className="after" style={{ clipPath: `inset(0 ${100 - compare}% 0 0)` }}>
          <img src={settings.comparison.after} alt="Same original graphic with cinematic orange color treatment" loading="lazy" />
        </div>
        <span className="comparison-label left">COLOR TREATMENT</span>
        <span className="comparison-label right">FLAT ORIGINAL</span>
        <div className="comparison-handle" style={{ left: `${compare}%` }}>
          <span>↔</span>
        </div>
        <input
          aria-label="Compare original and color-treated graphic"
          type="range"
          min="0"
          max="100"
          value={compare}
          onChange={(e) => setCompare(+e.target.value)}
        />
      </div>
      <p className="muted small">
        Drag, touch, or use the arrow keys. This demonstrates a color treatment on an original illustration, not an actual client edit.
      </p>
    </section>
  )
}

export function WhySection() {
  const { settings } = useContent()
  return (
    <section id="why" className="section why">
      <Heading number="10" kicker="A considered approach">
        BUILT FOR STORIES
        <br />
        THAT <em>STAND OUT.</em>
      </Heading>
      <div className="values">
        {settings.values.map((v, i) => (
          <div className="reveal" key={v}>
            <span>
              <Num i={i} />
            </span>
            <h3>{v}</h3>
            <ArrowUpRight size={20} />
          </div>
        ))}
      </div>
    </section>
  )
}
