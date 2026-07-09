import { useEffect, useRef, useState } from 'react';

/**
 * AnimatedSection - wraps children with scroll-triggered animations
 * @param {string} animation - 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-in'
 * @param {number} delay - transition delay in seconds (0-8)
 * @param {string} className - additional classes
 * @param {string} as - wrapper element tag (default 'div')
 */
export default function AnimatedSection({
  animation = 'fade-up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  children,
  threshold = 0.15,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const animClass = `anim-${animation}`;
  const delayClass = delay > 0 ? `anim-delay-${delay}` : '';
  const visibleClass = isVisible ? 'is-visible' : '';

  return (
    <Tag
      ref={ref}
      className={`${animClass} ${delayClass} ${visibleClass} ${className}`}
    >
      {children}
    </Tag>
  );
}
