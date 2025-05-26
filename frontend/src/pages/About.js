import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

export default function About() {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      sx={{
        maxWidth: 800,
        mx: 'auto',
        mt: { xs: 6, md: 10 },
        px: { xs: 2, sm: 4 },
        py: { xs: 3, md: 5 },
        backgroundColor: '#111',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(255,255,255,0.05)',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Optimized Hero Image */}
      <Box
        component="img"
        src="https://media-cdn.tripadvisor.com/media/photo-s/2c/86/d8/d8/brunch-californien-waffle.jpg"
        alt="Lassi Corner"
        loading="lazy"
        sx={{
          width: '100%',
          height: { xs: 180, sm: 250 },
          objectFit: 'cover',
          objectPosition: 'center 70%',
          borderRadius: 2,
          mb: { xs: 2, sm: 3 },
          filter: 'brightness(0.95)',
          transform: 'translateZ(0)', // Hardware acceleration
        }}
      />

      <Typography 
        variant="h4" 
        align="center" 
        sx={{ 
          fontWeight: 700, 
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2rem' },
          lineHeight: 1.3
        }}
      >
        About Lassi Corner
      </Typography>

      <Typography 
        variant="body1" 
        sx={{ 
          color: '#ddd',
          lineHeight: 1.7,
          fontSize: { xs: '0.9rem', sm: '1rem' },
          '& strong': {
            color: theme.palette.primary.main
          }
        }}
      >
        Welcome to <strong>Lassi Corner</strong> – your destination for refreshing, 
        handcrafted lassis and delicious treats. We blend tradition with innovation 
        in every sip.
        <br /><br />
        From classic mango to exotic rose almond or masala mint, discover flavors 
        that excite your taste buds.
        <br /><br />
        We prioritize quality ingredients and a cozy atmosphere – pouring our heart 
        into every glass.
        <br /><br />
        Thank you for joining our journey. Stay cool and refreshed!
      </Typography>
    </Box>
  );
}