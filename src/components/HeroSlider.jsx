import { useState, useEffect, useCallback } from 'react';

const slides = [
  { img: "/images/african-elephant-waterhole-safari-simbali-wild-safaris_Slid_1.jpg", title: "Heart of the Delta", desc: "Explore the lush paradise of the Okavango Delta, where life flourishes in a timeless rhythm of water and wildlife." },
  { img: "/images/coastal-seabirds-flight-simbali-wild-safaris_Slide_2.jpg", title: "Aerial Grace in Motion", desc: "Witness the breathtaking flight of birds soaring over African skies \u2013 a symphony of color, freedom, and instinct." },
  { img: "/images/hippos-river-safari-simbali-wild-safaris.jpg", title: "Life Along the Hippo Trails", desc: "Follow the meandering rivers home to majestic hippos, where calm waters mask untamed power." },
  { img: "/images/victoria-falls-tour-simbali-wild-safaris_Slide_3.jpg", title: "Hills, Cliffs & Untold Stories", desc: "Stand in awe of ancient cliffs and rolling hills, nature\u2019s quiet sentinels shaping Africa\u2019s wild horizon." },
  { img: "/images/baobab-sunset-safari-simbali-wild-safaris.jpg", title: "The Tree of Life", desc: "Marvel at the iconic Baobab \u2013 a symbol of resilience and wonder, rooted in Africa\u2019s spirit and soil." },
  { img: "/images/zanzibar-sailboat-beach-simbali-wild-safaris_Slide_4.jpg", title: "Africa\u2019s Hidden Shores", desc: "Discover the softer side of safari on serene beaches where golden sands meet endless blue skies." },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
    setAnimKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[680px] overflow-hidden">
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <img src={slide.img} alt={slide.title} className={`w-full h-full object-cover ${i === current ? "ken-burns" : ""}`} />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white" key={`${animKey}-${i}`}>
            {i === current && (
              <>
                <h1 className="font-belleza text-4xl md:text-5xl lg:text-6xl mb-5 tracking-[0.12em] uppercase slide-title !text-white">{slide.title}</h1>
                <p className="text-base md:text-lg max-w-[520px] leading-relaxed opacity-95 font-work slide-desc text-white">{slide.desc}</p>
              </>
            )}
          </div>
        </div>
      ))}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => { setCurrent(i); setAnimKey((k) => k + 1); }} className={`h-2.5 rounded-full transition-all border-none cursor-pointer ${i === current ? "bg-white w-7" : "bg-white/40 w-2.5"}`} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}
