import Image from "next/image";
import type { Testimonial } from "@/lib/cms/types";
import { RatingStars } from "@/components/testimonials/RatingStars";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="testimonial-card" tabIndex={0}>
      <header>
        <div className="testimonial-card__avatar" aria-hidden="true">
          {testimonial.photoUrl ? (
            <Image src={testimonial.photoUrl} alt="" fill sizes="56px" />
          ) : (
            <span>{initials(testimonial.customerName)}</span>
          )}
        </div>
        <div>
          <strong>{testimonial.customerName}</strong>
          <small>
            {testimonial.company}, {testimonial.country}
          </small>
        </div>
      </header>
      <RatingStars rating={testimonial.rating} />
      <p>{testimonial.review}</p>
      <footer>
        <span>Imported Product</span>
        <strong>{testimonial.product}</strong>
      </footer>
    </article>
  );
}
