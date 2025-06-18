import React from 'react';
import { Box, Typography, Button, Container, Grid, useTheme, useMediaQuery, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowRightAlt, LocalBar, Coffee, Restaurant, Fastfood, Savings, Blender } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import FeatureScroll from '../components/FeatureScroll';
import BottomRatings from '../components/BottomRatings';
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        linear-gradient(45deg, 
          rgba(0,0,0,0.6) 0%, 
          rgba(18,18,18,0.8) 100%),
        url('/background.jpg')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#fff',
      py: 10,
      px: 2,
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          {/* Hero Section */}
<Grid
  item
  xs={12}
  md={6}
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: { xs: 'center', md: 'left' },
    px: { xs: 2, md: 0 },
  }}
>
  <Fade in timeout={800}>
    <Box
      sx={{
        maxWidth: 500,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: { xs: 'center', md: 'flex-start' },
        gap: 3,
        mb: 10,
        px: { xs: 0, md: 6 },
        pr: { xs: 0, md: 10 },
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: 900,
          fontSize: isMobile ? '3rem' : '4.5rem',
          lineHeight: 1.1,
          mb: 1,
          textTransform: 'uppercase',
          background: 'linear-gradient(45deg, #ffffff 35%, #aaaaaa 85%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
        }}
      >
        Lassi Corner
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          fontSize: '1.25rem',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.9)',
          maxWidth: 420,
          textShadow: '0 0 5px rgba(0,0,0,0.4)',
        }}
      >
        Order right from your classroom or office. <br />
        Take a break, buy a sandwich.
      </Typography>

      <Button
        variant="contained"
        color="inherit"
        endIcon={<ArrowRightAlt />}
        onClick={() => navigate('/menu')}
        sx={{
          px: 6,
          py: 2.2,
          borderRadius: '50px',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#000',
          bgcolor: '#fff',
          boxShadow: '0 4px 10px rgba(255,255,255,0.6)',
          '&:hover': {
            bgcolor: '#f5f5f5',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 14px rgba(255,255,255,0.8)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          alignSelf: { xs: 'center', md: 'flex-start' },
        }}
      >
        Explore Menu
      </Button>
    </Box>
  </Fade>
</Grid>


          {/* Feature Icons */}
          <Grid item xs={12} md={6}>
            <FeatureScroll />
          </Grid>
        </Grid>

        {/* Stats Section */}
        <BottomRatings />
      </Container>
    </Box>
  );
}