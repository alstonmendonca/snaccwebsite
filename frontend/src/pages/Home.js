import React, { useState, useEffect } from 'react';
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

const TypewriterText = ({ lines }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    let timer;
    const currentLine = lines[currentLineIndex];

    if (isDeleting) {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentLine.substring(0, displayedText.length - 1));
          setTypingSpeed(40);
        }, typingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentLineIndex((prevIndex) => (prevIndex + 1) % lines.length);
        setTypingSpeed(80);
      }
    } else {
      if (displayedText.length < currentLine.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentLine.substring(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, currentLineIndex, isDeleting, lines, typingSpeed]);

  return (
    <Typography
      variant="subtitle1"
      sx={{
        fontSize: '1.25rem',
        lineHeight: 1.6,
        color: 'rgba(255,255,255,0.9)',
        textShadow: '0 0 5px rgba(0,0,0,0.4)',
        whiteSpace: 'nowrap',
        minHeight: '1.6em',
        textAlign: 'center', // Centered text
        width: '100%'
      }}
    >
      {displayedText}
      <span style={{ opacity: 0.7 }}>|</span>
    </Typography>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const typewriterLines = [
    "Order from your classroom.",
    "Order from your cabin.",
    "Take a break, buy a sandwich."
  ];

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
        <Grid container spacing={6} justifyContent="center" alignItems="center"> {/* Centered grid */}
          {/* Hero Section - Now fully centered */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center', // Force center alignment
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
                  alignItems: 'center', // Center all children
                  gap: 3,
                  mb: 2,
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
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textAlign: 'center', // Centered title
                    width: '100%'
                  }}
                >
                  Lassi Corner
                </Typography>

                <Box sx={{ maxWidth: 420, width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <TypewriterText lines={typewriterLines} />
                </Box>

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
                    alignSelf: 'center', // Centered button
                  }}
                >
                  Explore Menu
                </Button>
              </Box>
            </Fade>
          </Grid>

          {/* Feature Icons - remains on the side */}
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