import {
  Aperture,
  AudioLines,
  Camera,
  CirclePlay,
  Clapperboard,
  Film,
  Layers,
  Megaphone,
  Mic,
  MonitorPlay,
  Music,
  Palette,
  Scissors,
  Smartphone,
  Sparkles,
  Type,
  Video,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react'

/** Icons an admin can pick for a service. */
export const SERVICE_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  film: { icon: Film, label: 'Film strip (video editing)' },
  'monitor-play': { icon: MonitorPlay, label: 'Screen (YouTube & long-form)' },
  smartphone: { icon: Smartphone, label: 'Phone (reels & shorts)' },
  layers: { icon: Layers, label: 'Layers (motion graphics)' },
  palette: { icon: Palette, label: 'Palette (colour & finishing)' },
  'audio-lines': { icon: AudioLines, label: 'Sound waves (audio)' },
  clapperboard: { icon: Clapperboard, label: 'Clapperboard (promotional & cinematic)' },
  mic: { icon: Mic, label: 'Microphone (podcasts)' },
  sparkles: { icon: Sparkles, label: 'Sparkles (transitions & effects)' },
  video: { icon: Video, label: 'Video camera' },
  camera: { icon: Camera, label: 'Camera' },
  aperture: { icon: Aperture, label: 'Aperture (cinematography)' },
  scissors: { icon: Scissors, label: 'Scissors (cutting)' },
  'circle-play': { icon: CirclePlay, label: 'Play button' },
  music: { icon: Music, label: 'Music' },
  type: { icon: Type, label: 'Text (typography & subtitles)' },
  wand: { icon: WandSparkles, label: 'Magic wand (VFX)' },
  megaphone: { icon: Megaphone, label: 'Megaphone (ads & marketing)' },
}

export function ServiceIcon({ name, size, className }: { name: string; size?: number; className?: string }) {
  const Icon = SERVICE_ICONS[name]?.icon ?? Film
  return <Icon size={size} className={className} />
}
