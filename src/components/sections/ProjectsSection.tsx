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
        minHeight: { xs: 'auto', md: '100vh' },
        height: { xs: 'auto', md: '100vh' },
        py: { xs: 8, md: 8 }, // 從12減小到8
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
              mb: { xs: 3, md: 4 }, // 移動版從mb: 4減小到mb: 3
              textAlign: 'center',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' } 
            }}
          >
            My Projects
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1.5, md: 4 }, // 移動版從gap: 2減小到gap: 1.5
              overflowX: 'auto',
              pb: { xs: 2, md: 3 }, // 移動版從pb: 3減小到pb: 2
              mx: { xs: -0.5, md: -2 }, // 移動版從mx: -1減小到mx: -0.5
              px: { xs: 0.5, md: 2 }, // 移動版從px: 1減小到px: 0.5
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
              scrollPadding: { xs: '0 8px', md: '0 24px' }, // 移動版從'0 16px'減小到'0 8px'
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
                  minWidth: { xs: '75vw', sm: '65vw', md: '35%' }, // 移動版從80vw/70vw減小到75vw/65vw
                  maxWidth: { xs: '75vw', sm: '65vw', md: '35%' }, // 移動版從80vw/70vw減小到75vw/65vw
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
                  height="150" // 從175減小到150
                  image={project.image}
                  alt={project.title}
                  sx={{
                    objectFit: 'cover',
                    borderBottom: '1px solid',
                    borderColor: 'primary.main',
                  }}
                />
                <CardContent sx={{ p: { xs: 1.2, md: 2.5 } }}> {/* 移動版從p: 1.5減小到p: 1.2 */}
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '1.2rem', md: '1.6rem' }, // 移動版從1.3rem減小到1.2rem
                      mb: { xs: 0.3, md: 1.5 }, // 移動版從0.5減小到0.3
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700
                    }}
                  >
                    {project.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      mb: { xs: 1.5, md: 2 }, // 移動版從mb: 2減小到mb: 1.5
                      fontSize: { xs: '0.85rem', md: '1.1rem' }, // 移動版從0.9rem減小到0.85rem
                      lineHeight: 1.4, // 從1.5減小到1.4
                    }}
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {project.description}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 0.5, // 從0.75減小到0.5
                  }}>
                    {project.technologies.map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech}
                        size="small"
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'background.paper',
                          fontSize: { xs: '0.65rem', md: '0.9rem' }, // 移動版從0.7rem減小到0.65rem
                          height: { xs: '20px', md: '28px' }, // 移動版從22px減小到20px
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