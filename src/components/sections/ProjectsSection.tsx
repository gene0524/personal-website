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
        py: { xs: 4, md: 8 }, // Reduced padding
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
              mb: 4, // Reduced from 6 to 4
              textAlign: 'center',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' } // Added for better scaling
            }}
          >
            My Projects
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: { xs: 2, md: 4 }, // Reduced gap
              overflowX: 'auto',
              pb: 3, // Reduced padding
              mx: { xs: -1, md: -2 }, // Reduced margin
              px: { xs: 1, md: 2 }, // Reduced padding
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
                  minWidth: { xs: '80vw', sm: '70vw', md: '35%' }, // Reduced from 80vw to 70vw on mobile, 45% to 30% on desktop
                  maxWidth: { xs: '80vw', sm: '70vw', md: '35%' }, // Same reduction
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
                  height="175"
                  image={project.image}
                  alt={project.title}
                  sx={{
                    objectFit: 'cover',
                    borderBottom: '1px solid',
                    borderColor: 'primary.main',
                  }}
                />
                <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}> {/* Reduced padding */}
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '1.3rem', md: '1.6rem' }, // Reduced font size
                      mb: { xs: 0.5, md: 1.5 } // Reduced margin
                    }}
                  >
                    {project.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      mb: 2, // Reduced margin
                      fontSize: { xs: '0.9rem', md: '1.1rem' }, // Reduced font size
                      lineHeight: 1.5, // Reduced line height
                    }}
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {project.description}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />  {/* This pushes the chips to the bottom */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 0.75,
                  }}> {/* Reduced gap and margin */}
                    {project.technologies.map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech}
                        size="small"
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'background.paper',
                          fontSize: { xs: '0.7rem', md: '0.9rem' }, // Reduced font size
                          height: { xs: '22px', md: '28px' }, // Reduced height
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
            <DialogTitle sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' } }}>{selectedProject.title}</DialogTitle>
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
                  fontSize: { xs: '1rem', md: '1.1rem' }, // Reduced font size
                  lineHeight: 1.5, // Reduced line height
                }}
              >
                {selectedProject.longDescription}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}> {/* Reduced gap and margin */}
                {selectedProject.technologies.map((tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    size="small"
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'background.paper',
                      fontSize: { xs: '0.8rem', md: '0.9rem' }, // Reduced font size
                      height: { xs: '24px', md: '28px' }, // Reduced height
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
                  sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }} // Reduced font size
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
                  sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }} // Reduced font size
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
                  sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }} // Reduced font size
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