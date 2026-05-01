import { useState, useEffect } from 'react';

export const useScrollSpy = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const most = visible.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b
          );
          setActiveSection(most.target.id);
        }
      },
      { threshold: [0.3, 0.5, 0.7] }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return activeSection;
};
