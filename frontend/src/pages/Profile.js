import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Box, Typography, Divider, CircularProgress,
  Button, TextField, Grid, useTheme,
  Snackbar, Alert, Chip, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function Profile() {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);


  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      try {
        const ordersRes = await axios.get(`${process.env.REACT_APP_API_URL}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(ordersRes.data);
      } catch (orderErr) {
        console.error('Failed to load orders:', orderErr);
      }
      setEditedUser(res.data);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
      if (err.response?.status === 401) navigate('/signin');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setEditedUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const { name, mobile, dob, address } = editedUser;
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/profile`,
        { name, mobile, dob, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setEditedUser(res.data);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  }, [editedUser]);

  const UserField = ({ label, value, name, type = 'text', editComponent }) => (
    <Grid container spacing={2} sx={{ py: 2 }}>
      <Grid item xs={12} md={3}>
        <Typography variant="subtitle1" fontWeight="500">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} md={9}>
        {editMode ? (
          editComponent || (
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              name={name}
              type={type}
              value={editedUser[name] || ''}
              onChange={handleChange}
              InputProps={{
                sx: { backgroundColor: theme.palette.background.paper }
              }}
            />
          )
        ) : (
          <Typography variant="body1">
            {value || 'Not provided'}
          </Typography>
        )}
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      maxWidth: 800,
      mx: 'auto',
      mt: { xs: 3, md: 5 },
      p: { xs: 2, md: 4 },
      backgroundColor: 'background.paper',
      borderRadius: 4,
      boxShadow: theme.shadows[2]
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="700">
          Profile
        </Typography>
        {!editMode && (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(true)}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            Edit Profile
          </Button>
        )}
      </Stack>

      <Stack spacing={2}>
        <UserField
          label="Name"
          value={user.name}
          name="name"
          editComponent={
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              name="name"
              value={editedUser.name || ''}
              onChange={handleChange}
            />
          }
        />
        <Divider />

        <UserField label="Email" value={user.email} />
        <Divider />

        <UserField
          label="Mobile"
          value={user.mobile}
          name="mobile"
          type="tel"
        />
        <Divider />

        <UserField
          label="Date of Birth"
          value={user.dob ? new Date(user.dob).toLocaleDateString() : ''}
          name="dob"
          type="date"
          editComponent={
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              type="date"
              name="dob"
              value={editedUser.dob?.slice(0, 10) || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          }
        />
        <Divider />

        <UserField
          label="Address"
          value={user.address}
          name="address"
        />
        <Divider />

        <Box sx={{ pt: 2 }}>
          <Typography variant="h6" gutterBottom>
            <EventNoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Order History
          </Typography>
          {orders.length > 0 ? (
            <Stack spacing={2}>
              {orders.map((order) => (
                <Box key={order._id} sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" fontWeight="500">
                      Order ID: {order._id.slice(-6).toUpperCase()}
                    </Typography>
                    <Chip
                      label={order.paymentMethod === 'online' ? 'Paid Online' : 'Pay at Cafe'}
                      color={order.paymentMethod === 'online' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <LocalShippingIcon sx={{ fontSize: 16, mr: 1 }} />
                    {order.cartItems?.length || 0} items — ₹{order.totalPrice}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.datetime).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No orders yet
            </Typography>
          )}
        </Box>


        {editMode ? (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              fullWidth
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => {
                setEditedUser(user);
                setEditMode(false);
              }}
              fullWidth
            >
              Cancel
            </Button>
          </Stack>
        ) : (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(true)}
            fullWidth
            sx={{ display: { md: 'none', mt: 2 } }}
          >
            Edit Profile
          </Button>
        )}
      </Stack>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}