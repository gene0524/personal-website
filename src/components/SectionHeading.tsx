import { Box, Typography } from '@mui/material';

interface SectionHeadingProps {
  number: string;
  title: string;
}

const SectionHeading = ({ number, title }: SectionHeadingProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, md: 5 } }}>
    <Typography
      component="span"
      sx={{
        color: 'primary.main',
        fontFamily: '"Space Mono", monospace',
        fontSize: { xs: '1rem', md: '1.15rem' },
        mr: 1.5,
        fontWeight: 400,
        userSelect: 'none',
      }}
    >
      {number}
    </Typography>
    <Typography
      variant="h2"
      component="span"
      sx={{
        fontWeight: 700,
        fontSize: { xs: '2rem', md: '2.5rem' },
        mr: { xs: 0, md: 3 },
      }}
    >
      {title}
    </Typography>
    <Box
      sx={{
        flex: 1,
        height: '1px',
        backgroundColor: 'divider',
        display: { xs: 'none', md: 'block' },
      }}
    />
  </Box>
);

export default SectionHeading;
