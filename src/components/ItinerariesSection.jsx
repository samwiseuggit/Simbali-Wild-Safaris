import { useState } from 'react';
import { itineraries } from '../data/itineraries';

const countryImages = {
  Kenya: "/images/giraffes-savanna-safari-simbali-wild-safaris.jpg",
  Tanzania: "/images/zebras-savanna-safari-simbali-wild-safaris.jpg",
  Uganda: "/images/uganda-safari.jpg",
  Rwanda: "/images/rwanda-safari.jpg",
  Burundi: "/images/burundi-safari.jpg",
};

const itinImages = {
  "kenya-honeymoon-8": "/images/itin-kenya-honeymoon.jpg",
  "kenya-family-8": "/images/itin-kenya-family.jpg",
  "kenya-tanzania-family-11": "/images/itin-kenya-tanzania-family.jpg",
  "tanzania-family-8": "/images/itin-tanzania-family.jpg",
  "tanzania-honeymoon-8": "/images/itin-tanzania-honeymoon.jpg",
};

function ItineraryCard({ itin }) {
  const [open, setOpen] = useState(false);
  const img = itinImages[itin.id] || countryImages[itin.country];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-3 shadow-sm">
      {/* Card header - responsive: stacked on mobile, row on sm+ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4">
        {/* Image - smaller on mobile, larger on desktop */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <img
            src={img}
            alt={itin.title}
            className="w-full sm:w-20 md:w-24 h-40 sm:h-20 md:h-24 rounded-lg object-cover"
          />
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sage text-olive">
              {itin.type}
            </span>
            <span className="text-[11px] text-[#999]">{itin.duration}</span>
          </div>
          <h4 className="font-belleza text-base md:text-lg text-[#1a1a1a] leading-snug">
            {itin.title}
          </h4>
        </div>
        {/* Toggle button */}
        <button
          onClick={() => setOpen(!open)}
          className="text-olive text-xs font-semibold hover:underline flex-shrink-0 bg-sage/30 px-4 py-2 rounded-full transition-colors hover:bg-sage/50 mx-auto sm:mx-0 whitespace-nowrap"
        >
          {open ? "Hide Details" : "View Details"}
        </button>
      </div>

      {/* Expandable details */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4">
          <p className="text-[#555] text-sm leading-relaxed mb-3">{itin.description}</p>

          {/* Highlights */}
          <div className="mb-3">
            <span className="text-[11px] text-olive font-semibold uppercase tracking-wider">
              Highlights
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {itin.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[11px] text-[#555] bg-[#f5f7f3] px-2.5 py-1 rounded-full"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing + Link - stacked on mobile, row on sm+ */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-xs text-[#999] text-center sm:text-left">{itin.pricingNote}</span>
            <a
              href={`/itineraries#${itin.id}`}
              className="text-xs text-olive font-semibold hover:underline text-center sm:text-right whitespace-nowrap"
            >
              View Full Itinerary &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ItinerariesSection() {
  const [openCountries, setOpenCountries] = useState({
    Kenya: true,
    Tanzania: true,
    Uganda: true,
    Rwanda: true,
    Burundi: true,
  });
  const toggleCountry = (country) =>
    setOpenCountries((prev) => ({ ...prev, [country]: !prev[country] }));

  const countriesWithItins = [
    {
      name: "Kenya",
      itins: itineraries.filter((i) => i.country === "Kenya"),
      hasItins: true,
    },
    {
      name: "Tanzania",
      itins: itineraries.filter((i) => i.country === "Tanzania"),
      hasItins: true,
    },
    { name: "Uganda", itins: [], hasItins: false },
    { name: "Rwanda", itins: [], hasItins: false },
    { name: "Burundi", itins: [], hasItins: false },
  ];

  return (
    <section className="pt-20 pb-10 bg-white">
      <div className="container-main px-4 sm:px-6">
        <div className="accent-line-center" />
        <h2 className="font-belleza text-2xl md:text-3xl text-center mb-4 tracking-[0.1em] uppercase">
          Curated Safari Itineraries
        </h2>
        <p className="text-[#555] text-sm text-center max-w-xl mx-auto mb-10 leading-relaxed px-4">
          Thoughtfully designed journeys through East Africa&apos;s most spectacular
          destinations.
        </p>

        <div className="max-w-3xl mx-auto space-y-3">
          {countriesWithItins.map((c) => {
            const isOpen = openCountries[c.name];
            return (
              <div key={c.name} className="rounded-xl overflow-hidden">
                {/* Country header - responsive */}
                <button
                  onClick={() => toggleCountry(c.name)}
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-olive hover:bg-olive-dark rounded-xl cursor-pointer border-none transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <img
                      src={countryImages[c.name]}
                      alt={c.name}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white/30 flex-shrink-0"
                    />
                    <span className="font-belleza text-sm sm:text-base tracking-[0.12em] uppercase text-white truncate">
                      {c.name}
                    </span>
                    {c.hasItins && (
                      <span className="text-[10px] sm:text-[11px] text-white/70 bg-white/20 px-2 py-0.5 rounded-full flex-shrink-0">
                        {c.itins.length}{" "}
                        {c.itins.length === 1 ? "Itinerary" : "Itineraries"}
                      </span>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-white/70 transition-transform flex-shrink-0 ml-2 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Country content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "max-h-[3000px] opacity-100 pt-2 sm:pt-3"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {c.hasItins ? (
                    c.itins.map((itin) => (
                      <ItineraryCard key={itin.id} itin={itin} />
                    ))
                  ) : (
                    <div className="py-6 px-4 text-center bg-sage/20 rounded-xl mt-1">
                      <p className="text-[#999] text-sm">
                        Itineraries for {c.name} coming soon.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <a
            href="/itineraries"
            className="btn-primary inline-flex text-sm sm:text-base"
          >
            View All Itineraries
          </a>
        </div>
      </div>
    </section>
  );
}
