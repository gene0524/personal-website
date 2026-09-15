import { Box, Typography } from '@mui/material';
import { FONT_MONO } from '../themes';

interface SectionHeadingProps {
  id?: string;
  number: string;
  title: string;
  mb?: number | string | Record<string, number | string>;
}

const SectionHeading = ({ id, number, title, mb = { xs: 3, md: 5 } }: SectionHeadingProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb }}>
    <Typography
      variant="h2"
      id={id}
      sx={{
        display: 'flex',
        alignItems: 'baseline',
        fontWeight: 700,
        fontSize: { xs: '2rem', md: '2.5rem' },
        mr: { xs: 0, md: 3 },
        m: 0,
      }}
    >
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          color: 'primary.main',
          fontFamily: FONT_MONO,
          fontSize: { xs: '1rem', md: '1.15rem' },
          fontWeight: 400,
          mr: 1.5,
          userSelect: 'none',
        }}
      >
        {number}
      </Box>
      {title}
    </Typography>
    <Box
      aria-hidden="true"
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
