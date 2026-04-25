import type { TarotOrientation } from "@/lib/tarot";
import { getOrientationLabel } from "@/lib/tarot";

type TarotCardVisualProps = {
  title: string;
  subtitle?: string;
  orientation?: TarotOrientation;
  compact?: boolean;
};

export function TarotCardVisual({
  title,
  subtitle = "Original Tarot",
  orientation = "unknown",
  compact = false,
}: TarotCardVisualProps) {
  const isReversed = orientation === "reversed";

  return (
    <div
      className={`tarot-reference-card ${compact ? "tarot-reference-card-compact" : ""}`}
      aria-label={`${title} ${getOrientationLabel(orientation)} 예시 카드`}
    >
      <div className={isReversed ? "tarot-reference-card-inner is-reversed" : "tarot-reference-card-inner"}>
        <div className="tarot-reference-moon">☾</div>
        <div className="tarot-reference-stars">✦ ✧ ✦</div>
        <div className="tarot-reference-window">
          <span />
        </div>
        <div className="tarot-reference-title">{title || "Card"}</div>
        <div className="tarot-reference-subtitle">{subtitle}</div>
      </div>
      <span className="tarot-reference-orientation">
        {getOrientationLabel(orientation)}
      </span>
    </div>
  );
}
