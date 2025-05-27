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

// Floating animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Horizontal scrolling animation
const scroll = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
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
  const boxWidth = isXs ? 160 : isSm ? 200 : 220;
  const boxPadding = isSm ? 2 : 4;
  const fontSize = isSm ? '0.75rem' : '0.9rem';

  const scrollingItems = [...items, ...items]; // Duplicate for loop

  return (
    <Box sx={{ overflow: 'hidden', width: '100%', py: 2 }}>
      <Box
        sx={{
          display: 'flex',
          width: '200%',
          animation: `${scroll} 20s linear infinite`,
        }}
      >
        {scrollingItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              width: `${boxWidth}px`,
              minWidth: `${boxWidth}px`,
              maxWidth: `${boxWidth}px`,
              mx: 1,
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
              '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: 'rgba(255,255,255,0.3)',
              }
            }}
          >
            <Box
              sx={{
                mb: 1,
                animation: `${float} 4s ease-in-out infinite`,
                color: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
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
                color: '#fff',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                textAlign: 'center',
                lineHeight: 1.2
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
