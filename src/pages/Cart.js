import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  IconButton,
  Divider,
  CircularProgress,
  Stack,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Please sign in to view your cart.');
      navigate('/signin');
      return;
    }

    const fetchCartDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/users/cart/details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data);
      } catch (err) {
        console.error('Failed to fetch cart details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartDetails();
  }, [token, navigate]);

  const updateQuantity = async (fid, newQuantity) => {
    if (newQuantity < 1) return; // prevent quantity less than 1
    try {
      await axios.post(
        'http://localhost:5000/users/cart/add',
        { fid, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Re-fetch cart after update
      const res = await axios.get('http://localhost:5000/users/cart/details', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeItem = async (fid) => {
    try {
      await axios.post(
        'http://localhost:5000/users/cart/remove',
        { fid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Re-fetch cart after removal
      const res = await axios.get('http://localhost:5000/users/cart/details', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.cost * item.quantity,
    0
  );

  if (loading) {
    return (
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#000',
          color: '#fff',
        }}
      >
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '80vh',
          bgcolor: '#000',
          color: '#fff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Your cart is empty
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/menu')}
          sx={{
            color: '#fff',
            borderColor: '#fff',
            '&:hover': { backgroundColor: '#fff', color: '#000' },
          }}
        >
          Browse Menu
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: '#000',
        minHeight: '100vh',
        py: 6,
        px: { xs: 2, sm: 6, md: 10 },
        color: '#fff',
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}
      >
        Your Cart
      </Typography>

      <Stack spacing={3}>
        {cartItems.map((item) => (
          <Card
            key={item.fid}
            sx={{
              bgcolor: '#111',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 3,
              py: 2,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {item.fname}
              </Typography>
              <Typography variant="body2" sx={{ color: '#bbb' }}>
                Category: {item.catname} | {item.veg ? 'Veg' : 'Non-Veg'}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                minWidth: 160,
              }}
            >
              <IconButton
                onClick={() => updateQuantity(item.fid, item.quantity - 1)}
                sx={{
                  color: '#fff',
                  border: '1px solid #fff',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                <RemoveIcon />
              </IconButton>

              <Typography sx={{ minWidth: 24, textAlign: 'center' }}>
                {item.quantity}
              </Typography>

              <IconButton
                onClick={() => updateQuantity(item.fid, item.quantity + 1)}
                sx={{
                  color: '#fff',
                  border: '1px solid #fff',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                <AddIcon />
              </IconButton>

              <IconButton
                onClick={() => removeItem(item.fid)}
                sx={{
                  color: '#f44336',
                  border: '1px solid #f44336',
                  '&:hover': { backgroundColor: 'rgba(244,67,54,0.1)' },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <Typography variant="h6" sx={{ minWidth: 70, textAlign: 'right' }}>
              ₹{item.cost * item.quantity}
            </Typography>
          </Card>
        ))}

        <Divider sx={{ borderColor: '#444' }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Total:
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            ₹{totalPrice}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#fff',
              color: '#000',
              px: 6,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1.1rem',
              borderRadius: 3,
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
            onClick={() => alert('Checkout feature coming soon!')}
          >
            Checkout
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
