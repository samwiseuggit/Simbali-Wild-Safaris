import { useState, useEffect, useRef } from 'react';

function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime;
    let animId;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [started, end, duration]);

  return { count, ref };
}

function AnimatedStat({ value, suffix, label }) {
  const { count, ref } = useCountUp(value, 2000);
  return (
    <div ref={ref} className="text-center">
      <div className="font-belleza text-5xl md:text-6xl text-[#1a1a1a]">{count}{suffix}</div>
      <div className="text-[#444] text-sm mt-2 tracking-wide">{label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-14 bg-sage/60">
      <div className="container-main">
        <div className="grid grid-cols-3 gap-8 md:gap-12 text-center max-w-3xl mx-auto">
          <AnimatedStat value={12} suffix="+" label="Years Of Experience" />
          <AnimatedStat value={500} suffix="+" label="Happy Customers" />
          <AnimatedStat value={98} suffix="%" label="Customer Satisfaction" />
        </div>
      </div>
    </section>
  );
}
