import type { Video } from '@/data/portfolio';

export function cleanCategory(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function activeCategories(videos: Pick<Video, 'category'>[]) {
  const names = new Map<string, string>();
  for (const video of videos) {
    const name = cleanCategory(video.category);
    if (name && name.toLowerCase() !== 'all projects' && !names.has(name.toLowerCase())) {
      names.set(name.toLowerCase(), name);
    }
  }
  return [...names.values()];
}
