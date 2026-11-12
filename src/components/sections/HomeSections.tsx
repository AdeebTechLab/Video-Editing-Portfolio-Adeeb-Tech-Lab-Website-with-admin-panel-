// The sections of the portfolio home page, in the design of the Adeeb Tech Lab app development portfolio.
// The content comes from the admin panel (src/data/site-data.json and this browser's changes).
import { useState } from 'react'
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, ChevronsLeftRight, Play } from 'lucide-react'
import { HERO_WORDS } from '../../config/site'
import { useContent } from '../../hooks/useContent'
import { useUnavailableVideos } from '../../hooks/useUnavailableVideos'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { VIDEO_TYPE_LABELS, type Category, type Video } from '../../lib/types'
import { cn, safeUrl } from '../../lib/utils'
import { HdThumbnail } from '../HdThumbnail'
import { BrandIcon } from '../icons/BrandIcon'
import { usePlayVideo } from '../layout/VideoPlayerContext'
import { ServiceIcon } from '../ServiceIcon'
import Timeline from '../Timeline'
import { TypedWords } from '../TypedWords'
import { SectionHeading, SectionLink } from '../ui'

/* ---------------- Hero ---------------- */
export function Hero() {
  const { settings, videos, categories, services, tools } = useContent()
  const wa = useWhatsApp()

  const stats = [
    { k: 'Videos in this portfolio', v: videos.length },
    { k: 'Video categories', v: categories.filter((c) => videos.some((v) => v.categoryId === c.id)).length },
    { k: 'Editing services', v: services.length },
    { k: 'Editing tools', v: tools.length },
  ]

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="container-x grid items-center gap-12 pb-10 pt-10 md:pb-16 md:pt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:pb-20">
        <div className="hero-rise max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-accent-text">Video Editing &amp; Creative Production</p>
          <h1 className="mt-4 text-[2.15rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.3rem]">
            We don’t just edit. <span className="text-accent-text">We create impact.</span>
          </h1>
          <p className="mt-5 text-lg font-semibold text-ink">
            <span className="text-ink-muted">We edit </span>
            <TypedWords className="text-accent-text" words={HERO_WORDS} />
          </p>
          <p className="mt-4 max-w-xl text-base text-ink-muted sm:text-lg">
            Cinematic video editing, motion graphics and visual storytelling by {settings.companyName}
            {settings.location ? `, from ${settings.location}` : ''}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#work" className="btn btn-primary">
              See our work
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a href={wa.link()} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <BrandIcon name="whatsapp" className="size-[18px] text-whatsapp" />
              Message us on WhatsApp
            </a>
          </div>
        </div>
        <div className="relative pb-6 sm:px-4">
          <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_55%_50%,var(--glow),transparent_65%)]" aria-hidden="true" />
          <img
            src="/images/hero.png"
            alt="Video editing workstation with Premiere Pro, After Effects, a film strip and a camera"
            width={1312}
            height={1199}
            fetchPriority="high"
            className="hero-float relative mx-auto h-auto w-full max-w-[560px] drop-shadow-[0_30px_45px_rgba(0,0,0,0.4)]"
          />
        </div>
      </div>

      <div className="container-x">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.k} className="bg-page px-5 py-5">
              <dt className="text-xs font-medium text-ink-faint">{s.k}</dt>
              <dd className="mt-1 text-2xl font-extrabold text-ink">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ---------------- Showreel ---------------- */
export function ShowreelSection() {
  return (
    <section id="showreel" className="scroll-mt-20 py-20 md:py-24">
      <div className="container-x">
        <SectionHeading title="Every frame tells a story" text="The creative energy, precision and storytelling behind our video production work." />
        <figure className="relative mt-10 overflow-hidden rounded-3xl border border-line bg-surface">
          <img src="/images/fullediting.png" alt="A video editor at work in a fully equipped editing studio" width={1672} height={941} loading="lazy" className="aspect-video h-auto w-full object-cover" />
          <figcaption className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-page-deep/90 px-3 py-1.5 text-xs font-semibold text-ink backdrop-blur sm:bottom-5 sm:left-5">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            Crafting stories frame by frame
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

/* ---------------- Services ---------------- */
export function ServicesSection() {
  const { services } = useContent()
  const [all, setAll] = useState(false)
  if (!services.length) return null

  return (
    <section id="services" className="scroll-mt-20 py-6 md:py-10">
      <div className="container-x">
        <SectionHeading
          title="Video editing services"
          text="Video editing is our confirmed service. The formats and finishing options below are scopes we shape around your project."
          aside={
            <SectionLink section="contact" className="btn btn-outline self-start sm:self-auto">
              Discuss your project
            </SectionLink>
          }
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.id} className={cn(i >= 6 && !all && 'max-sm:hidden')}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-200 hover:border-accent/60">
                <div className="relative aspect-video overflow-hidden border-b border-line bg-page-deep">
                  {s.image ? (
                    <img src={s.image} alt={s.imageAlt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  ) : (
                    <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_45%,var(--glow),transparent_70%)]" aria-hidden="true">
                      <ServiceIcon name={s.icon} className="size-12 text-accent-text" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 gap-4 p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-text">
                    <ServiceIcon name={s.icon} className="size-5" />
                  </span>
                  <div>
                    {s.label && <p className="text-xs font-semibold text-accent-text">{s.label}</p>}
                    <h3 className="mt-0.5 font-bold text-ink">{s.name}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{s.description}</p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
        {services.length > 6 && !all && (
          <button type="button" className="btn btn-outline mt-4 w-full sm:hidden" onClick={() => setAll(true)}>
            Show all {services.length} services
          </button>
        )}
      </div>
    </section>
  )
}

/* ---------------- Work ---------------- */
const ALL = { id: 'all', name: 'All Projects' }

function sourceLabel(video: Video) {
  if (video.isDemo) return 'Original sample'
  return `${VIDEO_TYPE_LABELS[video.videoType].replace(' file', '')} video`
}

function VideoCard({ video, category }: { video: Video; category?: Category }) {
  const play = usePlayVideo()
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-200 hover:border-accent/60">
      <div className="relative aspect-video overflow-hidden border-b border-line bg-page-deep">
        <HdThumbnail src={video.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <span className="absolute left-3 top-3 rounded-full bg-page-deep/90 px-2.5 py-1 text-xs font-semibold text-accent-text backdrop-blur">{sourceLabel(video)}</span>
        <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
          <span className="grid size-14 place-items-center rounded-full bg-accent/90 text-on-accent shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:scale-110">
            <Play className="ml-0.5 size-6" fill="currentColor" />
          </span>
        </span>
        {video.duration && <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-0.5 text-xs font-semibold text-white">{video.duration}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {category && <p className="text-xs font-semibold text-accent-text">{category.name}</p>}
        <h3 className="text-lg font-bold text-ink">
          <button
            type="button"
            onClick={() => play(video)}
            aria-label={`Play ${video.title}`}
            title={video.title}
            className="line-clamp-2 text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {video.title}
          </button>
        </h3>
        {video.description && <p className="line-clamp-2 text-sm text-ink-muted">{video.description}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="text-xs font-semibold text-ink-faint">Play here</p>
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink-muted transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-accent group-has-[button:focus-visible]:ring-2" aria-hidden="true" />
    </article>
  )
}

export function WorkSection() {
  const { videos, featuredFirst, categories, categoryById } = useContent()
  const [filter, setFilter] = useState(ALL.id)
  // YouTube videos that were deleted or made private are hidden, so the next video of their category shows instead.
  const unavailable = useUnavailableVideos(videos)
  // Only videos in an existing category are listed; categories without videos are hidden.
  const listed = videos.filter((v) => categoryById.has(v.categoryId) && !unavailable.has(v.id))
  const tabs = [ALL, ...categories.filter((c) => listed.some((v) => v.categoryId === c.id))]
  const current = tabs.some((c) => c.id === filter) ? filter : ALL.id
  // All shows the latest video of each category; a category shows all its videos, featured first.
  const latestByCategory = new Map<string, Video>()
  for (const video of listed) {
    if (!latestByCategory.has(video.categoryId)) latestByCategory.set(video.categoryId, video)
  }
  const shown =
    current === ALL.id ? [...latestByCategory.values()] : featuredFirst.filter((v) => v.categoryId === current && !unavailable.has(v.id))
  if (!listed.length) return null

  return (
    <section id="work" className="scroll-mt-20 py-20 md:py-24">
      <div className="container-x">
        <SectionHeading
          title="Selected work"
          text="Videos we have edited for creators, brands and businesses. Pick a category and play any video right here."
        />
        {tabs.length > 2 && (
          <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter videos by category">
            {tabs.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={current === c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                  current === c.id ? 'border-accent bg-accent text-on-accent' : 'border-line text-ink-muted hover:border-line-strong hover:text-ink',
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
        <p className="sr-only" role="status">
          {shown.length} {shown.length === 1 ? 'video' : 'videos'} shown
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((v) => (
            <VideoCard key={v.id} video={v} category={categoryById.get(v.categoryId)} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Inside the edit ---------------- */
export function TimelineSection() {
  return (
    <section id="timeline" className="scroll-mt-20 py-6 md:py-10">
      <div className="container-x">
        <SectionHeading title="Where the magic happens" text="One story, many layers. An artistic look at how an edit comes together on the timeline." />
        <div className="mt-10">
          <Timeline />
        </div>
      </div>
    </section>
  )
}

/* ---------------- Tools & skills ---------------- */
export function ToolsSection() {
  const { settings, tools } = useContent()
  if (!tools.length && !settings.skills.length) return null

  return (
    <section id="tools" className="scroll-mt-20 py-20 md:py-24">
      <div className="container-x">
        <SectionHeading title="The tools behind the creativity" text="Professional editing, colour and finishing software, chosen to suit each project." />
        {tools.length > 0 && (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <li key={t.id} className="card flex gap-4 p-5 transition-colors hover:border-line-strong">
                <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-page-deep" style={{ boxShadow: `0 0 0 1px ${t.color}66` }}>
                  <img src={t.logo} alt="" width={56} height={56} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{t.name}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{t.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {settings.skills.length > 0 && (
          <div className="mt-10 grid gap-4 border-y border-line py-6 md:grid-cols-[200px_1fr] md:items-center">
            <h3 className="text-sm font-bold text-ink">Editing skills</h3>
            <ul className="flex flex-wrap gap-2.5">
              {settings.skills.map((s) => (
                <li key={s} className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-semibold text-ink-muted">
                  <Check className="size-4 text-accent-text" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------------- Process ---------------- */
export function ProcessSection() {
  const { settings } = useContent()
  if (!settings.process.length) return null
  return (
    <section id="process" className="scroll-mt-20 py-6 md:py-10">
      <div className="container-x">
        <SectionHeading title="From raw footage to final video" text="A clear process from the first call to delivery, so you always know what happens next." />
        <ol className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {settings.process.map((s, i) => (
            <li key={i} className="relative flex gap-4">
              <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-2 border-accent bg-page text-sm font-extrabold text-accent-text">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-1.5">
                <h3 className="font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{s.text}</p>
              </div>
              {i < settings.process.length - 1 && <span className="absolute left-[21px] top-12 h-[calc(100%-1rem)] w-px bg-line-strong md:hidden" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- Before & after ---------------- */
export function ComparisonSection() {
  const { settings } = useContent()
  const [compare, setCompare] = useState(50)
  const { before, after, label } = settings.comparison
  if (!before || !after) return null
  // With one picture for both sides, the colour difference is simulated with filters.
  const simulated = before === after

  return (
    <section id="comparison" className="scroll-mt-20 py-20 md:py-24">
      <div className="container-x">
        <SectionHeading title="See the transformation" text="Same composition, a different feeling. Drag the handle to compare." />
        <div className="relative mt-10 aspect-video select-none overflow-hidden rounded-3xl border border-line bg-page-deep focus-within:ring-2 focus-within:ring-accent">
          <img
            src={before}
            alt="The original picture with flat, neutral colour"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={simulated ? { filter: 'grayscale(1) brightness(0.7) contrast(0.75)' } : undefined}
          />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - compare}% 0 0)` }}>
            <img
              src={after}
              alt="The same picture after colour treatment"
              loading="lazy"
              className="h-full w-full object-cover"
              style={simulated ? { filter: 'saturate(1.2) contrast(1.15)' } : undefined}
            />
          </div>
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-page-deep/90 px-2.5 py-1 text-xs font-semibold text-accent-text backdrop-blur">After</span>
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-page-deep/90 px-2.5 py-1 text-xs font-semibold text-ink-muted backdrop-blur">Before</span>
          <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90" style={{ left: `${compare}%` }} aria-hidden="true">
            <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-on-accent shadow-lg">
              <ChevronsLeftRight className="size-5" />
            </span>
          </div>
          <input
            aria-label="Compare the picture before and after colour treatment"
            type="range"
            min="0"
            max="100"
            value={compare}
            onChange={(e) => setCompare(+e.target.value)}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
        <p className="mt-3 text-sm text-ink-faint">
          {label && `${label}. `}Drag, touch or use the arrow keys.
          {simulated && ' This demonstrates a colour treatment on an original picture, not an actual client edit.'}
        </p>
      </div>
    </section>
  )
}

/* ---------------- About ---------------- */
export function AboutSection() {
  const { settings } = useContent()
  const wa = useWhatsApp()
  const [failed, setFailed] = useState(false)
  const name = settings.founderName
  const first = name.split(' ')[0] || name
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
  const website = safeUrl(settings.website)

  return (
    <section id="about" className="scroll-mt-20 py-6 md:py-10">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_70%)]" aria-hidden="true" />
          <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[320px_1fr] lg:items-center lg:gap-14 lg:p-14">
            <div className="flex flex-col items-center text-center">
              <span className="relative grid aspect-square w-52 place-items-center rounded-full p-2 ring-4 ring-accent sm:w-60">
                <span className="absolute inset-0 rounded-full opacity-60 shadow-[0_0_60px_-10px_var(--accent)]" aria-hidden="true" />
                <span className="relative grid h-full w-full place-items-center overflow-hidden rounded-full bg-page-deep">
                  {settings.founderImage && !failed ? (
                    <img
                      src={settings.founderImage}
                      alt={`${name}, ${settings.founderRole} of ${settings.companyName}`}
                      loading="lazy"
                      className="h-full w-full object-cover object-[50%_20%]"
                      onError={() => setFailed(true)}
                    />
                  ) : (
                    <span className="text-5xl font-extrabold text-accent-text">{initials}</span>
                  )}
                </span>
              </span>
              <p className="mt-6 text-xl font-extrabold text-ink">{name}</p>
              <p className="text-sm font-semibold text-accent-text">
                {settings.founderRole}
                {settings.founderRole && settings.companyName ? `, ${settings.companyName}` : ''}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Creativity in motion</h2>
              <p className="mt-4 text-lg font-semibold text-ink">A sharp eye. A considered cut. A story worth watching.</p>
              <div className="prose-body mt-4 max-w-[65ch] text-ink-muted">
                <p>
                  {settings.companyName} offers video editing and graphic design as part of its creative digital work. Led by {name}, our CEO and video editor, this
                  portfolio brings the focus to moving images and visual storytelling.
                </p>
                <p>
                  {first}’s official portfolio lists video editing, green screen work and animation experience. Our approach begins with your idea: finding the rhythm,
                  shaping the narrative and refining the details that make a film feel complete.
                </p>
              </div>
              {settings.values.length > 0 && (
                <>
                  <h3 className="mt-8 text-sm font-bold text-ink">Why work with us</h3>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {settings.values.map((v) => (
                      <li key={v} className="flex gap-2.5 text-sm text-ink">
                        <BadgeCheck className="mt-0.5 size-[18px] shrink-0 text-accent-text" aria-hidden="true" />
                        {v}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Visit our website
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                )}
                <a href={wa.link(`Hi ${first}, I'd like to discuss a video editing project.`)} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <BrandIcon name="whatsapp" className="size-[18px] text-whatsapp" />
                  Talk to {first}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
