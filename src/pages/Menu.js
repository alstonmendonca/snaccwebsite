import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import SearchIcon from '@mui/icons-material/Search';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/fooditems')
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching food items:', err);
        setLoading(false);
      });
  }, []);

  // Filter items by name based on search term (case insensitive)
  const filteredItems = items.filter((item) =>
    item.fname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        position: 'relative',
        px: 4,
        py: 6,
        minHeight: '100vh',
        color: '#fff',
        overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1553025934-296397db4010?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>
          Explore our Menu
        </Typography>

        {/* Search Bar */}
        <Box sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
          <TextField
            fullWidth
            variant="filled"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',  // vertically center icon wrapper
                    marginRight: 0.5,         // small right margin for spacing
                  }}
                >
                  <SearchIcon sx={{ fontSize: 27, color: 'rgba(255,255,255,0.7)' }} />
                </InputAdornment>
              ),
              disableUnderline: true,
              sx: {
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                color: '#fff',
                '& .MuiInputBase-input': {
                  color: '#fff',
                  fontWeight: 500,
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  fontSize: '0.875rem',
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                },
                '&.Mui-focused': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                },
              },
            }}
          />

        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress sx={{ color: '#fff' }} />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(5, 1fr)',
              },
              gap: 3,
              overflowX: {
                xs: 'auto',
                md: 'visible',
              },
              pb: 2,
              '&::-webkit-scrollbar': {
                height: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#444',
                borderRadius: '3px',
              },
            }}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Card
                  key={item._id}
                  sx={{
                    backgroundColor: '#111',
                    color: '#fff',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 240,
                    width: '100%',
                    flexShrink: 0,
                    scrollSnapAlign: 'start',
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      flexGrow: 1,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {item.fname}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: '#ccc' }}>
                      ₹{item.cost}
                    </Typography>
                    <Chip
                      label={item.veg ? 'Veg' : 'Non-Veg'}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#fff',
                        color: '#fff',
                        mb: 1,
                      }}
                    />
                    <Divider sx={{ my: 1, borderColor: '#333', width: '80%' }} />
                    <Typography variant="caption" color="gray">
                      Category: {item.category}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        color: '#fff',
                        borderColor: '#fff',
                        '&:hover': {
                          backgroundColor: '#fff',
                          color: '#000',
                        },
                        borderRadius: 2,
                        textTransform: 'none',
                      }}
                      endIcon={<RestaurantMenuIcon />}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography
                variant="h6"
                color="rgba(255,255,255,0.7)"
                sx={{ gridColumn: '1 / -1', textAlign: 'center', mt: 4 }}
              >
                No items match your search.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
