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
const CountryCard: React.FC<{ visit: CountryVisit }> = ({ visit }) => (
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
        sx={{ fontWeight: 700, mb: 1.5, fontSize: { xs: '1.15rem', md: '1.3rem' } }}
      >
        {visit.badge} {visit.name}
      </Typography>

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
        {/* {count} countries */}40+ countries · hover a glowing one
      </Typography>
    </Box>
  </motion.div>
);

// ─── Main section ──────────────────────────────────────────────────────────
const TravelSection: React.FC = () => {
  const globeRef    = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [countries,     setCountries]     = useState<GeoFeature[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<GeoFeature | null>(null);
  const [hoveredVisit,   setHoveredVisit]   = useState<CountryVisit | null>(null);
  const [globeSize,      setGlobeSize]      = useState(420);

  // Fetch world atlas
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
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
      const visit = visitedCountries.find(c => c.id === toNumId(f));
      setHoveredVisit(visit ?? null);
      globeRef.current?.controls && (globeRef.current.controls().autoRotate = false);
    } else {
      setHoveredVisit(null);
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
            sx={{
              flex: { md: '0 0 60%' },
              width: { xs: '100%', md: '60%' },
              display: 'flex',
              justifyContent: 'center',
              // Strip the Three.js canvas background so it blends in
              '& canvas': { background: 'transparent !important' },
            }}
          >
            {countries.length > 0 && (
              <Globe
                ref={globeRef}
                width={globeSize}
                height={globeSize}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
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
                  // On touch devices hover doesn't fire — use click instead
                  if (window.matchMedia('(hover: none)').matches) handleHover(feat);
                }}
                polygonsTransitionDuration={200}
              />
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
              {hoveredVisit ? (
                <CountryCard key={hoveredVisit.id} visit={hoveredVisit} />
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
