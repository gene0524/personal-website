import { useState, useEffect } from 'react';

export const useScrollSpy = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach((section: Element) => {
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const scroll = window.scrollY;
        const windowHeight = window.innerHeight;

        if (scroll >= sectionTop && scroll < sectionTop + sectionHeight) {
          setActiveSection(section.getAttribute('id') || 'hero');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return activeSection;
}; 