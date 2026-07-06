import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const PARTICLE_COUNT = 80;
const CONNECT_DIST = 100;
const MOUSE_RADIUS = 160;
const MOUSE_INFLUENCE = 0.12; // fraction of cursor velocity transferred to particles
const REPEL_DIST = 32;        // inter-particle repulsion zone
const REPEL_FORCE = 0.28;
const MAX_SPEED = 1.4;
const DAMPING = 0.976;

const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const mousePrevRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Pre-rendered glow sprite — same radial falloff as the previous
    // per-frame createRadialGradient, but drawn once and blitted per particle.
    const GLOW_SPRITE_R = 64;
    const glowSprite = document.createElement('canvas');
    glowSprite.width = glowSprite.height = GLOW_SPRITE_R * 2;
    const gctx = glowSprite.getContext('2d')!;
    const grad = gctx.createRadialGradient(
      GLOW_SPRITE_R, GLOW_SPRITE_R, 0,
      GLOW_SPRITE_R, GLOW_SPRITE_R, GLOW_SPRITE_R,
    );
    grad.addColorStop(0, 'rgba(100,180,255,1)');
    grad.addColorStop(1, 'rgba(100,180,255,0)');
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, GLOW_SPRITE_R * 2, GLOW_SPRITE_R * 2);

    const cw = () => canvas.offsetWidth;
    const ch = () => canvas.offsetHeight;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * cw(),
      y: Math.random() * ch(),
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.6 + 0.8,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, cw(), ch());

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mvx = mx - mousePrevRef.current.x;
      const mvy = my - mousePrevRef.current.y;
      mousePrevRef.current = { x: mx, y: my };

      // Update velocities
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cursor velocity field — transfers cursor momentum to nearby particles
        const cdx = mx - p.x;
        const cdy = my - p.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist < MOUSE_RADIUS && cdist > 0) {
          const influence = (1 - cdist / MOUSE_RADIUS) * MOUSE_INFLUENCE;
          p.vx += mvx * influence;
          p.vy += mvy * influence;
        }

        // Inter-particle repulsion (share loop with connection drawing below)
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < REPEL_DIST && dist > 0) {
            const force = ((REPEL_DIST - dist) / REPEL_DIST) * REPEL_FORCE;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            p.vx += fx;
            p.vy += fy;
            q.vx -= fx;
            q.vy -= fy;
          }
        }

        p.vx *= DAMPING;
        p.vy *= DAMPING;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) { p.x = 0; p.vx *= -0.8; }
        if (p.x > cw()) { p.x = cw(); p.vx *= -0.8; }
        if (p.y < 0) { p.y = 0; p.vy *= -0.8; }
        if (p.y > ch()) { p.y = ch(); p.vy *= -0.8; }
      }

      // Draw edges — faint blue-white
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(160,210,255,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes — white core + soft blue halo
      for (const p of particles) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nearMouse = dist < MOUSE_RADIUS * 0.7;

        // Outer blue glow
        const glowRadius = p.radius * (nearMouse ? 5 : 3.5);
        ctx.globalAlpha = nearMouse ? 0.35 : 0.18;
        ctx.drawImage(
          glowSprite,
          p.x - glowRadius, p.y - glowRadius,
          glowRadius * 2, glowRadius * 2,
        );
        ctx.globalAlpha = 1;

        // White core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${nearMouse ? 0.95 : 0.55})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    // Only run the simulation while the hero canvas is actually visible.
    let running = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        rafRef.current = requestAnimationFrame(draw);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(rafRef.current);
      }
    });
    io.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
      mousePrevRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};

export default ParticleNetwork;
