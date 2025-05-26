import React from 'react';
import { Box, Typography, Container, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?cs=srgb&dl=pexels-ella-olsson-572949-1640773.jpg&fm=jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
        color: '#fff',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome to Lassi Corner
        </Typography>

        <Typography variant="h5" component="h2" color="rgba(255,255,255,0.8)" gutterBottom>
          Your favorite spot for chill vibes & cool sips — right here in Vamanjoor.
        </Typography>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.3)' }} />

        <Typography variant="body1" sx={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
          Nestled in the heart of Vamanjoor, Lassi Corner is more than just a café — it’s a cozy
          community hub where tradition meets taste. We specialize in handcrafted lassis,
          milkshakes, and fusion snacks that bring a refreshing twist to your day.
        </Typography>

        <Typography variant="body1" sx={{ mt: 3, fontSize: '1.125rem', lineHeight: 1.8 }}>
          Whether you're looking for a quiet place to relax, catch up with friends, or cool off
          after a hot day, our doors are always open. Come experience authentic flavors,
          comfortable ambiance, and the warm hospitality that makes Lassi Corner a Vamanjoor
          favorite.
        </Typography>

        <Button
          variant="contained"
          color="warning"
          size="large"
          sx={{ mt: 5, px: 4, py: 1.5, borderRadius: '30px', fontWeight: 'bold', color: '#fff', backgroundColor: '#000',
            '&:hover': {
              backgroundColor: '#302c2b', // darker shade for hover
            }, 
          }}
          onClick={() => navigate('/menu')}
        >
          Explore Our Menu
        </Button>
      </Container>
    </Box>
  );
}
