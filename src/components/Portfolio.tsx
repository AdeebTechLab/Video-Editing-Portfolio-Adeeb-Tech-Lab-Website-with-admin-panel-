"use client";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  Play,
  X,
  Menu,
  Film,
  MonitorPlay,
  Smartphone,
  Layers,
  Palette,
  AudioLines,
  Clapperboard,
  Mic,
  Sparkles,
  Plus,
  Minus,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import {
  company,
  projects,
  services,
  tools,
  skills,
  process as stages,
  values,
  faqs,
  navigation,
  socials,
  comparison,
  type Video,
} from "@/data/portfolio";
const icons = [
  Film,
  MonitorPlay,
  Smartphone,
  Layers,
  Palette,
  AudioLines,
  Clapperboard,
  Mic,
  Sparkles,
];
import { Heading } from "./ui";
import VideoModal from "./VideoModal";
import Timeline from "./Timeline";
import Contact from "./Contact";
import ServiceArtwork from "./ServiceArtwork";
import { activeCategories } from '@/lib/categories';
export default function Portfolio() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("home");
  const [filter, setFilter] = useState("All Projects");
  const [video, setVideo] = useState<Video | null>(null);
  const [service, setService] = useState(0);
  const [compare, setCompare] = useState(50);
  const [cursor, setCursor] = useState({ x: 0, y: 0, label: "" });
  const [scrolled, setScrolled] = useState(false);
  const [addedProjects, setAddedProjects] = useState<Video[]>([]);
  const selectedProjects = [...addedProjects].sort((a, b) => Number(b.featured) - Number(a.featured));
  const categoryOptions = ['All Projects', ...activeCategories(selectedProjects)];
  const currentFilter = categoryOptions.includes(filter) ? filter : 'All Projects';
  const latestByCategory = new Map<string, Video>();
  for (const project of addedProjects) {
    if (!latestByCategory.has(project.category)) latestByCategory.set(project.category, project);
  }
  const visibleProjects = currentFilter === 'All Projects'
    ? [...latestByCategory.values()]
    : selectedProjects.filter(project => project.category === currentFilter);
  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      try {
        const response = await fetch('/api/projects', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (mounted) setAddedProjects(data.projects);
      } catch { /* Keep existing films available if the server is offline. */ }
    };
    refresh();
    const timer = window.setInterval(refresh, 15000);
    window.addEventListener('focus', refresh);
    return () => { mounted = false; window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            if (e.target.id) setActive(e.target.id);
          }
        }),
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(".reveal, section[id]")
      .forEach((e) => observer.observe(e));
    const scroll = () => setScrolled(window.scrollY > 50);
    const move = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest("[data-cursor]");
      setCursor({
        x: e.clientX,
        y: e.clientY,
        label: el?.getAttribute("data-cursor") || "",
      });
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("pointermove", move);
    };
  }, []);
  useEffect(() => {
    if (!menu) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [menu]);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div
        className={`cinema-cursor ${cursor.label ? "shown" : ""}`}
        style={{ transform: `translate(${cursor.x}px,${cursor.y}px)` }}
      >
        {cursor.label}
      </div>
      <header className={scrolled ? "scrolled" : ""}>
        <a
          href="#home"
          className="brand"
          aria-label="Adeeb Tech Lab home"
        >
          <img
            src={company.logo}
            alt="Adeeb Tech Lab logo"
            width="38"
            height="38"
          />
          <span>
            Adeeb Tech Lab<span className="brand-tagline">Digital Tech Exper</span>
          </span>
        </a>
        <nav
          className={menu ? "open" : ""}
          id="navigation"
          aria-label="Main navigation"
        >
          {navigation.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "active" : ""}
              onClick={() => setMenu(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#contact">
          Let’s talk <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-button icon-button"
          onClick={() => setMenu(!menu)}
          aria-label={menu ? "Close navigation" : "Open navigation"}
          aria-expanded={menu}
          aria-controls="navigation"
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main id="main">
        <section id="home" className="hero">
          <div className="hero-grid" />
          <div className="hero-orb" />
          <div className="hero-content">
            <p className="eyebrow intro-reveal">
              <i className="status-dot" /> ADEEB TECH LAB / CREATIVE VIDEO
              PRODUCTION
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
        <div className="ticker" aria-hidden="true">
          <div>
            EDITING <i>✳</i> MOTION <i>✳</i> STORYTELLING <i>✳</i> CREATIVITY{" "}
            <i>✳</i> PRODUCTION <i>✳</i> PRECISION <i>✳</i> EDITING <i>✳</i>{" "}
            MOTION <i>✳</i> STORYTELLING <i>✳</i>
          </div>
        </div>
        <section id="showreel" className="section">
          <div className="heading-split">
            <Heading number="02" kicker="Visual storytelling">
              EVERY FRAME
              <br />
              TELLS A <em>STORY.</em>
            </Heading>
            <p className="side-copy">
              Explore the creative energy, precision, and storytelling behind
              our video production work.

            </p>
          </div>

          <div className="showreel-frame reveal">
            <img src="/images/fullediting.png" alt="Full video editing workspace" loading="lazy" />
          </div>
        </section>
        <section id="about" className="section about">
          <div className="founder-photo reveal">
            <img
              src={company.founderImage}
              alt="Salman Adeeb, CEO of Adeeb Tech Lab"
              loading="lazy"
            />
            <div className="photo-label">
              SALMAN ADEEB<span>FOUNDER / CEO</span>
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
              Adeeb Tech Lab offers video editing and graphic design as
              part of its creative digital work. Led by Salman Adeeb, CEO and
              video editor, this portfolio brings the focus to moving images and
              visual storytelling.
            </p>
            <p className="muted">
              Salman’s official portfolio lists video editing, green screen work
              and animation experience. Our approach begins with your idea:
              finding the rhythm, shaping the narrative and refining the details
              that make a film feel complete.
            </p>
            <div className="production-label">
              <i className="status-dot" /> CRAFTING STORIES FRAME BY FRAME
            </div>
          </div>
        </section>
        <section id="services" className="section">
          <Heading number="04" kicker="Creative capabilities">
            YOUR VISION.
            <br />
            OUR EDITING <em>EXPERTISE.</em>
          </Heading>
          <p className="muted service-note">
            Video editing is a confirmed offering. The formats and finishing
            options below are proposed scopes to discuss for your project.
          </p>
          <div className="services-layout">
            <div className="services-list">
              {services.map((s, i) => {
                const Icon = icons[i];
                return (
                  <button
                    key={s[1]}
                    className={`service-row ${service === i ? "selected" : ""}`}
                    onClick={() => setService(i)}
                    aria-expanded={service === i}
                    aria-controls="service-preview"
                  >
                    <span className="service-number">0{i + 1}</span>
                    <Icon size={22} />
                    <span>{s[1]}</span>
                    <ArrowUpRight size={20} />
                  </button>
                );
              })}
            </div>
            <div className="service-preview" id="service-preview">
              <ServiceArtwork key={service} service={service} />
              <p className="eyebrow">{services[service][3]}</p>
              <h3>{services[service][1]}</h3>
              <p className="muted">{services[service][2]}</p>
              <a href="#contact" className="text-link">
                Discuss this service <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>
        <section id="work" className="section work">
          <div className="heading-split">
            <Heading number="05" kicker="Portfolio / selected projects">
              SELECTED <em>WORK.</em>
            </Heading>
            <p className="side-copy">
              Visual stories crafted with creativity and precision.
              <span>
                Explore our latest videos and play them right here.
              </span>
            </p>
          </div>
          <div className="filters" aria-label="Filter projects">
            {categoryOptions.map((c) => (
              <button
                key={c}
                className={currentFilter === c ? "selected" : ""}
                aria-pressed={currentFilter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="sr-only" role="status">
            {
              visibleProjects.length
            }{" "}
            projects shown
          </p>
          <div className="project-grid">
            {visibleProjects
              .map((p, i) => (
                <button
                  key={p.id}
                  className={`project ${i === 0 ? "featured" : ""}`}
                  data-cursor="VIEW"
                  onClick={() => setVideo(p)}
                  aria-label={`Play ${p.title}`}
                >
                  <div className="project-image">
                    <img
                      src={p.thumbnail}
                      alt={`${p.title} video thumbnail`}
                      loading="lazy"
                    />
                    <span className="sample-tag">{p.isDemo ? 'ORIGINAL SAMPLE' : 'YOUTUBE VIDEO'}</span>
                    <span className="project-play">
                      <Play size={21} fill="currentColor" />
                    </span>
                    <span className="duration">{p.duration}</span>
                  </div>
                  <div className="project-info">
                    <div>
                      <p>{p.category}</p>
                      <h3>{p.title}</h3>
                      <span>{p.description}</span>
                    </div>
                    <ArrowUpRight size={23} />
                  </div>
                </button>
              ))}
          </div>
        </section>
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
        <section id="tools" className="section tools">
          <Heading number="07" kicker="The creative toolkit">
            THE TOOLS BEHIND
            <br />
            THE <em>CREATIVITY.</em>
          </Heading>
          <div className="tool-grid">
            {tools.map((t) => (
              <article className="tool reveal" key={t.name}>
                <span
                  className="tool-mark tool-logo"
                  style={{ borderColor: `${t.color}40` }}
                >
                  <img src={t.logo} alt={`${t.name} logo`} width={56} height={56} loading="lazy" referrerPolicy="no-referrer" />
                </span>
                <h3>{t.name}</h3>
                <p>{t.description}</p>
              </article>
            ))}
          </div>
          <p className="muted">
            Our creative toolkit for editing, color and finishing. Creative
            scopes are discussed per project.
          </p>
          <div className="skills">
            {skills.map((s) => (
              <span key={s}>
                {s}
                <i>↗</i>
              </span>
            ))}
          </div>
        </section>
        <section id="process" className="section">
          <Heading number="08" kicker="Our proposed workflow">
            FROM RAW FOOTAGE
            <br />
            TO FINAL <em>MASTERPIECE.</em>
          </Heading>
          <div className="process-line">
            {stages.map((p, i) => (
              <article className="process-step reveal" key={p.title}>
                <div>
                  <span>0{i + 1}</span>
                  <ArrowUpRight size={22} />
                </div>
                <h3>{p.title}</h3>
                <p>{p.copy}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="comparison" className="section">
          <div className="heading-split">
            <Heading number="09" kicker="The finishing difference">
              SEE THE
              <br />
              <em>TRANSFORMATION.</em>
            </Heading>
            <p className="side-copy">
              Same composition. A different feeling.
              <span>{comparison.label}</span>
            </p>
          </div>
          <div className="comparison reveal" data-cursor="DRAG">
            <img
              className="before"
              src={comparison.before}
              alt="Original graphic with flat neutral color"
              loading="lazy"
            />
            <div
              className="after"
              style={{ clipPath: `inset(0 ${100 - compare}% 0 0)` }}
            >
              <img
                src={comparison.after}
                alt="Same original graphic with cinematic orange color treatment"
                loading="lazy"
              />
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
            Drag, touch, or use the arrow keys. This demonstrates a color
            treatment on an original illustration, not an actual client edit.
          </p>
        </section>
        <section id="why" className="section why">
          <Heading number="10" kicker="A considered approach">
            BUILT FOR STORIES
            <br />
            THAT <em>STAND OUT.</em>
          </Heading>
          <div className="values">
            {values.map((v, i) => (
              <div className="reveal" key={v}>
                <span>0{i + 1}</span>
                <h3>{v}</h3>
                <ArrowUpRight size={20} />
              </div>
            ))}
          </div>
        </section>
        <section id="faq" className="section faq">
          <Heading number="11" kicker="Before we begin">
            GOOD
            <br />
            <em>QUESTIONS.</em>
          </Heading>
          <div>
            {faqs.map(([q, a], i) => (
              <details key={q}>
                <summary>
                  <span className="muted">0{i + 1}</span>
                  {q}
                  <Plus className="plus" size={19} />
                  <Minus className="minus" size={19} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <Contact />
      </main>
      <footer id="footer">
        <div className="footer-film" aria-hidden="true">
          {projects.map((p) => (
            <img key={p.id} src={p.thumbnail} alt="" loading="lazy" />
          ))}
        </div>
        <div className="footer-main">
          <p className="eyebrow">13 / THE NEXT FRAME IS YOURS</p>
          <a href="#contact" className="footer-headline">
            LET’S MAKE
            <br />
            SOMETHING <em>GREAT.</em>
            <ArrowUpRight />
          </a>
          <div className="footer-links">
            <div>
              <strong>{company.name}</strong>
              <p className="brand-tagline">Digital Tech Exper</p>
            </div>
            <div>
              <a href={`mailto:${company.email}`}>
                Email <ArrowUpRight size={15} />
              </a>
              <a
                href={`https://wa.me/${company.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp <ArrowUpRight size={15} />
              </a>
              <a href={company.website} target="_blank" rel="noreferrer">
                Official website <ArrowUpRight size={15} />
              </a>
              {socials.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer">
                  {s.name}
                </a>
              ))}
            </div>
            <div>
              {navigation.slice(1).map(([n, id]) => (
                <a key={id} href={`#${id}`}>
                  {n}
                </a>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>© 2026 Adeeb Tech Lab. All Rights Reserved. <a href="/admin">Admin</a></span>
            <a href="#home">
              Back to top <ArrowUp size={16} />
            </a>
          </div>
        </div>
      </footer>
      <a
        className="floating-contact"
        href="#contact"
        aria-label="Start a project"
      >
        <MessageCircle size={21} />
      </a>
      {video && <VideoModal video={video} onClose={() => setVideo(null)} />}
    </>
  );
}
