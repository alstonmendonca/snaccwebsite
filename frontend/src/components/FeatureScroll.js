import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import {
  LocalBar,
  Coffee,
  Restaurant,
  Fastfood,
  Savings,
  Blender
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const scroll = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-100%, 0, 0); }
`;

const items = [
  { icon: <LocalBar />, title: 'Milkshakes' },
  { icon: <Coffee />, title: 'Beverages' },
  { icon: <Restaurant />, title: 'Modern Bites' },
  { icon: <Fastfood />, title: 'Burgers' },
  { icon: <Savings />, title: 'Budget Friendly' },
  { icon: <Blender />, title: 'Fresh' }
];

export default function FeatureScroll() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  // Responsive sizes
  const iconSize = isSm ? 32 : 50;
  const boxWidth = isXs ? 140 : isSm ? 180 : 220;
  const boxPadding = isSm ? 1.5 : 4;
  const fontSize = isSm ? '0.7rem' : '0.9rem';

  // Animation speeds (as per your request)
  const scrollDuration = isSm ? '15s' : '30s';
  const floatDuration = isSm ? '10s' : '4s';

  // Quadruple the items for seamless fast scrolling
  const scrollingItems = [...items, ...items, ...items, ...items];

  return (
    <Box sx={{ 
      overflow: 'hidden',
      width: '100%',
      py: 2,
      WebkitOverflowScrolling: 'touch'
    }}>
      <Box
        sx={{
          display: 'flex',
          width: `${(scrollingItems.length / items.length) * 100}%`,
          animation: `${scroll} ${scrollDuration} linear infinite`,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
      >
        {scrollingItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              width: `${boxWidth}px`,
              minWidth: `${boxWidth}px`,
              mx: 0.5,
              p: boxPadding,
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              bgcolor: 'rgba(255,255,255,0.03)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              willChange: 'transform',
              '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: 'rgba(255,255,255,0.3)',
              }
            }}
          >
            <Box
              sx={{
                mb: 1,
                animation: !isXs ? `${float} ${floatDuration} ease-in-out infinite` : 'none',
                willChange: !isXs ? 'transform' : 'auto',
                height: isSm ? 40 : 60,
                '& svg': {
                  fontSize: iconSize
                }
              }}
            >
              {item.icon}
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                wordBreak: 'break-word',
                lineHeight: 1.2,
                color: '#fff'
              }}
            >
              {item.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}