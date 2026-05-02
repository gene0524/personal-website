import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { projects } from '../../data/projects';
import SectionHeading from '../SectionHeading';

const handleTiltMove = (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const relX = (e.clientX - rect.left) / rect.width - 0.5;
  const relY = (e.clientY - rect.top) / rect.height - 0.5;
  el.style.transform = `perspective(900px) rotateX(${-relY * 10}deg) rotateY(${relX * 10}deg) scale(1.02)`;
};

const handleTiltLeave = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.transition = 'transform 0.4s ease';
  e.currentTarget.style.transform =
    'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
};

const handleTiltEnter = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.transition = 'transform 0.1s ease';
};

const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollActiveIndex, setScrollActiveIndex] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const theme = useTheme();

  // On touch devices: track the most-centred card while scrolling
  const updateScrollActive = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const containerMid = container.getBoundingClientRect().left + container.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - containerMid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    setScrollActiveIndex(best);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !window.matchMedia('(hover: none)').matches) return;
    container.addEventListener('scroll', updateScrollActive, { passive: true });
    updateScrollActive();
    return () => container.removeEventListener('scroll', updateScrollActive);
  }, [updateScrollActive]);

  // Spotlight index: hover takes priority on desktop; scroll-active on touch
  const spotlightIndex = hoveredIndex !== null
    ? hoveredIndex
    : window.matchMedia('(hover: none)').matches ? scrollActiveIndex : null;

  return (
    <Box
      component="section"
      id="projects"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        height: { xs: 'auto', md: '100vh' },
        py: { xs: 8, md: 8 },
        position: 'relative',
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'none', md: 'always' },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading number="03." title="Projects" />

        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: { xs: 1.5, md: 3.5 },
            overflowX: 'auto',
            pt: { xs: 2, md: 3 },
            pb: { xs: 2, md: 3 },
            mx: { xs: -0.5, md: -2 },
            px: { xs: 0.5, md: 2 },
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-track': { backgroundColor: 'background.paper', borderRadius: 2 },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'primary.main',
              borderRadius: 2,
              '&:hover': { backgroundColor: 'primary.dark' },
            },
          }}
        >
          {projects.map((project, index) => (
            /* Tilt wrapper — separate from framer-motion to avoid transform conflict */
            <Box
              key={project.title}
              ref={(el) => { cardRefs.current[index] = el as HTMLElement | null; }}
              onMouseMove={handleTiltMove}
              onMouseLeave={(e) => { handleTiltLeave(e); setHoveredIndex(null); }}
              onMouseEnter={(e) => { handleTiltEnter(e); setHoveredIndex(index); }}
              sx={{
                minWidth: { xs: '75vw', sm: '60vw', md: '34%' },
                maxWidth: { xs: '75vw', sm: '60vw', md: '34%' },
                scrollSnapAlign: { xs: 'start', md: 'center' },
                flexShrink: 0,
                transformStyle: 'preserve-3d',
                opacity: spotlightIndex === null || spotlightIndex === index ? 1 : 0.25,
                transition: 'opacity 0.3s ease',
              }}
            >
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedProject(project)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'rgba(0,255,157,0.25)',
                  height: '100%',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 16px 40px rgba(0,255,157,0.12)',
                  },
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
              >
                <CardMedia
                  component="img"
                  height="150"
                  image={project.image}
                  alt={project.title}
                  sx={{
                    objectFit: 'cover',
                    borderBottom: '1px solid rgba(0,255,157,0.15)',
                  }}
                />
                <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.1rem', md: '1.5rem' },
                      mb: { xs: 0.5, md: 1 },
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {project.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: { xs: 1.5, md: 2 },
                      fontSize: { xs: '0.92rem', md: '1rem' },
                      lineHeight: 1.5,
                    }}
                  >
                    {project.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {project.technologies.map(tech => (
                      <Chip
                        key={tech}
                        label={tech}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0,255,157,0.1)',
                          color: 'primary.main',
                          border: '1px solid rgba(0,255,157,0.25)',
                          fontSize: { xs: '0.72rem', md: '0.8rem' },
                          height: { xs: '22px', md: '26px' },
                          fontFamily: '"Space Mono", monospace',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      <Dialog
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedProject && (
          <>
            <DialogTitle sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' } }}>
              {selectedProject.title}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  style={{ width: '100%', height: 'auto', borderRadius: theme.shape.borderRadius }}
                />
              </Box>
              <Typography variant="body1" paragraph sx={{ fontSize: { xs: '1rem', md: '1.05rem' }, lineHeight: 1.6 }}>
                {selectedProject.longDescription}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {selectedProject.technologies.map(tech => (
                  <Chip
                    key={tech}
                    label={tech}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(0,255,157,0.1)',
                      color: 'primary.main',
                      border: '1px solid rgba(0,255,157,0.25)',
                      fontFamily: '"Space Mono", monospace',
                    }}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              {selectedProject.githubUrl && (
                <Button
                  component="a"
                  startIcon={<GitHubIcon />}
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Button>
              )}
              {selectedProject.demoUrl && (
                <Button
                  component="a"
                  startIcon={<YouTubeIcon />}
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Demo
                </Button>
              )}
              {selectedProject.paperUrl && (
                <Button
                  component="a"
                  startIcon={<ArticleIcon />}
                  href={selectedProject.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Paper
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ProjectsSection;
