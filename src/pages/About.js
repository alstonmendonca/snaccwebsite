import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      sx={{
        maxWidth: 800,
        mx: 'auto',
        mt: 10,
        px: 4,
        py: 5,
        backgroundColor: '#111',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(255,255,255,0.1)',
        color: '#fff',
      }}
    >
      {/* Hero Image */}
      <Box
        component="img"
        src="https://media-cdn.tripadvisor.com/media/photo-s/2c/86/d8/d8/brunch-californien-waffle.jpg"
        alt="Lassi Corner"
        sx={{
          width: '100%',
          height: 250,
          objectFit: 'cover',
          borderRadius: 2,
          mb: 3,
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}
      />

      <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 3 }}>
        About Lassi Corner
      </Typography>

      <Typography variant="body1" sx={{ color: '#ccc', lineHeight: 1.8 }}>
        Welcome to <strong>Lassi Corner</strong> – your go-to destination for refreshing, handcrafted lassis
        and a variety of delicious treats. We pride ourselves on blending tradition with taste, offering
        flavors that are both nostalgic and innovative.
        <br /><br />
        Whether you're a fan of the classic mango lassi or looking to explore something exotic like rose
        almond or masala mint, we've got something to excite your taste buds.
        <br /><br />
        At Lassi Corner, quality and experience come first. From carefully sourced ingredients to a cozy,
        friendly vibe – we pour our heart into every glass.
        <br /><br />
        Thank you for being a part of our journey. Stay cool, stay refreshed!
      </Typography>
    </Box>
  );
}
