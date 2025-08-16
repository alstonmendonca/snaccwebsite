import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  useTheme, 
  useMediaQuery, 
  Fade, 
  Zoom
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import FeatureScroll from '../components/FeatureScroll';
import BottomRatings from '../components/BottomRatings';

// Enhanced typewriter component with better styling
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
        }, 2000);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, currentLineIndex, isDeleting, lines, typingSpeed]);

  return (
    <Typography
      variant="h5"
      sx={{
        fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
        lineHeight: 1.6,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        minHeight: '1.6em',
        textAlign: 'center',
        width: '100%',
        letterSpacing: 0.5,
      }}
    >
      {displayedText}
      <span style={{ opacity: 0.7, animation: 'blink 1s infinite' }}>|</span>
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
    "Take a break, buy a sandwich.",
    "Delicious food, delivered fast."
  ];



  return (
    <Box
      sx={{
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
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                 {/* Hero Section */}
         <Box sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 10 } }}>
           <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
             <Fade in timeout={1000}>
               <Box>
                 <motion.div
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8, ease: 'easeOut' }}
                 >
                   <Typography
                     variant="h1"
                     sx={{
                       fontWeight: 900,
                       fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '4.5rem' },
                       lineHeight: 1.1,
                       mb: 2,
                       textTransform: 'uppercase',
                       color: '#fff',
                       textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                       letterSpacing: { xs: 1, md: 2 },
                     }}
                   >
                     Lassi Corner
                   </Typography>
                 </motion.div>

                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                 >
                   <Typography
                     variant="h4"
                     sx={{
                       fontWeight: 300,
                       color: 'rgba(255,255,255,0.8)',
                       mb: 3,
                       fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                       lineHeight: 1.4,
                     }}
                   >
                     Right in Your Campus
                   </Typography>
                 </motion.div>

                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                 >
                   <Box sx={{ mb: 4, minHeight: '2.5rem' }}>
                     <TypewriterText lines={typewriterLines} />
                   </Box>
                 </motion.div>

                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
                 >
                   <Button
                     variant="contained"
                     size="large"
                     endIcon={<ArrowForwardIcon />}
                     onClick={() => navigate('/menu')}
                     sx={{
                       px: { xs: 4, md: 6 },
                       py: { xs: 1.5, md: 2 },
                       borderRadius: 3,
                       fontWeight: 700,
                       fontSize: { xs: '1rem', md: '1.1rem' },
                       color: '#000',
                       bgcolor: '#fff',
                       boxShadow: '0 4px 12px rgba(255,255,255,0.2)',
                       '&:hover': {
                         bgcolor: '#f0f0f0',
                         transform: 'translateY(-2px)',
                         boxShadow: '0 6px 16px rgba(255,255,255,0.3)',
                       },
                       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                       textTransform: 'none',
                     }}
                   >
                     Explore Menu
                   </Button>
                 </motion.div>
               </Box>
             </Fade>
           </Box>

                       {/* Feature Icons - Now below the hero content */}
            <Box sx={{ mt: { xs: 3, md: 4 } }}>
              <Zoom in timeout={1200}>
                <Box>
                  <FeatureScroll />
                </Box>
              </Zoom>
            </Box>
          </Box>

         

         {/* Bottom Ratings Section */}
         <Box sx={{ py: { xs: 0.5, md: 0.5 } }}>
           <BottomRatings />
         </Box>
      </Container>

      {/* CSS for blinking cursor */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </Box>
  );
}