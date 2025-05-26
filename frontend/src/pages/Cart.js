import React, { useEffect, useState, useCallback } from 'react';
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
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  // eslint-disable-next-line
  const theme = useTheme();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchCartDetails = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/cart/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err) {
      setError('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      alert('Please sign in to view your cart.');
      navigate('/signin');
      return;
    }
    fetchCartDetails();
  }, [token, navigate, fetchCartDetails]);

  const handleApiError = useCallback((err) => {
    console.error(err);
    setError('Operation failed. Please try again.');
    fetchCartDetails(); // Revert to server state
  }, [fetchCartDetails]);


  const updateQuantity = useCallback(async (fid, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setCartItems(prev => prev.map(item => 
        item.fid === fid ? { ...item, quantity: newQuantity } : item
      ));

      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/cart/add`,
        { fid, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      handleApiError(err);
    }
  }, [token, handleApiError]); // ✅ added handleApiError


  const removeItem = useCallback(async (fid) => {
    try {
      setCartItems(prev => prev.filter(item => item.fid !== fid));

      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/cart/remove`,
        { fid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      handleApiError(err);
    }
  }, [token, handleApiError]); // ✅ added handleApiError


  const totalPrice = cartItems.reduce((sum, item) => sum + item.cost * item.quantity, 0);

  if (loading) {
    return (
      <Box sx={{
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (cartItems.length === 0) {
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
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Your cart is empty
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/menu')}
          fullWidth
          sx={{ maxWidth: 300 }}
        >
          Browse Menu
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      py: { xs: 3, md: 6 },
      px: { xs: 1.5, sm: 4 },
    }}>
      <Typography variant="h4" sx={{ 
        mb: 4, 
        fontWeight: 700, 
        textAlign: 'center',
        fontSize: { xs: '1.75rem', sm: '2rem' }
      }}>
        Your Cart
      </Typography>

      <Stack spacing={2} sx={{ maxWidth: 800, mx: 'auto' }}>
        {cartItems.map((item) => (
          <Stack
            key={item.fid}
            spacing={2}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 3,
              p: 2,
              position: 'relative',
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {item.fname}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.catname} • {item.veg ? 'Veg' : 'Non-Veg'}
              </Typography>
            </Box>

            <Stack 
              direction="row" 
              justifyContent="space-between" 
              alignItems="center"
            >
              <Typography variant="h6">
                ₹{item.cost * item.quantity}
              </Typography>
              
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  bgcolor: 'action.selected',
                  borderRadius: 2,
                  px: 1,
                }}>
                  <IconButton
                    onClick={() => updateQuantity(item.fid, item.quantity - 1)}
                    size="small"
                    sx={{ p: 0.5 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  
                  <Typography sx={{ 
                    minWidth: 32, 
                    textAlign: 'center',
                    fontSize: '0.875rem'
                  }}>
                    {item.quantity}
                  </Typography>
                  
                  <IconButton
                    onClick={() => updateQuantity(item.fid, item.quantity + 1)}
                    size="small"
                    sx={{ p: 0.5 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <IconButton
                  onClick={() => removeItem(item.fid)}
                  size="small"
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
        ))}

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="space-between" sx={{ px: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Total:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ₹{totalPrice}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 700,
          }}
          onClick={() => alert('Checkout feature coming soon!')}
        >
          Checkout
        </Button>
      </Stack>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}