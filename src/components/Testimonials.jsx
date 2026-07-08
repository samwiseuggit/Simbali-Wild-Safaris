import { useState, useEffect } from 'react';

const testimonials = [
  { quote: "Their dedication and prompt communication have guaranteed that they always provide me with the best results. I highly recommend them!", name: "Michael Granger", role: "Tourist", img: "/images/simbali-wild-safaris-guest-testimonial-man.jpg" },
  { quote: "Simbali Wild Safaris provided an unforgettable experience! The attention to detail and personalized service made our trip truly remarkable.", name: "James Ellison", role: "Tourist", img: "/images/simbali-wild-safaris-guest-testimonial-traveler.jpg" },
  { quote: "I have collaborated with Simbali for many years! Through dedicated effort and prompt communication, they ensured that I received top-notch service.", name: "Emily Cartwright", role: "Tourist", img: "/images/simbali-wild-safaris-guest-testimonial-woman.jpg" },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <section className="py-20 bg-sage/60">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="relative">
            <span className="absolute -top-3 -left-1 text-[100px] leading-none text-olive/40 font-serif select-none">&ldquo;</span>
            <img src={t.img} alt="Happy traveler" className="rounded-2xl h-[280px] object-cover w-full relative z-10" />
          </div>
          <div>
            <div className="accent-line" />
            <h2 className="font-belleza text-2xl md:text-3xl mb-8 tracking-[0.1em] uppercase">Hear From Our Happy Travelers</h2>
            <p className="text-[#444] text-[15px] leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3 mb-8">
              <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
              <div>
                <div className="font-semibold text-[#1a1a1a] text-sm">{t.name}</div>
                <div className="text-[#777] text-xs">{t.role}</div>
              </div>
            </div>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full border-none cursor-pointer transition-colors ${i === current ? "bg-olive" : "bg-olive/30"}`} aria-label={`Testimonial ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
