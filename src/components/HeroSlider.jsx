import { useState, useEffect, useCallback, useRef } from 'react';
import { slideBlurPreviews } from '../data/slideBlur';
import { getImagePosition } from '../data/imagePositions';

const slides = [
  { imgWebp: "/images/slide-1.webp", imgJpg: "/images/slide-1.jpg", title: "Heart of the Delta", desc: "Explore the lush paradise of the Okavango Delta, where life flourishes in a timeless rhythm of water and wildlife." },
  { imgWebp: "/images/slide-2.webp", imgJpg: "/images/slide-2.jpg", title: "Aerial Grace in Motion", desc: "Witness the breathtaking flight of birds soaring over African skies — a symphony of color, freedom, and instinct." },
  { imgWebp: "/images/slide-3.webp", imgJpg: "/images/slide-3.jpg", title: "Life Along the Hippo Trails", desc: "Follow the meandering rivers home to majestic hippos, where calm waters mask untamed power." },
  { imgWebp: "/images/slide-4.webp", imgJpg: "/images/slide-4.jpg", title: "Hills, Cliffs & Untold Stories", desc: "Stand in awe of ancient cliffs and rolling hills, nature's quiet sentinels shaping Africa's wild horizon." },
  { imgWebp: "/images/slide-5.webp", imgJpg: "/images/slide-5.jpg", title: "The Tree of Life", desc: "Marvel at the iconic Baobab — a symbol of resilience and wonder, rooted in Africa's spirit and soil." },
  { imgWebp: "/images/slide-6.webp", imgJpg: "/images/slide-6.jpg", title: "Africa's Hidden Shores", desc: "Discover the softer side of safari on serene beaches where golden sands meet endless blue skies." },
];

const blurKeys = ["slide-1", "slide-2", "slide-3", "slide-4", "slide-5", "slide-6"];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState(new Set());
  const mountedRef = useRef(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
    setAnimKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next]);

  // CRITICAL FIX: Preload ALL slides on mount using Image()
  // This bypasses the <picture> element onLoad unreliability
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    slides.forEach((slide, i) => {
      // Try WebP first, fall back to JPEG
      const img = new Image();
      img.onload = () => {
        setLoadedSlides((prev) => {
          const next = new Set(prev);
          next.add(i);
          return next;
        });
      };
      img.onerror = () => {
        // If WebP fails, try JPEG
        const img2 = new Image();
        img2.onload = () => {
          setLoadedSlides((prev) => {
            const next = new Set(prev);
            next.add(i);
            return next;
          });
        };
        img2.src = slide.imgJpg;
      };
      img.src = slide.imgWebp;
    });
  }, []);

  // Also preload upcoming slide more aggressively
  useEffect(() => {
    const nextIdx = (current + 1) % slides.length;
    if (!loadedSlides.has(nextIdx)) {
      const img = new Image();
      img.onload = () => {
        setLoadedSlides((prev) => {
          const next = new Set(prev);
          next.add(nextIdx);
          return next;
        });
      };
      img.src = slides[nextIdx].imgWebp;
    }
  }, [current, loadedSlides]);

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[680px] overflow-hidden">
      {slides.map((slide, i) => {
        const isActive = i === current;
        const isLoaded = loadedSlides.has(i);
        const objPos = getImagePosition(slide.imgJpg);
        return (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Layer 1: Blur placeholder (fades out when loaded) */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                isLoaded ? "opacity-0" : "opacity-100"
              }`}
              style={{ backgroundImage: `url(${slideBlurPreviews[blurKeys[i]]})` }}
            />

            {/* Layer 2: Full image (fades in when loaded) */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.imgWebp}
                alt={slide.title}
                className={`w-full h-full object-cover ${isActive ? "ken-burns" : ""}`}
                style={{ objectPosition: objPos }}
                loading={i === 0 ? "eager" : "lazy"}
                fetchpriority={i === 0 ? "high" : "auto"}
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
              {isActive && (
                <div key={`${animKey}-${i}`}>
                  <h1 className="font-belleza text-4xl md:text-5xl lg:text-6xl mb-5 tracking-[0.12em] uppercase slide-title !text-white">
                    {slide.title}
                  </h1>
                  <p className="text-base md:text-lg max-w-[520px] leading-relaxed opacity-95 font-work slide-desc text-white">
                    {slide.desc}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {/* Dots */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setAnimKey((k) => k + 1); }}
            className={`h-2.5 rounded-full transition-all duration-300 border-none cursor-pointer ${
              i === current ? "bg-white w-7" : "bg-white/40 w-2.5 hover:bg-white/60"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
