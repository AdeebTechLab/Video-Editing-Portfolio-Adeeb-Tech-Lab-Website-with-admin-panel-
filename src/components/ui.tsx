import { Play } from "lucide-react";
export function Heading({
  number,
  kicker,
  children,
}: {
  number: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-heading reveal">
      <p className="eyebrow">
        <span>{number} /</span> {kicker}
      </p>
      <h2>{children}</h2>
    </div>
  );
}
export function PlayButton({
  onClick,
  label = "Play sample film",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button className="play" aria-label={label} onClick={onClick}>
      <Play size={24} fill="currentColor" />
    </button>
  );
}
