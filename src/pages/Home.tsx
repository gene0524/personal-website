import React from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import { motion } from 'framer-motion';

const projects = [
  {
    id: 1,
    title: 'Project 1',
    description: 'This is my first project description',
    image: '/path/to/image1.jpg'
  },
  {
    id: 2,
    title: 'Project 2',
    description: 'This is my second project description',
    image: '/path/to/image2.jpg'
  }
  // Add more projects here
];

const Home: React.FC = () => {
  return (
    <Box>
      {/* Personal Introduction Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Hello, I'm [Your Name]
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Frontend Developer / UI Designer
        </Typography>
        <Typography variant="body1" paragraph>
          Here you can write about yourself, your skills, experience, and interests.
        </Typography>
      </motion.div>

      {/* Portfolio Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          My Work
        </Typography>
        <Grid container spacing={4}>
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={project.image}
                    alt={project.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h3">
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home; 