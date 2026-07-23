const fs = require('fs');
const file = 'app/globals.css';
let css = fs.readFileSync(file, 'utf8');

const replacements = [
  [
    /\.home-hero \{\s*min-height: calc\(100vh - 78px\);\s*display: grid;\s*grid-template-columns: 1fr 1fr;\s*overflow: hidden;\s*\}/g,
    `.home-hero {\n  min-height: calc(100vh - 78px);\n  display: grid;\n  grid-template-columns: 1fr;\n  overflow: hidden;\n}\n@media (min-width: 1024px) {\n  .home-hero {\n    grid-template-columns: 1fr 1fr;\n  }\n}`
  ],
  [
    /\.hero-proof \{\s*margin-top: clamp\(24px, 2\.5vw, 36px\);\s*padding-top: clamp\(16px, 2vw, 24px\);\s*display: grid;\s*grid-template-columns: repeat\(3, 1fr\);\s*gap: 14px;\s*border-top: 1px solid var\(--line\);\s*\}/g,
    `.hero-proof {\n  margin-top: clamp(24px, 2.5vw, 36px);\n  padding-top: clamp(16px, 2vw, 24px);\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 14px;\n  border-top: 1px solid var(--line);\n}\n@media (min-width: 768px) {\n  .hero-proof {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}`
  ],
  [
    /\.origin-strip__inner \{\s*display: flex;\s*align-items: center;\s*justify-content: space-between;\s*gap: 30px;\s*\}/g,
    `.origin-strip__inner {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 30px;\n}\n@media (min-width: 768px) {\n  .origin-strip__inner {\n    flex-direction: row;\n    align-items: center;\n    justify-content: space-between;\n  }\n}`
  ],
  [
    /\.origin-strip__inner > div \{\s*display: flex;\s*gap: 0;\s*color: var\(--slate-stone\);\s*\}/g,
    `.origin-strip__inner > div {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px 0;\n  color: var(--slate-stone);\n}`
  ],
  [
    /\.section-heading--split \{\s*margin-bottom: 64px;\s*display: flex;\s*align-items: end;\s*justify-content: space-between;\s*gap: 60px;\s*\}/g,
    `.section-heading--split {\n  margin-bottom: 48px;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 24px;\n}\n@media (min-width: 768px) {\n  .section-heading--split {\n    margin-bottom: 64px;\n    flex-direction: row;\n    align-items: end;\n    justify-content: space-between;\n    gap: 60px;\n  }\n}`
  ],
  [
    /\.product-feature__layout \{\s*display: grid;\s*grid-template-columns: 260px minmax\(0, 1fr\) 295px;\s*align-items: start;\s*gap: 34px;\s*\}/g,
    `.product-feature__layout {\n  display: grid;\n  grid-template-columns: 1fr;\n  align-items: start;\n  gap: 34px;\n}\n@media (min-width: 1024px) {\n  .product-feature__layout {\n    grid-template-columns: 260px minmax(0, 1fr) 295px;\n  }\n}`
  ],
  [
    /\.editorial-products \{\s*display: grid;\s*grid-template-columns: 1\.2fr \.9fr;\s*gap: 22px;\s*\}/g,
    `.editorial-products {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 22px;\n}\n@media (min-width: 768px) {\n  .editorial-products {\n    grid-template-columns: 1.2fr .9fr;\n  }\n}`
  ],
  [
    /\.services-showcase \{\s*display: grid;\s*grid-template-columns: 48% 52%;\s*background: #fff;\s*\}/g,
    `.services-showcase {\n  display: grid;\n  grid-template-columns: 1fr;\n  background: #fff;\n}\n@media (min-width: 1024px) {\n  .services-showcase {\n    grid-template-columns: 48% 52%;\n  }\n}`
  ],
  [
    /\.service-list \{\s*margin: clamp\(16px, 3vw, 32px\) 0;\s*display: grid;\s*grid-template-columns: 1fr 1fr;\s*gap: 0 28px;\s*\}/g,
    `.service-list {\n  margin: clamp(16px, 3vw, 32px) 0;\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 14px 28px;\n}\n@media (min-width: 768px) {\n  .service-list {\n    grid-template-columns: 1fr 1fr;\n    gap: 0 28px;\n  }\n}`
  ],
  [
    /\.process-band ol \{\s*margin: 0;\s*padding: 0;\s*display: grid;\s*grid-template-columns: repeat\(5, 1fr\);\s*list-style: none;\s*\}/g,
    `.process-band ol {\n  margin: 0;\n  padding: 0;\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 32px;\n  list-style: none;\n}\n@media (min-width: 1024px) {\n  .process-band ol {\n    grid-template-columns: repeat(5, 1fr);\n    gap: 0;\n  }\n}`
  ],
  [
    /\.process-band li i::after \{\s*content: "";\s*position: absolute;\s*top: 0;\s*left: 0;\s*right: 0;\s*height: 1px;\s*background: var\(--gold\);\s*z-index: 1;\s*\}/g,
    `.process-band li i::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 1px;\n  background: var(--gold);\n  z-index: 1;\n}\n@media (max-width: 1023px) {\n  .process-band li i::after {\n    display: none;\n  }\n}`
  ],
  [
    /\.trust-section \{\s*padding: 0;\s*display: grid;\s*grid-template-columns: 42% 58%;\s*min-height: calc\(100vh - 78px\);\s*overflow: hidden;\s*\}/g,
    `.trust-section {\n  padding: 0;\n  display: flex;\n  flex-direction: column-reverse;\n  min-height: auto;\n  overflow: hidden;\n}\n@media (min-width: 1024px) {\n  .trust-section {\n    display: grid;\n    grid-template-columns: 42% 58%;\n    min-height: calc(100vh - 78px);\n  }\n}`
  ],
  [
    /\.insights-home__grid \{\s*display: grid;\s*grid-template-columns: 1\.25fr \.75fr;\s*gap: 38px 48px;\s*\}/g,
    `.insights-home__grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 38px;\n}\n@media (min-width: 1024px) {\n  .insights-home__grid {\n    grid-template-columns: 1.25fr .75fr;\n    gap: 38px 48px;\n  }\n}`
  ],
  [
    /\.quote-cta \{\s*display: grid;\s*grid-template-columns: 54% 46%;\s*min-height: calc\(100vh - 78px\);\s*background: var\(--gold\);\s*overflow: hidden;\s*\}/g,
    `.quote-cta {\n  display: flex;\n  flex-direction: column-reverse;\n  min-height: auto;\n  background: var(--gold);\n  overflow: hidden;\n}\n@media (min-width: 1024px) {\n  .quote-cta {\n    display: grid;\n    grid-template-columns: 54% 46%;\n    min-height: calc(100vh - 78px);\n  }\n}`
  ],
  [
    /\.site-footer__grid \{\s*padding: 70px 0 58px;\s*display: grid;\s*grid-template-columns: 1\.6fr repeat\(3, 1fr\);\s*gap: 52px;\s*\}/g,
    `.site-footer__grid {\n  padding: 70px 0 58px;\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 52px;\n}\n@media (min-width: 768px) {\n  .site-footer__grid {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n@media (min-width: 1024px) {\n  .site-footer__grid {\n    grid-template-columns: 1.6fr repeat(3, 1fr);\n  }\n}`
  ],
  [
    /\.product-grid \{\s*display: grid;\s*grid-template-columns: repeat\(3, 1fr\);\s*gap: 28px;\s*\}/g,
    `.product-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 28px;\n}\n@media (min-width: 768px) {\n  .product-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (min-width: 1024px) {\n  .product-grid {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}`
  ],
  [
    /\.product-detail-hero__grid \{\s*margin-top: 30px;\s*display: grid;\s*grid-template-columns: 1\.15fr \.85fr;\s*gap: 64px;\s*align-items: center;\s*\}/g,
    `.product-detail-hero__grid {\n  margin-top: 30px;\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 40px;\n  align-items: center;\n}\n@media (min-width: 1024px) {\n  .product-detail-hero__grid {\n    grid-template-columns: 1.15fr .85fr;\n    gap: 64px;\n  }\n}`
  ],
  [
    /\.product-spec-layout \{\s*display: grid;\s*grid-template-columns: \.85fr 1\.15fr;\s*gap: 90px;\s*\}/g,
    `.product-spec-layout {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 48px;\n}\n@media (min-width: 1024px) {\n  .product-spec-layout {\n    grid-template-columns: .85fr 1.15fr;\n    gap: 90px;\n  }\n}`
  ],
  [
    /\.services-page__intro \{\s*display: grid;\s*grid-template-columns: \.75fr 1\.25fr;\s*gap: 70px;\s*align-items: center;\s*\}/g,
    `.services-page__intro {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 40px;\n  align-items: center;\n}\n@media (min-width: 1024px) {\n  .services-page__intro {\n    grid-template-columns: .75fr 1.25fr;\n    gap: 70px;\n  }\n}`
  ],
  [
    /\.services-page__list \{\s*margin-top: 72px;\s*display: grid;\s*grid-template-columns: 1fr 1fr;\s*gap: 0 54px;\s*border-top: 1px solid var\(--line\);\s*\}/g,
    `.services-page__list {\n  margin-top: 72px;\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 32px;\n  border-top: 1px solid var(--line);\n}\n@media (min-width: 768px) {\n  .services-page__list {\n    grid-template-columns: 1fr 1fr;\n    gap: 0 54px;\n  }\n}`
  ],
  [
    /\.process-detail ol \{\s*margin: 0 0 40px;\s*padding: 0;\s*display: grid;\s*grid-template-columns: repeat\(5, 1fr\);\s*list-style: none;\s*border-top: 1px solid rgb\(255 255 255 \/ 25%\);\s*\}/g,
    `.process-detail ol {\n  margin: 0 0 40px;\n  padding: 0;\n  display: grid;\n  grid-template-columns: 1fr;\n  list-style: none;\n  border-top: 1px solid rgb(255 255 255 / 25%);\n}\n@media (min-width: 1024px) {\n  .process-detail ol {\n    grid-template-columns: repeat(5, 1fr);\n  }\n}`
  ],
  [
    /\.about-story__grid \{\s*display: grid;\s*grid-template-columns: \.9fr 1\.1fr;\s*gap: 70px;\s*align-items: center;\s*\}/g,
    `.about-story__grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 40px;\n  align-items: center;\n}\n@media (min-width: 1024px) {\n  .about-story__grid {\n    grid-template-columns: .9fr 1.1fr;\n    gap: 70px;\n  }\n}`
  ],
  [
    /\.principles>\.container \{\s*display: grid;\s*grid-template-columns: repeat\(3, 1fr\);\s*gap: 0;\s*\}/g,
    `.principles>.container {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 24px;\n}\n@media (min-width: 1024px) {\n  .principles>.container {\n    grid-template-columns: repeat(3, 1fr);\n    gap: 0;\n  }\n}`
  ],
  [
    /\.about-note>\.container \{\s*padding: 42px;\s*display: grid;\s*grid-template-columns: \.7fr 1\.3fr;\s*gap: 50px;\s*border: 1px solid var\(--line\);\s*border-radius: var\(--radius\);\s*\}/g,
    `.about-note>.container {\n  padding: 32px 24px;\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 32px;\n  border: 1px solid var(--line);\n  border-radius: var(--radius);\n}\n@media (min-width: 768px) {\n  .about-note>.container {\n    padding: 42px;\n    grid-template-columns: .7fr 1.3fr;\n    gap: 50px;\n  }\n}`
  ],
  [
    /\.insight-list \{\s*display: grid;\s*grid-template-columns: 1fr 1fr;\s*gap: 54px 36px;\s*\}/g,
    `.insight-list {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 48px;\n}\n@media (min-width: 768px) {\n  .insight-list {\n    grid-template-columns: 1fr 1fr;\n    gap: 54px 36px;\n  }\n}`
  ],
  [
    /\.insight-list article \{\s*display: grid;\s*grid-template-columns: \.85fr 1\.15fr;\s*gap: 24px;\s*align-items: center;\s*\}/g,
    `.insight-list article {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 24px;\n  align-items: start;\n}\n@media (min-width: 1024px) {\n  .insight-list article {\n    grid-template-columns: .85fr 1.15fr;\n    align-items: center;\n  }\n}`
  ],
  [
    /\.contact-layout,\s*\n\.quote-layout \{\s*display: grid;\s*grid-template-columns: \.78fr 1\.22fr;\s*gap: 54px;\s*align-items: start;\s*\}/g,
    `.contact-layout,\n.quote-layout {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 40px;\n  align-items: start;\n}\n@media (min-width: 1024px) {\n  .contact-layout,\n  .quote-layout {\n    grid-template-columns: .78fr 1.22fr;\n    gap: 54px;\n  }\n}`
  ],
  [
    /\.admin-stats \{\s*display: grid;\s*grid-template-columns: repeat\(4, 1fr\);\s*gap: 16px;\s*margin-bottom: 24px;\s*\}/g,
    `.admin-stats {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n  margin-bottom: 24px;\n}\n@media (min-width: 768px) {\n  .admin-stats {\n    grid-template-columns: repeat(4, 1fr);\n  }\n}`
  ],
  [
    /\.admin-panels \{\s*display: grid;\s*grid-template-columns: 1fr 1fr;\s*gap: 24px;\s*\}/g,
    `.admin-panels {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 24px;\n}\n@media (min-width: 1024px) {\n  .admin-panels {\n    grid-template-columns: 1fr 1fr;\n  }\n}`
  ],
  [
    /\.product-gallery-grid \{\s*display: grid;\s*grid-template-columns: repeat\(3, 1fr\);\s*gap: 22px;\s*\}/g,
    `.product-gallery-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 22px;\n}\n@media (min-width: 768px) {\n  .product-gallery-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (min-width: 1024px) {\n  .product-gallery-grid {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}`
  ],
  [
    /\.desktop-nav \{\s*display: flex;\s*align-items: stretch;\s*gap: 28px;\s*height: 100%;\s*\}/g,
    `.desktop-nav {\n  display: none;\n}\n@media (min-width: 1024px) {\n  .desktop-nav {\n    display: flex;\n    align-items: stretch;\n    gap: 28px;\n    height: 100%;\n  }\n}`
  ],
  [
    /\.site-header__actions \{\s*display: flex;\s*align-items: center;\s*gap: 18px;\s*\}/g,
    `.site-header__actions {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n@media (min-width: 1024px) {\n  .site-header__actions {\n    gap: 18px;\n  }\n}`
  ],
  [
    /\.admin-link \{\s*display: inline-flex;\s*align-items: center;\s*gap: 7px;\s*color: var\(--slate-ink\);\s*font-size: 13px;\s*\}/g,
    `.admin-link {\n  display: none;\n}\n@media (min-width: 1024px) {\n  .admin-link {\n    display: inline-flex;\n    align-items: center;\n    gap: 7px;\n    color: var(--slate-ink);\n    font-size: 13px;\n  }\n}`
  ],
  [
    /\.menu-button \{\s*display: none;\s*border: 0;\s*background: none;\s*color: var\(--forest\);\s*padding: 8px;\s*\}/g,
    `.menu-button {\n  display: block;\n  border: 0;\n  background: none;\n  color: var(--forest);\n  padding: 8px;\n  min-height: 44px;\n  min-width: 44px;\n}\n@media (min-width: 1024px) {\n  .menu-button {\n    display: none;\n  }\n}`
  ],
  [
    /\.mobile-nav \{\s*display: none;\s*\}/g,
    `.mobile-nav {\n  display: flex;\n  flex-direction: column;\n  padding: 16px 24px 32px;\n  gap: 16px;\n  background: white;\n  border-bottom: 1px solid var(--line);\n}\n.mobile-nav a {\n  font-weight: 600;\n  padding: 12px 0;\n  color: var(--ink-soft);\n}\n@media (min-width: 1024px) {\n  .mobile-nav {\n    display: none;\n  }\n}`
  ]
];

replacements.forEach(([pattern, replacement]) => {
  const original = css;
  css = css.replace(pattern, replacement);
  if (css === original) {
    console.warn('Could not find match for pattern:', pattern);
  } else {
    console.log('Replaced pattern successfully.');
  }
});

fs.writeFileSync(file, css, 'utf8');
console.log('CSS responsive overrides applied.');
