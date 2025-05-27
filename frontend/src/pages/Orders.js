import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Chip,
  Paper,
  Snackbar,
  Alert,
  useMediaQuery
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      if (err.response?.status === 401) navigate('/signin');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <Box sx={{
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(45deg, rgba(0,0,0,0.95) 0%, rgba(18,18,18,0.98) 100%)'
      }}>
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        linear-gradient(45deg, 
          rgba(0,0,0,0.95) 0%, 
          rgba(18,18,18,0.98) 100%)`,
      p: { xs: 1.5, sm: 2.5 }
    }}>
      <Typography
        variant="h1"
        sx={{
          fontWeight: 900,
          fontSize: isMobile ? '2.5rem' : '3.5rem',
          px: 2,
          pt: 4,
          pb: 3,
          background: 'linear-gradient(45deg, #ffffff 35%, #aaaaaa 85%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          letterSpacing: '-0.03em'
        }}
      >
        Order History
      </Typography>

      {orders.length === 0 ? (
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            mt: 10,
            color: 'rgba(255,255,255,0.7)',
            fontStyle: 'italic',
            fontSize: '1.1rem'
          }}
        >
          No orders found.
        </Typography>
      ) : (
        <Stack spacing={2} sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
          {orders.map(order => (
            <Paper
              key={order._id}
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                }
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="start">
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <ReceiptIcon sx={{ fontSize: 22, color: 'rgba(255,255,255,0.8)' }} />
                    <Typography variant="body1" sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.9)',
                      letterSpacing: '-0.02em'
                    }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <CalendarTodayIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.7)' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {new Date(order.datetime).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Typography>
                  </Stack>
                </Stack>

                <Chip
                  label={order.paymentMethod === 'online' ? 'PAID' : 'NOT PAID'}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    borderStyle: order.paymentMethod === 'online' ? 'solid' : 'dashed',
                    borderWidth: '1.5px',
                    color: order.paymentMethod === 'online' ? '#fff' : 'rgba(255,255,255,0.8)',
                    bgcolor: 'transparent',
                    borderColor: order.paymentMethod === 'online' ? '#4caf50' : 'rgba(255,255,255,0.4)'
                  }}
                />
                <Chip
                label={order.status === 1 ? 'COMPLETED' : 'PENDING'}
                size="small"
                variant="outlined"
                sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    borderStyle: order.status === 1 ? 'solid' : 'dashed',
                    borderWidth: '1.5px',
                    color: order.status === 1 ? '#fff' : 'rgba(255,255,255,0.8)',
                    bgcolor: 'transparent',
                    borderColor: order.status === 1 ? '#2e7d32' : 'rgba(255,255,255,0.4)',
                    ml: 1
                }}
                />
              </Stack>

              <Stack direction="row" spacing={3} sx={{ 
                mt: 2.5, 
                pt: 2, 
                borderTop: '1px solid rgba(255,255,255,0.08)' 
              }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocalShippingIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.7)' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {order.cartItems?.length || 0} items
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <PaymentIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.7)' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    ₹{order.totalPrice.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="error"
          sx={{ 
            bgcolor: 'rgba(50,0,0,0.9)',
            border: '1px solid rgba(255,0,0,0.3)',
            color: '#ff6666',
            backdropFilter: 'blur(8px)',
            '& .MuiAlert-icon': { color: '#ff4444' }
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}