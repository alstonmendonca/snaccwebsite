import React from 'react';
import { Box, Typography, Stack, useTheme } from '@mui/material';
import { Star, EmojiPeople, MenuBook, WorkspacePremium } from '@mui/icons-material';

export default function BottomRatings() {
  const theme = useTheme();

  const stats = [
    {
      icon: <MenuBook fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      value: '40+',
      label: 'Menu Items',
    },
    {
      icon: <EmojiPeople fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      value: '15k+',
      label: 'Customers Served',
    },
    {
      icon: <Star fontSize="large" sx={{ color: '#FFD700' }} />,
      value: '4.9',
      label: 'Average Rating',
    },
    {
      icon: <WorkspacePremium fontSize="large" sx={{ color: theme.palette.secondary.main }} />,
      value: '5',
      label: 'Award Winning',
    },
  ];

  return (
    <Box
      sx={{
        mt: 2,
        px: { xs: 2, md: 10 },
        py: 8,
        bgcolor: 'rgba(255,255,255,0.07)',
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: 4,
      }}
    >
      {stats.map(({ icon, value, label }, i) => (
        <Stack
          key={i}
          spacing={1}
          alignItems="center"
          sx={{
            minWidth: 140,
            flex: '1 1 20%',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' },
            cursor: 'default',
          }}
        >
          <Box>{icon}</Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', md: '2.8rem' },
              color: '#fff',
              textShadow: '0 0 6px rgba(0,0,0,0.3)',
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              opacity: 0.75,
              color: '#eee',
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontWeight: 600,
            }}
          >
            {label}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}
