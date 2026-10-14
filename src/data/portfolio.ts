export type Video = {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  videoType: "mp4" | "youtube" | "vimeo";
  duration?: string;
  featured: boolean;
  isDemo: boolean;
};
export const company = {
  name: "Adeeb Tech Lab",
  founder: "Salman Adeeb",
  role: "Founder / CEO",
  email: "info.AdeebTechLab@gmail.com",
  phone: "+92 3092333121",
  whatsapp: "923092333121",
  location: "Bahawalpur, Pakistan",
  website: "https://adeebtechlab.com/",
  logo: "/images/logo.png",
  founderImage: "/images/founder.jpg",
};
export const socials = [
  { name: "Instagram", url: "https://www.instagram.com/adeebtechlab/" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/AdeebTechnologyLab/",
  },
  { name: "YouTube", url: "https://www.youtube.com/AdeebTechnologyLab" },
  { name: "Facebook", url: "https://web.facebook.com/AdeebTechnologyLab" },
  { name: "TikTok", url: "https://www.tiktok.com/@adeebtechnologylab" },
];
export const categories = [
  "All Projects",
  "YouTube Videos",
  "Short-Form Content",
  "Promotional Videos",
  "Motion Graphics",
  "Other Editing Work",
];
export const projects: Video[] = [
  {
    id: "signal",
    title: "Signal / in motion",
    category: "Motion Graphics",
    description: "An original study in light, rhythm and kinetic composition.",
    thumbnail: "/images/signal.jpg",
    videoUrl: "/videos/signal.mp4",
    videoType: "mp4",
    duration: "0:08",
    featured: true,
    isDemo: true,
  },
  {
    id: "orbit",
    title: "Orbit / a new perspective",
    category: "Promotional Videos",
    description:
      "An abstract product-film concept with a cinematic visual language.",
    thumbnail: "/images/orbit.jpg",
    videoUrl: "/videos/orbit.mp4",
    videoType: "mp4",
    duration: "0:08",
    featured: false,
    isDemo: true,
  },
  {
    id: "pulse",
    title: "Pulse / made to move",
    category: "Short-Form Content",
    description: "A short-format motion experiment for fast-moving feeds.",
    thumbnail: "/images/pulse.jpg",
    videoUrl: "/videos/pulse.mp4",
    videoType: "mp4",
    duration: "0:08",
    featured: false,
    isDemo: true,
  },
  {
    id: "sequence",
    title: "Sequence / the visual essay",
    category: "YouTube Videos",
    description:
      "A widescreen sequencing concept exploring pace and visual continuity.",
    thumbnail: "/images/sequence.jpg",
    videoUrl: "/videos/sequence.mp4",
    videoType: "mp4",
    duration: "0:08",
    featured: false,
    isDemo: true,
  },
  {
    id: "spectrum",
    title: "Spectrum / color stories",
    category: "Other Editing Work",
    description: "An original color and texture experiment.",
    thumbnail: "/images/spectrum.jpg",
    videoUrl: "/videos/spectrum.mp4",
    videoType: "mp4",
    duration: "0:08",
    featured: false,
    isDemo: true,
  },
];
export const services = [
  [
    "Film",
    "Video editing",
    "Purposeful cuts, considered pacing and a clear visual story.",
    "Confirmed offering",
  ],
  [
    "MonitorPlay",
    "YouTube & long-form",
    "A proposed format: structure, clarity and engaging visual rhythm.",
    "Discuss your brief",
  ],
  [
    "Smartphone",
    "Reels & shorts",
    "A proposed format: focused storytelling for vertical screens.",
    "Discuss your brief",
  ],
  [
    "Layers",
    "Motion graphics",
    "Explore animated titles, graphic sequences and visual accents.",
    "Discuss your brief",
  ],
  [
    "Palette",
    "Color & finishing",
    "Explore correction, cohesive color and a polished final presentation.",
    "Discuss your brief",
  ],
  [
    "AudioLines",
    "Sound & synchronization",
    "Explore balanced audio, music timing and seamless synchronization.",
    "Discuss your brief",
  ],
  [
    "Clapperboard",
    "Promotional & cinematic",
    "Explore campaign films, trailers and atmospheric storytelling.",
    "Discuss your brief",
  ],
  [
    "Mic",
    "Podcast editing",
    "Explore multi-camera pacing and a clear listening experience.",
    "Discuss your brief",
  ],
  [
    "Sparkles",
    "Transitions & effects",
    "Explore motivated transitions, compositing and green screen work.",
    "Discuss your brief",
  ],
];
export const tools = [
  {
    name: "Premiere Pro",
    logo: "/images/tools/premiere-pro.jpg",
    color: "#9b5cff",
    description: "Sequencing, cutting and editorial workflows.",
  },
  {
    name: "DaVinci Resolve",
    logo: "/images/tools/davinci-resolve.jpg",
    color: "#59c9ff",
    description: "Video editing, cinematic color grading and audio finishing.",
  },
  {
    name: "Filmora",
    logo: "/images/tools/filmora.jpg",
    color: "#00d9c3",
    description: "Creative video assembly and finishing.",
  },
];
export const skills = [
  "Video cutting",
  "Storytelling",
  "Transitions",
  "Typography animation",
  "Green screen editing",
  "Visual effects",
  "Audio editing",
  "Color correction",
];
export const process = [
  {
    title: "Discover",
    copy: "Understand your creative vision, audience and project goals.",
  },
  {
    title: "Plan",
    copy: "Define the visual direction, references and editing approach.",
  },
  {
    title: "Edit",
    copy: "Shape the story through sequencing, timing, transitions and sound.",
  },
  {
    title: "Enhance",
    copy: "Refine the graphics, effects, color and finishing details.",
  },
  {
    title: "Deliver",
    copy: "Prepare the final video for your intended platform.",
  },
];
export const values = [
  "Creative thinking",
  "Attention to detail",
  "Visual storytelling",
  "Platform-aware editing",
  "Professional presentation",
  "Collaborative workflow",
];
export const faqs = [
  [
    "What types of videos can you edit?",
    "Video editing is a confirmed company service. Share your format, footage and goals so we can discuss the right approach for your project.",
  ],
  [
    "Can you edit YouTube Shorts and Instagram Reels?",
    "Tell us your platform, target length and reference style. We will discuss the scope and suitability of a vertical edit with you.",
  ],
  [
    "How can I submit my footage?",
    "Start with an inquiry. We can then agree on a suitable file-transfer method. Please do not send private footage through this website form.",
  ],
  [
    "Can I request revisions?",
    "Discuss feedback rounds, deliverables and revision expectations when agreeing the project scope. No fixed revision policy is assumed here.",
  ],
  [
    "How long does a project take?",
    "Timing depends on footage volume, complexity and availability. A schedule can be agreed after reviewing your brief.",
  ],
  [
    "How do I request a quotation?",
    "Use the project inquiry below or contact us by email or WhatsApp. Include your format, intended length, deadline and available footage.",
  ],
];
export const comparison = {
  before: "/images/comparison.jpg",
  after: "/images/comparison.jpg",
  label: "Original graphic color study · sample comparison",
};
export const navigation = [
  ["Home", "home"],
  ["Showreel", "showreel"],
  ["About", "about"],
  ["Services", "services"],
  ["Work", "work"],
  ["Process", "process"],
  ["Contact", "contact"],
];
