import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  Snackbar,
  Alert,
  Skeleton,
  Badge,
  Tooltip,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

const API_BASE_URL = process.env.REACT_APP_API_URL;

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

// Skeleton loader component
const MenuItemSkeleton = () => (
  <Card sx={{ 
    backgroundColor: '#111', 
    borderRadius: 3,
    height: 320, // Fixed height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Skeleton variant="text" width="60%" height={30} sx={{ mx: 'auto' }} />
      <Skeleton variant="text" width="40%" height={20} sx={{ mx: 'auto', my: 1 }} />
      <Skeleton variant="rectangular" width="30%" height={24} sx={{ mx: 'auto', my: 1, borderRadius: 1 }} />
      <Divider sx={{ my: 2, borderColor: '#333', width: '80%', mx: 'auto' }} />
      <Skeleton variant="text" width="70%" height={16} sx={{ mx: 'auto' }} />
    </CardContent>
    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
      <Skeleton variant="rectangular" width="80%" height={36} sx={{ borderRadius: 2 }} />
    </CardActions>
  </Card>
);

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch menu items with error handling
  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/fooditems`);
      setItems(response.data);
      const categories = ['All', ...new Set(response.data.map(item => item.catname))];
      setCategories(categories);
    } catch (err) {
      console.error('Error fetching food items:', err);
      setError('Failed to load menu. Please try again later.');
      showSnackbar('Failed to load menu', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cart items with error handling
  const fetchCartItems = useCallback(async () => {
    if (!token) {
      setCart([]);
      return;
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/users/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.cart || []);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCart([]);
      showSnackbar('Failed to load cart', 'error');
    }
  }, [token]);

  // Initial data loading
  useEffect(() => {
    fetchMenuItems();
    fetchCartItems();
  }, [fetchMenuItems, fetchCartItems]);

  // Snackbar helper
  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Debounced search
  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  // Memoized filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.fname.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.catname === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);


  // Memoized cart quantity
  const getQuantity = useCallback((fid) => {
    return cart.find((c) => c.fid === fid)?.quantity || 0;
  }, [cart]);

  // Memoized total items in cart
  const totalItemsInCart = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Add to cart with optimistic UI update
  const addToCart = async (fid, itemName) => {
    if (!token) {
      navigate('/signin');
      return;
    }

    if (cartLoading) return;

    setCartLoading(true);
    const currentItem = cart.find((item) => item.fid === fid);
    const newQuantity = (currentItem?.quantity || 0) + 1;

    // Optimistic update
    setCart(prev => {
      if (currentItem) {
        return prev.map(item =>
          item.fid === fid ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return [...prev, { fid, quantity: newQuantity }];
      }
    });

    try {
      await axios.post(
        `${API_BASE_URL}/users/cart/add`,
        { fid, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar(`${itemName} added to cart`, 'success');
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Rollback on error
      setCart(prev => {
        if (currentItem) {
          return prev.map(item =>
            item.fid === fid ? { ...item, quantity: currentItem.quantity } : item
          );
        } else {
          return prev.filter(item => item.fid !== fid);
        }
      });
      showSnackbar('Failed to add item to cart', 'error');
    } finally {
      setCartLoading(false);
    }
  };

  // Remove from cart with optimistic UI update
  const removeFromCart = async (fid, itemName) => {
    if (!token) {
      navigate('/signin');
      return;
    }

    if (cartLoading) return;

    setCartLoading(true);
    const currentItem = cart.find((item) => item.fid === fid);
    if (!currentItem) return;

    const newQuantity = currentItem.quantity - 1;

    // Optimistic update
    setCart(prev => {
      if (newQuantity <= 0) {
        return prev.filter(item => item.fid !== fid);
      } else {
        return prev.map(item =>
          item.fid === fid ? { ...item, quantity: newQuantity } : item
        );
      }
    });

    try {
      await axios.post(
        `${API_BASE_URL}/users/cart/remove`,
        { fid, quantity: newQuantity > 0 ? newQuantity : 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (newQuantity <= 0) {
        showSnackbar(`${itemName} removed from cart`, 'info');
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
      // Rollback on error
      setCart(prev => {
        return prev.map(item =>
          item.fid === fid ? { ...item, quantity: currentItem.quantity } : item
        );
      });
      showSnackbar('Failed to update cart', 'error');
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        px: { xs: 1, sm: 2 },
        pt: 4,
        pb: 10,
        minHeight: '100vh',
        color: '#fff',
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), url('https://images.unsplash.com/photo-1553025934-296397db4010?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Error display */}
      {error && (
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <Typography color="error">{error}</Typography>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={fetchMenuItems}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </Box>
      )}

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>
          Explore our Menu
        </Typography>
        



    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        justifyContent: 'center',
        mb: 2,
      }}
    >
      {categories.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          onClick={() => setSelectedCategory(cat)}
          clickable
          color={selectedCategory === cat ? 'primary' : 'default'}
          variant={selectedCategory === cat ? 'filled' : 'outlined'}
          sx={{
            bgcolor: selectedCategory === cat ? 'primary.main' : 'transparent',
            color: selectedCategory === cat ? '#000' : '#ccc',
            borderColor: '#555',
          }}
        />
      ))}
    </Box>

        {/* Search with debouncing */}
        <Box sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
          <TextField
            fullWidth
            variant="filled"
            placeholder="Search menu items..."
            defaultValue={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
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

        {/* Loading state with skeleton loaders */}
        {loading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(auto-fill, minmax(90vw, 1fr))',
                sm: 'repeat(auto-fill, minmax(200px, 1fr))',
                md: 'repeat(auto-fill, minmax(240px, 1fr))',
              },
              gap: 2,
              pb: 2,
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <MenuItemSkeleton key={index} />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(auto-fill, minmax(90vw, 1fr))',
                sm: 'repeat(auto-fill, minmax(200px, 1fr))',
                md: 'repeat(auto-fill, minmax(240px, 1fr))',
              },
              gap: 2,
              pb: 2,
            }}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const quantity = getQuantity(item.fid);

                return (
                  <motion.div
                    key={item.fid}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
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
                        height: 270, // Fixed height for all cards
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          boxShadow: '0 6px 24px rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          flexGrow: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Tooltip title={item.fname} placement="top">
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              mb: 1,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '100%',
                              px: 1
                            }}
                          >
                            {item.fname}
                          </Typography>
                        </Tooltip>
                        <Typography variant="body2" sx={{ mb: 1, color: '#ccc' }}>
                          ₹{item.cost}
                        </Typography>
                        <Chip
                          label={item.veg ? 'Veg' : 'Non-Veg'}
                          variant="outlined"
                          size="small"
                          sx={{ 
                            borderColor: item.veg ? 'success.main' : 'error.main',
                            color: item.veg ? 'success.main' : 'error.main',
                            mb: 1 
                          }}
                        />
                        <Divider sx={{ my: 1, borderColor: '#333', width: '80%' }} />
                        <Tooltip title={item.catname} placement="bottom">
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '100%',
                              px: 1
                            }}
                          >
                            {item.catname}
                          </Typography>
                        </Tooltip>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                        {!token || quantity === 0 ? (
                          <Button
                            variant="outlined"
                            disabled={cartLoading}
                            sx={{
                              color: '#fff',
                              borderColor: '#fff',
                              '&:hover': { 
                                backgroundColor: '#fff', 
                                color: '#000',
                              },
                              borderRadius: 2,
                              textTransform: 'none',
                              minWidth: 140,
                              '&.Mui-disabled': {
                                color: 'rgba(255,255,255,0.5)',
                                borderColor: 'rgba(255,255,255,0.2)'
                              }
                            }}
                            endIcon={cartLoading ? <CircularProgress size={20} color="inherit" /> : <RestaurantMenuIcon />}
                            onClick={() => addToCart(item.fid, item.fname)}
                          >
                            {cartLoading ? 'Adding...' : 'Add to Cart'}
                          </Button>
                        ) : (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 2,
                            px: 1,
                            py: 0.5
                          }}>
                            <IconButton
                              size="small"
                              disabled={cartLoading}
                              sx={{ 
                                color: '#fff',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                                '&.Mui-disabled': {
                                  color: 'rgba(255,255,255,0.3)'
                                }
                              }}
                              onClick={() => removeFromCart(item.fid, item.fname)}
                            >
                              {cartLoading ? <CircularProgress size={20} color="inherit" /> : <RemoveIcon fontSize="small" />}
                            </IconButton>
                            <Typography sx={{ minWidth: 24, textAlign: 'center' }}>
                              {quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              disabled={cartLoading}
                              sx={{ 
                                color: '#fff',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                                '&.Mui-disabled': {
                                  color: 'rgba(255,255,255,0.3)'
                                }
                              }}
                              onClick={() => addToCart(item.fid, item.fname)}
                            >
                              {cartLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon fontSize="small" />}
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
                sx={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  mt: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                No items found
                {searchTerm && (
                  <Button 
                    variant="outlined" 
                    onClick={() => setSearchTerm('')}
                    sx={{ color: '#fff', borderColor: '#fff' }}
                  >
                    Clear search
                  </Button>
                )}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Checkout Button */}
      {token && totalItemsInCart > 0 && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 999,
            px: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/cart')}
            disabled={cartLoading}
            startIcon={
              <Badge badgeContent={totalItemsInCart} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            }
            sx={{
              width: '100%',
              maxWidth: 480,
              borderRadius: 3,
              fontWeight: 'bold',
              py: 1.5,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              '&.Mui-disabled': {
                backgroundColor: 'rgba(255,255,255,0.12)'
              }
            }}
          >
            {cartLoading ? 'Processing...' : 'Proceed to Checkout'}
          </Button>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}