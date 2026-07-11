import { Star } from "lucide-react";

export function RatingStars({ rating }: { rating: number }) {
  const safeRating = Math.max(1, Math.min(5, Math.round(rating)));

  return (
    <div className="rating-stars" aria-label={`${safeRating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} aria-hidden="true" className={index < safeRating ? "is-filled" : undefined} size={16} />
      ))}
    </div>
  );
}
