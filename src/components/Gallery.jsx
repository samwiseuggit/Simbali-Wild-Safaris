import { useState, useEffect } from 'react';

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

  return (
    <section className="pt-20 pb-10 bg-white">
      <div className="container-main">
        <div className="accent-line-center" />
        <h2 className="font-belleza text-2xl md:text-3xl text-center mb-10 tracking-[0.1em] uppercase">Explore Our Recent Adventures</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto px-6">
        <div className="row-span-2 cursor-pointer group relative overflow-hidden rounded-xl" onClick={() => setLightbox(0)}>
          <img src={galleryImages[0].src} alt={galleryImages[0].alt} className="rounded-xl h-full min-h-[320px] object-cover w-full group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="cursor-pointer group relative overflow-hidden rounded-xl" onClick={() => setLightbox(1)}>
          <img src={galleryImages[1].src} alt={galleryImages[1].alt} className="rounded-xl h-[152px] object-cover w-full group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="cursor-pointer group relative overflow-hidden rounded-xl" onClick={() => setLightbox(2)}>
          <img src={galleryImages[2].src} alt={galleryImages[2].alt} className="rounded-xl h-[152px] object-cover w-full group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="row-span-2 cursor-pointer group relative overflow-hidden rounded-xl" onClick={() => setLightbox(3)}>
          <img src={galleryImages[3].src} alt={galleryImages[3].alt} className="rounded-xl h-full min-h-[320px] object-cover w-full group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="cursor-pointer group relative overflow-hidden rounded-xl" onClick={() => setLightbox(4)}>
          <img src={galleryImages[4].src} alt={galleryImages[4].alt} className="rounded-xl h-[152px] object-cover w-full group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="cursor-pointer group relative overflow-hidden rounded-xl" onClick={() => setLightbox(5)}>
          <img src={galleryImages[5].src} alt={galleryImages[5].alt} className="rounded-xl h-[152px] object-cover w-full group-hover:scale-105 transition-transform duration-500" />
        </div>
      </div>
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white text-4xl hover:text-white/70 transition-colors" onClick={() => setLightbox(null)}>&times;</button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-white/70 transition-colors w-10 h-10 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p - 1 + galleryImages.length) % galleryImages.length); }}>&#8249;</button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-white/70 transition-colors w-10 h-10 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p + 1) % galleryImages.length); }}>&#8250;</button>
          <img src={galleryImages[lightbox].src} alt={galleryImages[lightbox].alt} className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
