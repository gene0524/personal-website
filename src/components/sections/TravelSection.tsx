import React, { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import { Box, Typography, Container } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../SectionHeading';
import { visitedCountries, visitedIds } from '../../data/travel';
import type { CountryVisit } from '../../data/travel';

interface GeoFeature {
  type: string;
  properties: { name?: string };
  geometry: object;
  id?: string | number;
}

const VISITED_COLOR = 'rgba(0,255,157,0.52)';
const DEFAULT_COLOR = 'rgba(255,255,255,0.04)';
const HOVER_COLOR   = 'rgba(0,255,157,0.92)';

const toNumId = (f: GeoFeature) =>
  typeof f.id === 'string' ? parseInt(f.id, 10) : (f.id as number ?? -1);

// ─── Hover card ────────────────────────────────────────────────────────────
const CountryCard: React.FC<{ visit: CountryVisit; isPinned?: boolean }> = ({ visit, isPinned }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 12 }}
    transition={{ duration: 0.22 }}
    style={{ width: '100%' }}
  >
    <Box
      sx={{
        background: 'rgba(10,15,20,0.78)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,255,157,0.28)',
        borderRadius: 3,
        p: { xs: 2, md: 2.5 },
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: isPinned ? 0.5 : 1.5, fontSize: { xs: '1.15rem', md: '1.3rem' } }}
      >
        {visit.badge} {visit.name}
      </Typography>

      {isPinned && (
        <Typography
          variant="caption"
          sx={{ display: 'block', color: 'primary.main', fontFamily: '"Space Mono", monospace', fontSize: '0.7rem', mb: 1.5, opacity: 0.7 }}
        >
          📌 pinned · click again to release
        </Typography>
      )}

      {visit.photos.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mb: 1.5,
            overflowX: visit.photos.length > 2 ? 'auto' : 'visible',
            scrollSnapType: visit.photos.length > 2 ? 'x mandatory' : 'none',
            '&::-webkit-scrollbar': { height: 3 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,255,157,0.4)', borderRadius: 2 },
          }}
        >
          {visit.photos.map((src, i) => (
            <Box
              key={i}
              component="img"
              src={src}
              alt=""
              sx={{
                width: 'calc(50% - 4px)',
                flexShrink: 0,
                height: { xs: 90, md: 120 },
                objectFit: 'cover',
                borderRadius: 2,
                display: 'block',
                scrollSnapAlign: 'start',
              }}
            />
          ))}
        </Box>
      )}

      {visit.note && (
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', lineHeight: 1.65, fontSize: '0.9rem' }}
        >
          {visit.note}
        </Typography>
      )}
    </Box>
  </motion.div>
);

// ─── Idle hint ─────────────────────────────────────────────────────────────
const IdleHint: React.FC<{ count: number }> = ({ count }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Box sx={{ textAlign: 'center', userSelect: 'none' }}>
      <PublicIcon sx={{ fontSize: '2.8rem', color: 'primary.main', opacity: 0.18, mb: 1 }} />
      <Typography
        variant="body2"
        sx={{
          fontFamily: '"Space Mono", monospace',
          fontSize: '0.75rem',
          color: 'text.secondary',
          opacity: 0.45,
        }}
      >
        {/* {count} countries */}40+ countries · tap to explore · hold to zoom
      </Typography>
    </Box>
  </motion.div>
);

// ─── Main section ──────────────────────────────────────────────────────────
const TravelSection: React.FC = () => {
  const globeRef    = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [countries,      setCountries]      = useState<GeoFeature[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<GeoFeature | null>(null);
  const [hoveredVisit,   setHoveredVisit]   = useState<CountryVisit | null>(null);
  const [pinnedVisit,    setPinnedVisit]    = useState<CountryVisit | null>(null);
  const [isZoomed,       setIsZoomed]       = useState(false);
  const [globeSize,      setGlobeSize]      = useState(420);
  const longPressTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mouseDownPos     = useRef<{ x: number; y: number } | null>(null);

  const displayVisit = pinnedVisit ?? hoveredVisit;

  const resetZoom = useCallback(() => {
    globeRef.current?.pointOfView({ lat: 20, lng: 10, altitude: 1.8 }, 600);
    setIsZoomed(false);
  }, []);

  // Shared zoom-in logic given a clientX/Y position
  const triggerZoom = useCallback((clientX: number, clientY: number) => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const coords = globeRef.current?.toGlobeCoords?.(clientX - rect.left, clientY - rect.top);
    if (coords) {
      globeRef.current.pointOfView({ lat: coords.lat, lng: coords.lng, altitude: 0.5 }, 600);
      setIsZoomed(true);
    }
  }, []);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  // Touch long-press
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    longPressTimer.current = setTimeout(() => triggerZoom(clientX, clientY), 500);
  }, [triggerZoom]);

  // Mouse long-press (desktop) — cancel if mouse moves > 6px (i.e. user is rotating)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    const { clientX, clientY } = e;
    longPressTimer.current = setTimeout(() => triggerZoom(clientX, clientY), 500);
  }, [triggerZoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!longPressTimer.current || !mouseDownPos.current) return;
    const dx = e.clientX - mouseDownPos.current.x;
    const dy = e.clientY - mouseDownPos.current.y;
    if (dx * dx + dy * dy > 36) { // 6px threshold
      cancelLongPress();
      mouseDownPos.current = null;
    }
  }, [cancelLongPress]);

  // Release pin when clicking empty globe space (ocean / non-visited)
  const handleGlobeClick = useCallback(() => {
    if (pinnedVisit) {
      setPinnedVisit(null);
      globeRef.current?.controls && (globeRef.current.controls().autoRotate = true);
    }
  }, [pinnedVisit]);

  // Fetch world atlas (self-hosted — see public/globe/)
  useEffect(() => {
    fetch('/globe/countries-110m.json')
      .then(r => r.json())
      .then((topo: Topology) => {
        const geo = feature(
          topo,
          topo.objects.countries as GeometryCollection,
        ) as unknown as { features: GeoFeature[] };
        setCountries(geo.features);
      })
      .catch(console.error);
  }, []);

  // Globe controls — runs once countries are loaded
  useEffect(() => {
    const g = globeRef.current;
    if (!g || countries.length === 0) return;
    g.controls().autoRotate      = true;
    g.controls().autoRotateSpeed = 0.4;
    g.controls().enableZoom      = false;
    g.pointOfView({ lat: 20, lng: 10, altitude: 1.8 }, 0);
  }, [countries]);

  // Pause the globe's render loop while the section is offscreen so it
  // doesn't compete with scrolling elsewhere on the page.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || countries.length === 0) return;
    const io = new IntersectionObserver(([entry]) => {
      const g = globeRef.current;
      if (!g?.pauseAnimation) return;
      if (entry.isIntersecting) g.resumeAnimation();
      else g.pauseAnimation();
    }, { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, [countries]);

  // Responsive sizing via ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setGlobeSize(Math.min(e.contentRect.width, 520));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const getCountryColor = useCallback(
    (feat: object) => {
      const f = feat as GeoFeature;
      if (hoveredCountry && f.id === hoveredCountry.id) return HOVER_COLOR;
      return visitedIds.has(toNumId(f)) ? VISITED_COLOR : DEFAULT_COLOR;
    },
    [hoveredCountry],
  );

  const handleHover = useCallback((feat: object | null) => {
    const f = feat as GeoFeature | null;
    setHoveredCountry(f);
    if (f) {
      if (!pinnedVisit) {
        setHoveredVisit(visitedCountries.find(c => c.id === toNumId(f)) ?? null);
      }
      globeRef.current?.controls && (globeRef.current.controls().autoRotate = false);
    } else {
      if (!pinnedVisit) {
        setHoveredVisit(null);
        globeRef.current?.controls && (globeRef.current.controls().autoRotate = true);
      }
    }
  }, [pinnedVisit]);

  const handleClick = useCallback((feat: object) => {
    const f = feat as GeoFeature;
    const visit = visitedCountries.find(c => c.id === toNumId(f));
    if (visit) {
      setPinnedVisit(prev => {
        const unpinning = prev?.id === visit.id;
        // Resume rotation when unpinning and not currently hovering
        if (unpinning) globeRef.current?.controls && (globeRef.current.controls().autoRotate = true);
        return unpinning ? null : visit;
      });
    } else {
      setPinnedVisit(null);
      globeRef.current?.controls && (globeRef.current.controls().autoRotate = true);
    }
  }, []);

  return (
    <Box
      component="section"
      id="travel"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        py: { xs: 6, md: 0 },
        pt: { md: 8 },
        position: 'relative',
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'none', md: 'always' },
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading number="04." title="Travel" mb={{ xs: 1, md: 1.5 }} />

        {/* Humorous subtitle */}
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: { xs: 1.5, md: 2 },
            maxWidth: 580,
            lineHeight: 1.75,
          }}
        >
          Besides shipping code, I seem to have a chronic inability to stay in one place.{' '}
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
            {/* {visitedCountries.length} countries */}
            40+ countries
          </Box>{' '}
          in — still no cure found, not really looking for one.
        </Typography>

        {/* Globe + card layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 2, md: 3 },
          }}
        >
          {/* Globe */}
          <Box
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={cancelLongPress}
            onTouchMove={cancelLongPress}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={cancelLongPress}
            onMouseLeave={cancelLongPress}
            onContextMenu={(e) => e.preventDefault()}
            // eslint-disable-next-line react/forbid-component-props
            style={{ WebkitTouchCallout: 'none' } as React.CSSProperties}
            sx={{
              flex: { md: '0 0 60%' },
              width: { xs: '100%', md: '60%' },
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              // Suppress iOS long-press callout and Android text selection
              '& canvas': {
                background: 'transparent !important',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'none',
              },
            }}
          >
            {/* Wrapper sized to match the canvas so the button stays inside the globe */}
            {countries.length > 0 && (
              <Box sx={{ position: 'relative', width: globeSize, height: globeSize, flexShrink: 0 }}>
                {isZoomed && (
                  <Box
                    onClick={resetZoom}
                    sx={{
                      position: 'absolute',
                      bottom: 14,
                      right: 14,
                      zIndex: 10,
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      border: '1px solid rgba(0,255,157,0.4)',
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', color: 'primary.main', fontFamily: '"Space Mono", monospace' }}>
                      🔍 zoom out
                    </Typography>
                  </Box>
                )}
                <Globe
                ref={globeRef}
                width={globeSize}
                height={globeSize}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="/globe/earth-night.jpg"
                atmosphereColor="#00c8ff"
                atmosphereAltitude={0.18}
                polygonsData={countries}
                polygonAltitude={0.006}
                polygonCapColor={getCountryColor}
                polygonSideColor={() => 'rgba(0,255,157,0.06)'}
                polygonStrokeColor={() => 'rgba(0,255,157,0.18)'}
                polygonLabel={(feat: object) => {
                  const f = feat as GeoFeature;
                  const visit = visitedCountries.find(c => c.id === toNumId(f));
                  if (!visit) return '';
                  return `<div style="background:rgba(0,0,0,0.72);color:#00ff9d;padding:5px 10px;border-radius:6px;font-family:monospace;font-size:13px;border:1px solid rgba(0,255,157,0.3)">${visit.badge} ${visit.name}</div>`;
                }}
                onPolygonHover={handleHover}
                onPolygonClick={(feat: object) => {
                  cancelLongPress();
                  if (window.matchMedia('(hover: none)').matches) handleHover(feat);
                  handleClick(feat);
                }}
                onGlobeClick={handleGlobeClick}
                polygonsTransitionDuration={200}
              />
              </Box>
            )}
          </Box>

          {/* Right: hover card or idle hint */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' },
              minHeight: { xs: 160, md: 280 },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <AnimatePresence mode="wait">
              {displayVisit ? (
                <CountryCard key={displayVisit.id} visit={displayVisit} isPinned={!!pinnedVisit} />
              ) : (
                <IdleHint key="hint" count={visitedCountries.length} />
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TravelSection;
