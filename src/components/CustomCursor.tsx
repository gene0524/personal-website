import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  const dotSpringX = useSpring(rawX, { stiffness: 800, damping: 35 });
  const dotSpringY = useSpring(rawY, { stiffness: 800, damping: 35 });
  const ringSpringX = useSpring(rawX, { stiffness: 120, damping: 18 });
  const ringSpringY = useSpring(rawY, { stiffness: 120, damping: 18 });

  const dotX = useTransform(dotSpringX, v => v - 4);
  const dotY = useTransform(dotSpringY, v => v - 4);
  const ringX = useTransform(ringSpringX, v => v - 18);
  const ringY = useTransform(ringSpringY, v => v - 18);

  useEffect(() => {
    if (window.matchMedia('(hover: hover)').matches) {
      setVisible(true);
    }
    const handle = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [rawX, rawY]);

  if (!visible) return null;

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#00ff9d',
          pointerEvents: 'none',
          zIndex: 9999,
          x: dotX,
          y: dotY,
          boxShadow: '0 0 10px rgba(0,255,157,0.9)',
        }}
      />
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,255,157,0.45)',
          pointerEvents: 'none',
          zIndex: 9998,
          x: ringX,
          y: ringY,
        }}
      />
    </>
  );
};

export default CustomCursor;
