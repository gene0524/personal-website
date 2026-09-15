import React, { useMemo, useState } from 'react';
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
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import YouTubeIcon from '@mui/icons-material/YouTube';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CloseIcon from '@mui/icons-material/Close';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
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

type View = 'grid' | 'list';

// ── Meta line: "ORG · YEAR" in mono, optional status note ──────────────────
const Meta: React.FC<{ project: Project }> = ({ project }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, ...MONO_SX }}>
    <span>{project.org}</span>
    <span style={{ whiteSpace: 'nowrap' }}>
      {project.year}
      {STATUS_NOTE[project.status] && (
        <Box component="span" sx={{ ml: 1.5, color: 'rgba(255,184,107,0.9)' }}>
          {STATUS_NOTE[project.status]}
        </Box>
      )}
    </span>
  </Box>
);

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

// ── Grid tile ──────────────────────────────────────────────────────────────
interface TileProps {
  project: Project;
  onOpen: (p: Project) => void;
  reducedMotion: boolean;
  index: number;
}

const Tile: React.FC<TileProps> = ({ project, onOpen, reducedMotion, index }) => {
  const img = projectImageUrl(project);
  const live = project.links.live;

  return (
    <Box
      component={motion.article}
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index % 2, 1) * 0.08 }}
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, minWidth: 0 }}
    >
      <Meta project={project} />

      {/* Media: the whole tile opens the detail view; the live link is separate */}
      <Box
        role="button"
        tabIndex={0}
        aria-label={`${project.title}: open details`}
        onClick={() => onOpen(project)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(project); }
        }}
        sx={{
          position: 'relative',
          aspectRatio: '16 / 10',
          borderRadius: 2.5,
          overflow: 'hidden',
          cursor: 'pointer',
          backgroundColor: '#0d1b33',
          outline: 'none',
          '&:focus-visible': { boxShadow: '0 0 0 2px #00ff9d' },
          '& img': { transition: reducedMotion ? 'none' : 'transform 0.6s cubic-bezier(0.2,0.7,0.2,1)' },
          '&:hover img': { transform: reducedMotion ? 'none' : 'scale(1.03)' },
        }}
      >
        {img ? (
          <Box
            component="img"
            src={img}
            alt=""
            loading="lazy"
            decoding="async"
            width={project.image?.width}
            height={project.image?.height}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: project.image?.position ?? 'top',
              display: 'block',
            }}
          />
        ) : (
          <GeneratedCover project={project} />
        )}
        {/* hairline inset so light screenshots don't bleed into the page */}
        <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, borderRadius: 2.5, boxShadow: 'inset 0 0 0 1px rgba(230,241,255,0.08)', pointerEvents: 'none' }} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}>
        <Typography
          variant="h5"
          component="h3"
          sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.45rem' }, lineHeight: 1.2, m: 0 }}
        >
          <Box
            component="button"
            type="button"
            onClick={() => onOpen(project)}
            sx={{
              all: 'unset',
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' },
              '&:focus-visible': { outline: '2px solid #00ff9d', outlineOffset: 3, borderRadius: 0.5 },
            }}
          >
            {project.title}
          </Box>
        </Typography>
        {live && (
          <Box
            component="a"
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${project.title} (opens in new tab)`}
            sx={{
              ...MONO_SX,
              color: 'primary.main',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            visit <OpenInNewIcon sx={{ fontSize: 13 }} />
          </Box>
        )}
      </Box>

      <Typography variant="body2" sx={{ color: 'text.primary', fontSize: { xs: '0.95rem', md: '1rem' }, lineHeight: 1.55, m: 0 }}>
        {project.tagline}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.88rem', lineHeight: 1.5, m: 0 }}>
        {project.role}
      </Typography>

      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          m: 0,
          mt: 0.5,
          p: 0,
          pt: 1.25,
          borderTop: HAIRLINE,
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: 2,
          rowGap: 0.5,
          ...MONO_SX,
          color: 'primary.main',
        }}
      >
        {project.facts.slice(0, 3).map(f => (
          <li key={f}>{f}</li>
        ))}
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
  const [view, setView] = useState<View>('grid');
  const [kind, setKind] = useState<string | null>(null);
  const isTouch = useMediaQuery('(hover: none)');
  const reducedMotion = !!useReducedMotion();

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
        py: { xs: 8, md: 10 },
        position: 'relative',
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'none', md: 'always' },
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading id="projects-heading" number="03." title="Work" mb={{ xs: 2, md: 2.5 }} />

        {/* Intro */}
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 620, m: 0, mb: { xs: 2.5, md: 3 } }}>
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
            mb: { xs: 3, md: 4 },
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
            {(['grid', 'list'] as View[]).map(v => (
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
                {v === 'grid' ? <GridViewIcon sx={{ fontSize: 16 }} /> : <ViewListIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            ))}
          </Box>
        </Box>

        <AnimatePresence mode="wait" initial={false}>
          {view === 'grid' ? (
            <motion.div
              key={`grid-${kind ?? 'all'}`}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                  columnGap: { md: 5 },
                  rowGap: { xs: 5, md: 6 },
                }}
              >
                {visible.map((p, i) => (
                  <Tile key={p.slug} project={p} index={i} onOpen={setSelected} reducedMotion={reducedMotion} />
                ))}
              </Box>
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
