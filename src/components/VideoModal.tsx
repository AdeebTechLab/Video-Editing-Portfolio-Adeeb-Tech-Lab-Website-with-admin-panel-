"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Video } from "@/data/portfolio";
import { youtubeId } from '@/lib/youtube';
export default function VideoModal({
  video,
  onClose,
}: {
  video: Video;
  onClose: () => void;
}) {
  const box = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState("Loading video…");
  useEffect(() => {
    const old = document.activeElement as HTMLElement;
    box.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      old?.focus();
    };
  }, []);
  let embed = "";
  try {
    const u = new URL(video.videoUrl);
    if (video.videoType === "youtube") {
      const id = youtubeId(video.videoUrl);
      if (id && /^[\w-]{11}$/.test(id))
        embed = `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (video.videoType === "vimeo") {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id))
        embed = `https://player.vimeo.com/video/${id}`;
    }
  } catch {}
  return (
    <dialog
      ref={box}
      className="video-modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="video-title"
    >
      <div className="modal-inner">
        <div className="modal-top">
          <div>
            <p className="eyebrow">
              {video.isDemo ? "Original motion sample" : "Portfolio film"}
            </p>
            <h3 id="video-title">{video.title}</h3>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close video"
          >
            <X />
          </button>
        </div>
        {video.videoType === "mp4" ? (
          <video
            key={video.id}
            controls
            playsInline
            preload="metadata"
            poster={video.thumbnail}
            onLoadedData={() => setStatus("")}
            onLoadedMetadata={() => setStatus("")}
            onError={() =>
              setStatus(
                "This video could not load. Please contact the studio or try again.",
              )
            }
          >
            <source src={video.videoUrl} type="video/mp4" />
            <track
              kind="captions"
              src="/videos/samples.vtt"
              srcLang="en"
              label="English"
              default
            />
          </video>
        ) : embed ? (
          <iframe
            src={embed}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={() => setStatus("")}
          />
        ) : (
          <p>Invalid video link. Please update the portfolio data.</p>
        )}
        <p role="status" className="player-status">
          {status}
        </p>
        <p className="muted">
          {video.description}
          {video.isDemo
            ? " This is an original website demonstration, not client work."
            : ""}
        </p>
        {video.videoType === 'youtube' && embed && <a className="text-link" href={video.videoUrl} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>}
      </div>
    </dialog>
  );
}
