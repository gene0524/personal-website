import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  useTheme,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { projects } from '../../data/projects';

const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="projects"
      sx={{
        minHeight: '100vh',
        height: { xs: 'auto', md: '100vh' },
        py: { xs: 8, md: 12 },
        position: 'relative',
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'none', md: 'always' },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg" sx={{ height: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            sx={{
              mb: 6,
              textAlign: 'center',
              fontWeight: 700,
            }}
          >
            My Projects
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: { xs: 3, md: 6 },
              overflowX: 'auto',
              pb: 4,
              mx: { xs: -2, md: -4 },
              px: { xs: 2, md: 4 },
              '&::-webkit-scrollbar': {
                height: 4,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'background.paper',
                borderRadius: 2,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'primary.main',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
              scrollSnapType: 'x mandatory',
              scrollPadding: { xs: '0 16px', md: '0 24px' },
            }}
          >
            {projects.map((project, index) => (
              <Card
                key={project.title}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                sx={{
                  minWidth: { xs: '80vw', md: '45%' },
                  maxWidth: { xs: '80vw', md: '45%' },
                  scrollSnapAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0, 255, 157, 0.2)',
                  },
                }}
                onClick={() => setSelectedProject(project)}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={project.image}
                  alt={project.title}
                  sx={{
                    objectFit: 'cover',
                    borderBottom: '1px solid',
                    borderColor: 'primary.main',
                  }}
                />
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '1.5rem', md: '1.75rem' },
                      mb: { xs: 1, md: 2 }
                    }}
                  >
                    {project.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      mb: 3,
                      fontSize: { xs: '1rem', md: '1.25rem' },
                      lineHeight: 1.6,
                    }}
                  >
                    {project.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {project.technologies.map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech}
                        size="small"
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'background.paper',
                          fontSize: { xs: '0.8rem', md: '1rem' },
                          height: { xs: '24px', md: '32px' },
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </motion.div>
      </Container>

      <Dialog
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedProject && (
          <>
            <DialogTitle sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>{selectedProject.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: theme.shape.borderRadius,
                  }}
                />
              </Box>
              <Typography 
                variant="body1" 
                paragraph
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                }}
              >
                {selectedProject.longDescription}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {selectedProject.technologies.map((tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    size="small"
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'background.paper',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      height: { xs: '28px', md: '32px' },
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
                  sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
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
                  sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
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
                  sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
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