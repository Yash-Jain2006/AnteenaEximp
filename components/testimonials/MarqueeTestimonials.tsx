import type { Testimonial } from "@/lib/cms/types";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";

export function MarqueeTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const visibleTestimonials = testimonials.filter((testimonial) => testimonial.visible);

  if (!visibleTestimonials.length) return null;

  return (
    <section className="section testimonials-section" aria-labelledby="testimonials-heading">
      <div className="container">
        <div className="section-heading testimonials-section__heading">
          <h2 id="testimonials-heading">Trusted by Importers Worldwide</h2>
          <p>
            See why buyers across multiple countries trust Anteena Eximp for quality products, transparent communication,
            and reliable export services.
          </p>
        </div>
      </div>
      <div className="testimonial-marquee" aria-label="Customer testimonials">
        <div className="testimonial-marquee__track">
          {[...visibleTestimonials, ...visibleTestimonials].map((testimonial, index) => (
            <div className="testimonial-marquee__item" key={`${testimonial.id}-${index}`} aria-hidden={index >= visibleTestimonials.length}>
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
