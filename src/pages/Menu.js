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
  IconButton,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]); // [{ fid, quantity }]
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch food items
    axios
      .get('/fooditems')
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching food items:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch user's cart if logged in
    if (token) {
      axios
        .get('/users/cart', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCart(res.data.cart || []);
        })
        .catch((err) => {
          console.error('Failed to fetch cart:', err);
          setCart([]); // reset cart on error
        });
    } else {
      setCart([]);
    }
  }, [token]);

  const getQuantity = (fid) => {
    const item = cart.find((c) => c.fid === fid);
    return item ? item.quantity : 0;
  };

  // Add to cart or increase quantity
  const addToCart = async (fid) => {
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const currentItem = cart.find((item) => item.fid === fid);
      const newQuantity = (currentItem ? currentItem.quantity : 0) + 1;

      const response = await axios.post(
        '/users/cart/add',
        { fid, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setCart((prevCart) => {
          if (currentItem) {
            return prevCart.map((item) =>
              item.fid === fid ? { ...item, quantity: newQuantity } : item
            );
          } else {
            return [...prevCart, { fid, quantity: newQuantity }];
          }
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Decrease quantity or remove item
  const removeFromCart = async (fid) => {
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      // Decrease quantity by 1 or remove if quantity reaches 0
      const currentItem = cart.find((item) => item.fid === fid);
      if (!currentItem) return; // no item to remove

      const newQuantity = currentItem.quantity - 1;

      const response = await axios.post(
        '/users/cart/remove',
        { fid, quantity: newQuantity > 0 ? newQuantity : 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        // API returns updated cart
        setCart(response.data.cart || []);
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

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
        backgroundImage:
          "url('https://images.unsplash.com/photo-1553025934-296397db4010?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
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
                <InputAdornment position="start">
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
              filteredItems.map((item, index) => {
                const quantity = getQuantity(item.fid);

                return (
                  <motion.div
                    key={item.fid || item._id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                  >
                    <Card
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
                          Category: {item.catname}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                        {!token || quantity === 0 ? (
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
                            onClick={() => addToCart(item.fid)}
                          >
                            Add to Cart
                          </Button>
                        ) : (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <IconButton
                              size="small"
                              sx={{ color: '#fff', border: '1px solid #fff' }}
                              onClick={() => removeFromCart(item.fid)}
                            >
                              <RemoveIcon />
                            </IconButton>

                            <Typography sx={{ minWidth: 24, textAlign: 'center' }}>
                              {quantity}
                            </Typography>

                            <IconButton
                              size="small"
                              sx={{ color: '#fff', border: '1px solid #fff' }}
                              onClick={() => addToCart(item.fid)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        )}
                      </CardActions>
                    </Card>
                  </motion.div>
                );
              })
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
