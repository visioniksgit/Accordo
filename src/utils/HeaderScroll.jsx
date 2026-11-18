import { useEffect, useState, useRef } from 'react';

export function useHeaderScroll(initialValue = false, options = {}) {
  const { hideAt = 40, showAt = 10 } = options;
  const [upScroll, setUpScroll] = useState(initialValue);
  const upScrollRef = useRef(initialValue);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const currentY = window.scrollY;
      const prev = upScrollRef.current;
      const nextState = prev ? currentY > showAt : currentY > hideAt;

      if (nextState !== prev) {
        upScrollRef.current = nextState;
        setUpScroll(nextState);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hideAt, showAt]);

  return upScroll;
}
