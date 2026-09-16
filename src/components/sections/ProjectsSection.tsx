import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Dialog,
  DialogContent,
  Button,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import {
  motion,
  useReducedMotion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import YouTubeIcon from '@mui/icons-material/YouTube';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CloseIcon from '@mui/icons-material/Close';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import ViewListIcon from '@mui/icons-material/ViewList';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { projects, projectKinds, projectImageUrl, STATUS_NOTE } from '../../data/projects';
import type { Project, ProjectLinkKey } from '../../data/projects';
import SectionHeading from '../SectionHeading';
import { FONT_MONO, FONT_DISPLAY } from '../../themes';

// ── Link rendering is generic: add a key to ProjectLinkKey + a row here ────
const LINKS: Record<ProjectLinkKey, { label: string; icon: React.ReactNode }> = {
  live:  { label: 'Visit',  icon: <OpenInNewIcon /> },
  npm:   { label: 'npm',    icon: <Inventory2Icon /> },
  repo:  { label: 'Source', icon: <GitHubIcon /> },
  paper: { label: 'Paper',  icon: <ArticleIcon /> },
  demo:  { label: 'Demo',   icon: <YouTubeIcon /> },
};
const LINK_ORDER: ProjectLinkKey[] = ['live', 'npm', 'paper', 'repo', 'demo'];

const HAIRLINE = '1px solid rgba(230,241,255,0.10)';
const MONO_SX = { fontFamily: FONT_MONO, fontSize: '0.72rem', letterSpacing: '0.04em', color: 'text.secondary' } as const;

type View = 'cards' | 'list';

// Card width per breakpoint — narrower/vw-driven on mobile so a neighbour
// peeks in on each side (a snap-scroll cue), fixed-ish on desktop.
const CARD_W = { xs: 'clamp(240px, 78vw, 380px)', sm: 'clamp(380px, 55vw, 460px)', md: 'clamp(380px, 40vw, 500px)' } as const;
const CARD_FLEX_SX = { xs: `0 0 ${CARD_W.xs}`, sm: `0 0 ${CARD_W.sm}`, md: `0 0 ${CARD_W.md}` };
const TRACK_PX_SX = { xs: `calc(50% - (${CARD_W.xs}) / 2)`, sm: `calc(50% - (${CARD_W.sm}) / 2)`, md: `calc(50% - (${CARD_W.md}) / 2)` };
const FILMSTRIP_ITEM = '[data-filmstrip-item]';
// The accent ring's "breathing" glow used to be a Framer animate={} loop
// running continuously (repeat: Infinity) on EVERY card's motion.div, all 11
// at once regardless of visibility - pure wasted main-thread work for the
// ~9 that are off to the side. A CSS keyframe does the identical animation
// on the compositor, for free, whether or not the card is ever centred.
const breathe = keyframes`0%, 100% { opacity: 0.55; } 50% { opacity: 1; }`;
const GLASS_STROKE = '1px solid rgba(255,255,255,0.14)';
// Measured: toggling backdrop-filter on/off during the scroll (via a
// data-scrolling attribute) made jank WORSE - forcing the browser to
// tear down/rebuild the GPU compositing layer mid-slide costs more than
// just leaving it blurred, up to 1400ms frame gaps vs 400ms unthrottled.
// Static removal below 900px avoids that churn entirely instead.
const PILL_SX = {
  fontFamily: FONT_MONO,
  fontSize: '0.8rem',
  letterSpacing: '0.03em',
  lineHeight: 1,
  px: 1.25,
  py: 0.75,
  borderRadius: '999px',
  backgroundColor: { xs: 'rgba(7,9,15,0.82)', md: 'rgba(7,9,15,0.6)' },
  backdropFilter: { xs: 'none', md: 'blur(10px)' },
  WebkitBackdropFilter: { xs: 'none', md: 'blur(10px)' },
  border: GLASS_STROKE,
  color: 'text.primary',
  whiteSpace: 'nowrap',
} as const;

// ── Cover for entries without a picture ────────────────────────────────────
const GeneratedCover: React.FC<{ project: Project }> = ({ project }) => (
  <Box
    aria-hidden="true"
    sx={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'flex-end',
      p: 2.5,
      background:
        'radial-gradient(110% 80% at 0% 0%, rgba(0,255,157,0.16) 0%, transparent 55%), ' +
        'radial-gradient(90% 90% at 100% 100%, rgba(124,156,255,0.18) 0%, transparent 55%), ' +
        'linear-gradient(160deg, #0f1f3d 0%, #0a192f 100%)',
    }}
  >
    <Typography sx={{ fontFamily: FONT_MONO, fontSize: '1.4rem', color: 'rgba(230,241,255,0.7)', lineHeight: 1.2 }}>
      {project.kind.join(' · ')}
    </Typography>
  </Box>
);

// ── Stage card (filmstrip) ──────────────────────────────────────────────────
// Glass card on a horizontal snap track. Everything visual is driven by the
// card's position in the track: the centred card is lit (ambient glow from its
// own screenshot, accent ring, full colour, pointer tilt) and neighbours turn
// away CoverFlow-style, desaturate and dim.
interface StageCardProps {
  project: Project;
  index: number;
  total: number;
  trackRef: React.RefObject<HTMLDivElement | null>;
  onOpen: (p: Project) => void;
  onCenter: (el: HTMLElement) => void;
  reducedMotion: boolean;
}

const StageCard: React.FC<StageCardProps> = ({ project, index, total, trackRef, onOpen, onCenter, reducedMotion }) => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  // Ambient glow's blur radius, not the grayscale/brightness coverflow
  // filter - reduced (not removed) below 900px since blur(48px) over a
  // roughly card-sized area is one of the pricier per-card GPU costs,
  // same category as the backdrop-filter already dropped there.
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const ref = useRef<HTMLDivElement>(null);
  const img = projectImageUrl(project);
  const live = project.links.live;

  // layoutEffect: false — the track ref is attached after this child's layout effect would run
  const { scrollXProgress } = useScroll({ container: trackRef, target: ref, axis: 'x', offset: ['start end', 'end start'], layoutEffect: false });
  const active = useTransform(scrollXProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const scale = useTransform(active, [0, 1], [0.84, 1]);
  const turn = useTransform(scrollXProgress, [0.2, 0.5, 0.8], reducedMotion ? [0, 0, 0] : [-18, 0, 18]);
  const grayscale = useTransform(active, [0, 1], [0.75, 0]);
  const brightness = useTransform(active, [0, 1], [0.5, 1]);
  // Capped so light screenshots don't blow out into a white halo
  const glowOpacity = useTransform(active, [0, 1], [0, 0.55]);
  const filter = useMotionTemplate`grayscale(${grayscale}) brightness(${brightness})`;

  const spring = { stiffness: 220, damping: 24, mass: 0.6 };
  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const tiltX = useSpring(tiltXRaw, spring);
  const tiltY = useSpring(tiltYRaw, spring);
  const rotateY = useTransform([turn, tiltY], ([t, y]: number[]) => t + y);
  const lightX = useSpring(useMotionValue(50), spring);
  const lightY = useSpring(useMotionValue(30), spring);
  const sheen = useMotionTemplate`radial-gradient(520px circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.16), rgba(255,255,255,0.03) 40%, transparent 62%)`;

  const isCentred = () => Math.abs(scrollXProgress.get() - 0.5) < 0.08;
  const activate = () => {
    if (isCentred()) onOpen(project);
    else if (ref.current) onCenter(ref.current);
  };

  return (
    <Box
      ref={ref}
      data-filmstrip-item=""
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      sx={{ flex: CARD_FLEX_SX, minWidth: 0, scrollSnapAlign: 'center', position: 'relative' }}
    >
      <motion.div
        style={{ scale, rotateY, rotateX: tiltX, filter, transformPerspective: 1400, height: '100%', position: 'relative' }}
      >
        {/* Ambient light: the screenshot itself, blurred, behind the glass */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: glowOpacity,
            position: 'absolute',
            inset: '-6% -8%',
            zIndex: 0,
            borderRadius: 40,
            filter: `blur(${isSmall ? 20 : 48}px) saturate(1.7) brightness(0.8)`,
            background: img
              ? `url(${img}) center / cover no-repeat`
              : `radial-gradient(60% 60% at 30% 30%, ${alpha(accent, 0.5)}, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        {/* Accent ring, breathing while the card is centred */}
        <motion.div aria-hidden="true" style={{ opacity: active, position: 'absolute', inset: 0, zIndex: 0, borderRadius: 20, pointerEvents: 'none' }}>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '20px',
              boxShadow: `0 0 0 1px ${alpha(accent, 0.55)}, 0 0 60px ${alpha(accent, 0.22)}, 0 0 120px ${alpha(accent, 0.12)}`,
              animation: reducedMotion ? 'none' : `${breathe} 3.2s ease-in-out infinite`,
            }}
          />
        </motion.div>

        <Box
          role="button"
          tabIndex={0}
          aria-label={`${project.title}: open details`}
          onClick={activate}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
          }}
          onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
            if (reducedMotion || e.pointerType !== 'mouse' || !isCentred()) return;
            const r = e.currentTarget.getBoundingClientRect();
            const rx = (e.clientX - r.left) / r.width;
            const ry = (e.clientY - r.top) / r.height;
            tiltXRaw.set((0.5 - ry) * 9);
            tiltYRaw.set((rx - 0.5) * 11);
            lightX.set(rx * 100);
            lightY.set(ry * 100);
          }}
          onPointerLeave={() => {
            tiltXRaw.set(0);
            tiltYRaw.set(0);
            lightX.set(50);
            lightY.set(30);
          }}
          sx={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '20px',
            overflow: 'hidden',
            cursor: 'pointer',
            outline: 'none',
            backgroundColor: { xs: 'rgba(11,15,24,0.92)', md: 'rgba(11,15,24,0.78)' },
            backdropFilter: { xs: 'none', md: 'blur(22px) saturate(160%)' },
            WebkitBackdropFilter: { xs: 'none', md: 'blur(22px) saturate(160%)' },
            border: GLASS_STROKE,
            boxShadow: '0 1px 0 rgba(255,255,255,0.12) inset, 0 24px 60px rgba(0,0,0,0.45)',
            transition: 'border-color 0.3s',
            '&:hover': { borderColor: 'rgba(255,255,255,0.24)' },
            '&:focus-visible': { boxShadow: `0 0 0 2px ${accent}, 0 24px 60px rgba(0,0,0,0.45)` },
            '& .stage-img': { transition: reducedMotion ? 'none' : 'transform 0.7s cubic-bezier(0.2,0.7,0.2,1)' },
            '&:hover .stage-img': { transform: reducedMotion ? 'none' : 'scale(1.04)' },
          }}
        >
          {/* Specular sheen following the pointer */}
          <motion.div aria-hidden="true" style={{ background: sheen, position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', mixBlendMode: 'screen' }} />

          <Box sx={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', backgroundColor: '#0d1b33', borderBottom: GLASS_STROKE }}>
            {img ? (
              <Box
                component="img"
                className="stage-img"
                src={img}
                alt=""
                loading="lazy"
                decoding="async"
                width={project.image?.width}
                height={project.image?.height}
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: project.image?.position ?? 'top', display: 'block' }}
              />
            ) : (
              <GeneratedCover project={project} />
            )}
            <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,9,15,0.55), transparent 45%)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', gap: 1, zIndex: 2 }}>
              {/* Some org strings ("Imperial College London · PAKDD 2026", "Client ·
                  national non-profit association, Taiwan") are fine at the 380-500px
                  desktop card width but overflow the 240px mobile minimum - flex items
                  don't shrink below their content's intrinsic width by default, so this
                  needs minWidth:0 + ellipsis rather than relying on the parent's flex. */}
              <Box sx={{ ...PILL_SX, minWidth: 0, maxWidth: { xs: '58%', md: '68%' }, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {project.org}
              </Box>
              <Box sx={PILL_SX}>
                {project.year}
                {STATUS_NOTE[project.status] && (
                  <Box component="span" sx={{ ml: 1, color: 'rgba(255,184,107,0.95)' }}>{STATUS_NOTE[project.status]}</Box>
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 2, md: 2.5 }, pt: { xs: 1.75, md: 2 }, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}>
              <Typography
                variant="h4"
                component="h3"
                sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: { xs: '1.3rem', md: '1.55rem', lg: '1.7rem' }, lineHeight: 1.15, m: 0, letterSpacing: '-0.01em' }}
              >
                {project.title}
              </Typography>
              {live && (
                <Box
                  component="a"
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${project.title} (opens in new tab)`}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  sx={{ fontFamily: FONT_MONO, fontSize: '0.82rem', color: 'primary.main', textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 0.5, '&:hover': { textDecoration: 'underline' } }}
                >
                  visit <OpenInNewIcon sx={{ fontSize: 14 }} />
                </Box>
              )}
            </Box>
            <Typography sx={{ color: 'text.primary', fontSize: '0.98rem', lineHeight: 1.45, m: 0 }}>{project.tagline}</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem', lineHeight: 1.45, m: 0 }}>{project.role}</Typography>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 'auto', pt: 1.25, p: 0, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {project.facts.slice(0, 3).map(f => (
                <Box
                  component="li"
                  key={f}
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: '0.76rem',
                    letterSpacing: '0.02em',
                    px: 1.1,
                    py: 0.5,
                    borderRadius: '999px',
                    color: 'primary.main',
                    border: `1px solid ${alpha(accent, 0.35)}`,
                    backgroundColor: alpha(accent, 0.07),
                  }}
                >
                  {f}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

interface FilmstripProps {
  items: Project[];
  onOpen: (p: Project) => void;
  onActiveChange: (p: Project | null) => void;
  reducedMotion: boolean;
}

const Filmstrip: React.FC<FilmstripProps> = ({ items, onOpen, onActiveChange, reducedMotion }) => {
  const theme = useTheme();
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollXProgress: trackProgress } = useScroll({ container: trackRef, axis: 'x', layoutEffect: false });

  // Real on-device profiling (Safari Web Inspector, iPhone) showed continuous
  // "Recalculate Style"/"Layout" during the slide, well past where the touch
  // gesture itself ended - traced to this: nearestIndex used to read
  // offsetLeft/offsetWidth off all N card elements every scroll frame, in a
  // separate rAF from the one Framer Motion uses internally to write each
  // card's transform/filter. Reading layout-dependent geometry right after
  // (or right before) another callback writes style to those same elements
  // is the textbook forced-synchronous-layout pattern. Cards are uniform
  // width with scroll-snap-align: center, so the index is recoverable from
  // scrollLeft alone (cheap, not layout-dependent) once the fixed spacing
  // between card centres is known - measured only on mount/resize, not
  // every frame.
  const stepRef = useRef(0);
  const measureStep = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const els = t.querySelectorAll<HTMLElement>(FILMSTRIP_ITEM);
    if (els.length >= 2) stepRef.current = els[1].offsetLeft - els[0].offsetLeft;
    else if (els.length === 1) stepRef.current = els[0].offsetWidth;
  }, []);

  const nearestIndex = useCallback(() => {
    const t = trackRef.current;
    if (!t || !stepRef.current) return 0;
    const raw = Math.round(t.scrollLeft / stepRef.current);
    return Math.min(items.length - 1, Math.max(0, raw));
  }, [items.length]);

  const updateScroll = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const start = t.scrollLeft <= 1;
    const end = t.scrollLeft + t.clientWidth >= t.scrollWidth - 1;
    setEdges(prev => (prev.start === start && prev.end === end ? prev : { start, end }));
    setActiveIndex(nearestIndex());
  }, [nearestIndex]);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    measureStep();
    updateScroll();
    // Coalesce to at most one updateScroll per rAF - now a single cheap
    // scrollLeft read plus arithmetic, not a DOM query.
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        updateScroll();
      });
    };
    t.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => {
      measureStep();
      updateScroll();
    });
    ro.observe(t);
    return () => {
      t.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [updateScroll, measureStep]);

  useEffect(() => {
    onActiveChange(items[activeIndex] ?? null);
  }, [activeIndex, items, onActiveChange]);

  const centerOn = useCallback(
    (el: HTMLElement) => {
      const t = trackRef.current;
      if (!t) return;
      t.scrollTo({
        left: el.offsetLeft - (t.clientWidth - el.offsetWidth) / 2,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [reducedMotion],
  );

  const step = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    const els = Array.from(t.querySelectorAll<HTMLElement>(FILMSTRIP_ITEM));
    if (!els.length) return;
    centerOn(els[Math.min(els.length - 1, Math.max(0, nearestIndex() + dir))]);
  };

  const arrowSx = {
    position: 'absolute',
    top: '30%',
    zIndex: 2,
    width: 44,
    height: 44,
    color: 'text.primary',
    backgroundColor: 'rgba(7,9,15,0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: GLASS_STROKE,
    transition: 'opacity 0.2s, border-color 0.2s, color 0.2s',
    '&:hover': { borderColor: 'primary.main', color: 'primary.main', backgroundColor: 'rgba(7,9,15,0.75)' },
    '&.Mui-disabled': { opacity: 0 },
  } as const;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <Box
      role="region"
      aria-roledescription="carousel"
      aria-label="Work"
      sx={{ position: 'relative' }}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      }}
      onFocus={(e: React.FocusEvent) => {
        const target = e.target as HTMLElement;
        const item = target.closest<HTMLElement>(FILMSTRIP_ITEM);
        if (item && target.matches(':focus-visible')) centerOn(item);
      }}
    >
      <Box
        ref={trackRef}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          px: TRACK_PX_SX,
          py: 4,
          my: -2.5,
          overflowX: 'auto',
          overflowY: 'hidden',
          overscrollBehaviorX: 'contain',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          maskImage: 'linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)',
        }}
      >
        {items.map((p, i) => (
          <StageCard
            key={p.slug}
            project={p}
            index={i}
            total={items.length}
            trackRef={trackRef}
            onOpen={onOpen}
            onCenter={centerOn}
            reducedMotion={reducedMotion}
          />
        ))}
      </Box>
      <IconButton aria-label="Previous project" disabled={edges.start} onClick={() => step(-1)} sx={{ ...arrowSx, left: 8 }}>
        <ChevronLeftIcon />
      </IconButton>
      <IconButton aria-label="Next project" disabled={edges.end} onClick={() => step(1)} sx={{ ...arrowSx, right: 8 }}>
        <ChevronRightIcon />
      </IconButton>

      {/* Counter + progress */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mt: 1.5, fontFamily: FONT_MONO, fontSize: '0.82rem', letterSpacing: '0.06em', color: 'text.secondary' }}>
        <Box aria-live="polite" sx={{ whiteSpace: 'nowrap', minWidth: 72 }}>
          <Box component="span" sx={{ color: 'text.primary' }}>{pad(activeIndex + 1)}</Box>
          {' / '}
          {pad(items.length)}
        </Box>
        <Box aria-hidden="true" sx={{ flex: 1, height: 2, borderRadius: 1, backgroundColor: 'rgba(230,241,255,0.12)', overflow: 'hidden' }}>
          <motion.div style={{ scaleX: trackProgress, transformOrigin: 'left', height: '100%', backgroundColor: theme.palette.primary.main }} />
        </Box>
        <Box sx={{ whiteSpace: 'nowrap', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260 }}>
          {items[activeIndex]?.title}
        </Box>
      </Box>
    </Box>
  );
};

// ── List row ───────────────────────────────────────────────────────────────
const Row: React.FC<{ project: Project; onOpen: (p: Project) => void }> = ({ project, onOpen }) => (
  <Box
    component="li"
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr auto', md: '110px 1.4fr 1.2fr 1fr auto' },
      columnGap: { xs: 2, md: 3 },
      rowGap: 0.5,
      alignItems: 'baseline',
      py: { xs: 1.75, md: 1.5 },
      borderTop: HAIRLINE,
      '&:last-of-type': { borderBottom: HAIRLINE },
      '&:hover': { backgroundColor: 'rgba(230,241,255,0.025)' },
    }}
  >
    <Box sx={{ ...MONO_SX, display: { xs: 'none', md: 'block' } }}>{project.year}</Box>
    <Box>
      <Box
        component="button"
        type="button"
        onClick={() => onOpen(project)}
        sx={{
          all: 'unset',
          cursor: 'pointer',
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: { xs: '1.05rem', md: '1.1rem' },
          color: 'text.primary',
          '&:hover': { color: 'primary.main' },
          '&:focus-visible': { outline: '2px solid #00ff9d', outlineOffset: 3 },
        }}
      >
        {project.title}
      </Box>
      <Box sx={{ ...MONO_SX, display: { xs: 'block', md: 'none' }, mt: 0.25 }}>
        {project.year} · {project.org}
      </Box>
    </Box>
    <Box sx={{ ...MONO_SX, color: 'text.primary', display: { xs: 'none', md: 'block' } }}>{project.org}</Box>
    <Box sx={{ ...MONO_SX, gridColumn: { xs: '1 / -1', md: 'auto' } }}>{project.kind.join(' · ')}</Box>
    <Box sx={{ ...MONO_SX, textAlign: 'right', gridRow: { xs: 1, md: 'auto' }, gridColumn: { xs: 2, md: 'auto' } }}>
      {project.links.live ? (
        <Box
          component="a"
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${project.title} (opens in new tab)`}
          sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          visit ↗
        </Box>
      ) : (
        <span style={{ opacity: 0.6 }}>{STATUS_NOTE[project.status] ?? '—'}</span>
      )}
    </Box>
  </Box>
);

// ── Section ────────────────────────────────────────────────────────────────
const ProjectsSection: React.FC = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [view, setView] = useState<View>('cards');
  const [kind, setKind] = useState<string | null>(null);
  const isTouch = useMediaQuery('(hover: none)');
  const reducedMotion = !!useReducedMotion();
  const [stageProject, setStageProject] = useState<Project | null>(null);
  const washImg = view === 'cards' && stageProject ? projectImageUrl(stageProject) : null;

  const visible = useMemo(
    () => (kind ? projects.filter(p => p.kind[0] === kind) : projects),
    [kind],
  );
  const selectedImg = selected ? projectImageUrl(selected) : null;

  return (
    <Box
      component="section"
      id="projects"
      aria-labelledby="projects-heading"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        py: { xs: 8, md: 7 },
        position: 'relative',
        overflow: 'hidden',
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'none', md: 'always' },
      }}
    >
      {/* Section wash: the centred card's screenshot, blurred into a colour field */}
      <AnimatePresence>
        {washImg && (
          <motion.img
            key={washImg}
            src={washImg}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 1.1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scale(1.25)',
              filter: 'blur(90px) saturate(1.5) brightness(0.7)',
              maskImage: 'linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading id="projects-heading" number="03." title="Work" mb={{ xs: 2, md: 2 }} />

        {/* Intro */}
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 620, m: 0, mb: { xs: 2.5, md: 2 } }}>
          What I have built, run or published, and what my part was. Websites are the tools, not the point.
        </Typography>

        {/* Controls: filter left, view toggle right */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            pb: 2,
            mb: { xs: 3, md: 2.5 },
            borderBottom: HAIRLINE,
          }}
        >
          <Box component="nav" aria-label="Filter work by kind" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, minWidth: 0 }}>
            {[null, ...projectKinds].map(k => {
              const active = kind === k;
              return (
                <Box
                  key={k ?? 'all'}
                  component="button"
                  type="button"
                  aria-pressed={active}
                  onClick={() => setKind(k)}
                  sx={{
                    all: 'unset',
                    cursor: 'pointer',
                    ...MONO_SX,
                    fontSize: { xs: '0.68rem', md: '0.72rem' },
                    color: active ? 'background.default' : 'text.secondary',
                    backgroundColor: active ? 'primary.main' : 'transparent',
                    border: active ? '1px solid transparent' : HAIRLINE,
                    borderRadius: '999px',
                    px: { xs: 1, md: 1.25 },
                    py: 0.4,
                    whiteSpace: 'nowrap',
                    '&:hover': { color: active ? 'background.default' : 'text.primary', borderColor: 'rgba(230,241,255,0.3)' },
                    '&:focus-visible': { outline: '2px solid #00ff9d', outlineOffset: 2 },
                  }}
                >
                  {k ?? `All ${projects.length}`}
                </Box>
              );
            })}
          </Box>

          <Box role="group" aria-label="View" sx={{ display: 'flex', border: HAIRLINE, borderRadius: '999px', p: 0.25, flexShrink: 0 }}>
            {(['cards', 'list'] as View[]).map(v => (
              <IconButton
                key={v}
                size="small"
                aria-label={`${v} view`}
                aria-pressed={view === v}
                onClick={() => setView(v)}
                sx={{
                  color: view === v ? 'background.default' : 'text.secondary',
                  backgroundColor: view === v ? 'primary.main' : 'transparent',
                  '&:hover': { backgroundColor: view === v ? 'primary.main' : 'rgba(230,241,255,0.06)' },
                  width: 30,
                  height: 30,
                }}
              >
                {v === 'cards' ? <ViewCarouselIcon sx={{ fontSize: 18 }} /> : <ViewListIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            ))}
          </Box>
        </Box>

        <AnimatePresence mode="wait" initial={false}>
          {view === 'cards' ? (
            <motion.div
              key={`cards-${kind ?? 'all'}`}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Filmstrip items={visible} onOpen={setSelected} onActiveChange={setStageProject} reducedMotion={reducedMotion} />
            </motion.div>
          ) : (
            <motion.div
              key={`list-${kind ?? 'all'}`}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  display: { xs: 'none', md: 'grid' },
                  gridTemplateColumns: '110px 1.4fr 1.2fr 1fr auto',
                  columnGap: 3,
                  pb: 1,
                  ...MONO_SX,
                  opacity: 0.7,
                }}
              >
                <span>Year</span><span>Project</span><span>For</span><span>Kind</span><span />
              </Box>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                {visible.map(p => (
                  <Row key={p.slug} project={p} onOpen={setSelected} />
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* Detail view */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
        fullScreen={isTouch && typeof window !== 'undefined' && window.innerWidth < 600}
        aria-labelledby="project-dialog-title"
        PaperProps={{ sx: { backgroundImage: 'none', backgroundColor: '#0c1a30', border: HAIRLINE } }}
      >
        {selected && (
          <DialogContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <IconButton
              aria-label="Close"
              onClick={() => setSelected(null)}
              sx={{ position: 'absolute', right: 12, top: 12, zIndex: 1 }}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ ...MONO_SX, mb: 1.5, pr: 5 }}>
              {selected.org} · {selected.year} · {selected.kind.join(' · ')}
              {STATUS_NOTE[selected.status] && ` · ${STATUS_NOTE[selected.status]}`}
            </Box>
            <Typography
              id="project-dialog-title"
              variant="h3"
              component="h3"
              sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: { xs: '1.6rem', md: '2.1rem' }, lineHeight: 1.15, mb: 1.5 }}
            >
              {selected.title}
            </Typography>
            <Typography sx={{ fontSize: { xs: '1.05rem', md: '1.15rem' }, lineHeight: 1.55, mb: 3 }}>
              {selected.tagline}
            </Typography>

            {selectedImg && (
              <Box sx={{ mb: 3, borderRadius: 2.5, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(230,241,255,0.08)' }}>
                <img
                  src={selectedImg}
                  alt={`${selected.title} screenshot`}
                  width={selected.image?.width}
                  height={selected.image?.height}
                  decoding="async"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </Box>
            )}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                columnGap: 4,
                rowGap: 3,
                mb: 3,
              }}
            >
              <Box>
                <Box sx={{ ...MONO_SX, mb: 1 }}>What it is</Box>
                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.65, fontSize: '0.95rem' }}>
                  {selected.about}
                </Typography>
              </Box>
              <Box>
                <Box sx={{ ...MONO_SX, mb: 1 }}>What I did</Box>
                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.65, fontSize: '0.95rem', mb: selected.highlights ? 1.25 : 0 }}>
                  {selected.role}
                </Typography>
                {selected.highlights && (
                  <Box component="ul" sx={{ m: 0, pl: 2.25, color: 'text.secondary', fontSize: '0.92rem', lineHeight: 1.55, '& li': { mb: 0.6 }, '& li::marker': { color: 'primary.main' } }}>
                    {selected.highlights.map(h => <li key={h}>{h}</li>)}
                  </Box>
                )}
              </Box>
            </Box>

            <Box sx={{ borderTop: HAIRLINE, pt: 2, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1, minWidth: 220 }}>
                <Box sx={{ ...MONO_SX, mb: 0.75 }}>Outcome</Box>
                <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, ...MONO_SX, color: 'primary.main', display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 0.5 }}>
                  {selected.facts.map(f => <li key={f}>{f}</li>)}
                </Box>
              </Box>
              <Box sx={{ flex: 1, minWidth: 220 }}>
                <Box sx={{ ...MONO_SX, mb: 0.75 }}>Built with</Box>
                <Box sx={{ ...MONO_SX, color: 'text.primary' }}>{selected.tech.join(' · ')}</Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3 }}>
              {LINK_ORDER.filter(k => selected.links[k]).map((k, i) => (
                <Button
                  key={k}
                  component="a"
                  href={selected.links[k]}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={i === 0 ? 'contained' : 'outlined'}
                  startIcon={LINKS[k].icon}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '999px',
                    ...(i === 0
                      ? { backgroundColor: 'primary.main', color: 'background.default', '&:hover': { backgroundColor: 'primary.dark' } }
                      : { borderColor: 'rgba(230,241,255,0.2)', color: 'text.primary', '&:hover': { borderColor: 'primary.main', color: 'primary.main', backgroundColor: 'transparent' } }),
                  }}
                >
                  {LINKS[k].label}
                </Button>
              ))}
              {Object.keys(selected.links).length === 0 && (
                <Box sx={{ ...MONO_SX, alignSelf: 'center' }}>Not public.</Box>
              )}
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
};

export default ProjectsSection;
