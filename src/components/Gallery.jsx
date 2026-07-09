import { useState, useEffect, useRef } from 'react';

const galleryImages = [
  { src: "/images/giraffes-savanna-safari-simbali-wild-safaris.jpg", alt: "Giraffes" },
  { src: "/images/elephant-herd-waterhole-safari-simbali-wild-safaris.jpg", alt: "Elephant" },
  { src: "/images/impala-antelope-safari-simbali-wild-safaris.jpg", alt: "Impala" },
  { src: "/images/lions-safari-vehicle-simbali-wild-safaris.jpg", alt: "Lions" },
  { src: "/images/safari-rally-car-simbali-wild-safaris.jpg", alt: "Safari rally" },
  { src: "/images/hot-air-balloon-zebra-safari-simbali-wild-safaris.jpg", alt: "Hot air balloon" },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const gridRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((p) => (p + 1) % galleryImages.length);
      if (e.key === "ArrowLeft") setLightbox((p) => (p - 1 + galleryImages.length) % galleryImages.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  // Staggered reveal for gallery items
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const items = grid.querySelectorAll('.gallery-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.index, 10);
            setTimeout(() => {
              setVisibleItems((prev) => new Set(prev).add(idx));
            }, idx * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-20 pb-10 bg-white">
      <div className="container-main">
        <div className="anim-fade-up">
          <div className="accent-line-center" />
          <h2 className="font-belleza text-2xl md:text-3xl text-center mb-10 tracking-[0.1em] uppercase">Explore Our Recent Adventures</h2>
        </div>
      </div>
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto px-6">
        {galleryImages.map((img, i) => {
          const isVisible = visibleItems.has(i);
          const isLarge = i === 0 || i === 3;
          return (
            <div
              key={i}
              data-index={i}
              className={`gallery-item cursor-pointer group relative overflow-hidden rounded-xl ${isLarge ? 'row-span-2' : ''} anim-scale-in transition-all duration-500 ${isVisible ? 'is-visible' : 'opacity-0'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
              onClick={() => setLightbox(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className={`rounded-xl object-cover w-full group-hover:scale-105 transition-transform duration-500 ${isLarge ? 'h-full min-h-[320px]' : 'h-[152px]'}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-olive/0 group-hover:bg-olive/20 transition-colors duration-300 rounded-xl" />
            </div>
          );
        })}
      </div>
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center animate-fadeIn" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white text-4xl hover:text-white/70 transition-colors" onClick={() => setLightbox(null)}>&times;</button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-white/70 transition-colors w-10 h-10 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p - 1 + galleryImages.length) % galleryImages.length); }}>&#8249;</button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-white/70 transition-colors w-10 h-10 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p + 1) % galleryImages.length); }}>&#8250;</button>
          <img src={galleryImages[lightbox].src} alt={galleryImages[lightbox].alt} className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg animate-scaleIn" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
