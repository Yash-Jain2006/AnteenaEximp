export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  sections: { heading: string; body: string }[];
}

export const insights: Insight[] = [
  {
    slug: "evaluate-indian-agricultural-supplier",
    title: "How to evaluate an Indian agricultural supplier",
    excerpt: "A practical framework for reviewing specification discipline, documentation, communication, and shipment readiness.",
    category: "Buyer Guide",
    readTime: "6 min read",
    date: "2026-06-18",
    image: "/images/about/quality-inspection.webp",
    sections: [
      {
        heading: "Start with the specification",
        body: "A credible supplier should convert a general product request into measurable requirements: grade, moisture, purity, crop year, packing, inspection method, and permitted tolerances.",
      },
      {
        heading: "Review documents before ordering",
        body: "Ask which origin, quality, phytosanitary, and shipping documents apply to the destination. Names and requirements vary by product and country, so assumptions should be resolved before confirmation.",
      },
      {
        heading: "Test the communication process",
        body: "Response quality matters as much as response speed. Look for clear ownership, written confirmations, sample traceability, and a practical escalation route for changes.",
      },
    ],
  },
  {
    slug: "grades-packing-minimum-orders",
    title: "Understanding grades, packing, and minimum orders",
    excerpt: "How common commercial terms affect comparison, landed cost, shelf life, and purchasing decisions.",
    category: "Sourcing Basics",
    readTime: "7 min read",
    date: "2026-05-27",
    image: "/images/categories/grains.webp",
    sections: [
      {
        heading: "Grade names are not enough",
        body: "Trade names can differ between suppliers. Compare measurable values and approved samples rather than relying on grade labels alone.",
      },
      {
        heading: "Packing changes the programme",
        body: "Material, bag size, liner, palletisation, artwork, and destination labelling affect cost, lead time, and container utilisation.",
      },
      {
        heading: "Minimum order is product-specific",
        body: "MOQ depends on processing, packing, consolidation, season, and shipping mode. Share an indicative annual requirement even when the first order is smaller.",
      },
    ],
  },
  {
    slug: "export-documentation-checklist",
    title: "A buyer's checklist for export documentation",
    excerpt: "The commercial, origin, quality, and transport records to align before an agricultural shipment moves.",
    category: "Documentation",
    readTime: "8 min read",
    date: "2026-04-11",
    image: "/images/cta/commodities.webp",
    sections: [
      {
        heading: "Commercial documents",
        body: "Confirm the pro forma invoice, commercial invoice, packing list, payment terms, Incoterm, and consignee details before dispatch.",
      },
      {
        heading: "Product and origin records",
        body: "The applicable certificate of origin, phytosanitary certificate, inspection report, fumigation record, or analysis certificate depends on the commodity and destination.",
      },
      {
        heading: "Transport documents",
        body: "Review bill of lading instructions, container and seal details, insurance responsibility, and the document-release method before cargo handover.",
      },
    ],
  },
];

export const getInsight = (slug: string) => insights.find((item) => item.slug === slug);
