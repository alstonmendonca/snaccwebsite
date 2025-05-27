import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
  Stack,
  Button,
  useTheme,
  Snackbar,
  Alert,
  Skeleton,
  Tooltip,
  Badge
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const theme = useTheme();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [localChanges, setLocalChanges] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Memoized total price calculation
  const totalPrice = useMemo(() => (
    cartItems.reduce((sum, item) => sum + item.cost * (localChanges[item.fid]?.quantity || item.quantity), 0)
  ), [cartItems, localChanges]);

  // Fetch cart details with error handling and retry logic
  const fetchCartDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/cart/details`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      setCartItems(res.data);
      setLocalChanges({});
    } catch (err) {
      console.error('Cart fetch error:', err);
      if (err.response?.status === 401) {
        navigate('/signin');
        return;
      }
      setError(err.response?.data?.message || 'Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate('/signin', { state: { from: 'cart' } });
      return;
    }
    fetchCartDetails();
  }, [token, navigate, fetchCartDetails]);

  // Optimistic UI updates with local state
  const updateLocalQuantity = useCallback((fid, newQuantity) => {
    if (newQuantity < 1) return;

    setLocalChanges(prev => ({
      ...prev,
      [fid]: { ...prev[fid], quantity: newQuantity }
    }));

    setCartItems(prev => prev.map(item => 
      item.fid === fid ? { ...item, quantity: newQuantity } : item
    ));
  }, []);

  // Debounced quantity updates
  const updateQuantity = useCallback(async (fid, newQuantity) => {
    if (newQuantity < 1) return;
    
    updateLocalQuantity(fid, newQuantity);
    setIsProcessing(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/cart/add`,
        { fid, quantity: newQuantity },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );
    } catch (err) {
      console.error('Quantity update error:', err);
      setError(err.response?.data?.message || 'Failed to update quantity');
      fetchCartDetails();
    } finally {
      setIsProcessing(false);
    }
  }, [token, fetchCartDetails, updateLocalQuantity]);
// eslint-disable-next-line
  const removeItem = useCallback(async (fid) => {
    const originalItems = [...cartItems];
    setCartItems(prev => prev.filter(item => item.fid !== fid));
    setIsProcessing(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/cart/remove`,
        { fid },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );
    } catch (err) {
      console.error('Remove item error:', err);
      setError(err.response?.data?.message || 'Failed to remove item');
      setCartItems(originalItems);
    } finally {
      setIsProcessing(false);
    }
  }, [token, cartItems]);
  const deleteItem = useCallback(async (fid) => {
    const originalItems = [...cartItems];
    setCartItems(prev => prev.filter(item => item.fid !== fid));
    setIsProcessing(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/cart/deleteitem`,
        { fid },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );
    } catch (err) {
      console.error('Delete item error:', err);
      setError(err.response?.data?.error || 'Failed to delete item');
      setCartItems(originalItems);  // Restore original items on error
    } finally {
      setIsProcessing(false);
    }
  }, [token, cartItems]);
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 }
  };

  if (loading && cartItems.length === 0) {
    return (
      <Box sx={{
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        px: 2,
        textAlign: 'center',
      }}>
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton 
              key={i} 
              variant="rounded" 
              height={100} 
              sx={{ mb: 2, borderRadius: 3 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Box sx={{
          minHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          px: 2,
          textAlign: 'center',
        }}>
          <Badge
            overlap="circular"
            badgeContent="0"
            color="primary"
            sx={{ mb: 3 }}
          >
            <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
          </Badge>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
            Looks like you haven't added anything to your cart yet
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/menu')}
            sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700 }}
          >
            Browse Menu
          </Button>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box sx={{
        minHeight: '100vh',
        py: { xs: 2, md: 6 },
        px: { xs: 1, sm: 4 },
      }}>
        <Typography variant="h4" sx={{ 
          mb: { xs: 2, md: 4 }, 
          fontWeight: 700, 
          textAlign: 'center',
          fontSize: { xs: '1.5rem', sm: '2rem' }
        }}>
          Your Cart
        </Typography>

        <Stack spacing={2} sx={{ maxWidth: 800, mx: 'auto', px: { xs: 0.5, sm: 0 } }}>
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.fid}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                transition={{ duration: 0.2 }}
              >
                <Stack
                  spacing={1.5}
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    p: { xs: 1.5, sm: 2 },
                    boxShadow: theme.shadows[1],
                    '&:hover': { boxShadow: theme.shadows[3] },
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                      {item.fname}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}>
                      {item.catname} • {item.veg ? 'Vegetarian' : 'Non-Vegetarian'} • ₹{item.cost} each
                    </Typography>
                  </Box>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                      ₹{(item.cost * (localChanges[item.fid]?.quantity || item.quantity)).toFixed(2)}
                    </Typography>
                    
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        p: 0.5
                      }}>
                        <Tooltip title="Reduce quantity">
                          <IconButton 
                            size="small"
                            onClick={() => updateQuantity(item.fid, (localChanges[item.fid]?.quantity || item.quantity) - 1)}
                            disabled={isProcessing}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Typography sx={{ 
                          mx: 1, 
                          minWidth: 20, 
                          textAlign: 'center',
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                          {localChanges[item.fid]?.quantity || item.quantity}
                        </Typography>
                        
                        <Tooltip title="Increase quantity">
                          <IconButton 
                            size="small"
                            onClick={() => updateQuantity(item.fid, (localChanges[item.fid]?.quantity || item.quantity) + 1)}
                            disabled={isProcessing}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                      <Tooltip title="Remove item">
                        <IconButton 
                          size="small"
                          onClick={() => deleteItem(item.fid)}
                          disabled={isProcessing}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Stack>
              </motion.div>
            ))}
          </AnimatePresence>

          <Divider sx={{ my: { xs: 2, md: 3 } }} />

          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 3,
            boxShadow: theme.shadows[1]
          }}>
            <Stack spacing={1.5}>
              <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                Order Summary
              </Typography>
              
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Subtotal:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  ₹{totalPrice.toFixed(2)}
                </Typography>
              </Stack>
              
              <Divider />
              
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  ₹{(totalPrice).toFixed(2)}
                </Typography>
              </Stack>
              
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/checkout')}
                disabled={isProcessing || cartItems.length === 0}
                sx={{
                  mt: 2,
                  py: { xs: 1.5, sm: 2 },
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
              >
                {isProcessing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>
            </Stack>
          </Box>
        </Stack>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
}