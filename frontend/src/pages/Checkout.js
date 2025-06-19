import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Stack,
  Divider,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
export default function Checkout() {
  const { user } = useAuth();
  const { state } = useLocation();
  const cartItems = state?.cartItems || [];
  const totalPrice = state?.totalPrice || 0;
  const [paymentMethod, setPaymentMethod] = useState("cafe");
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('/assets/PaymentQR.jpg'); // Replace with your image path
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // ← Add this
  const navigate = useNavigate();
  const location = useLocation();
  const websocketConnected = location.state?.websocketConnected ?? false;

    useEffect(() => {
        if (user) {
        setName(user.name || "");    // Adjust field names based on your user object shape
        setPhone(user.mobile || "");
        }
    }, [user]);
    const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
    };
    const handleSubmit = async () => {
      setLoading(true);
      const payload = {
        name,
        phone,
        cartItems,
        datetime: dayjs().format(),
        paymentId: paymentMethod === 'online' ? paymentId : null,
        paymentMethod,
        totalPrice,
      };

      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/users/orders/place`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        setSubmitted(true); // Prevent further clicks
        setSnackbarMsg('Order placed successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        setTimeout(() => {
          navigate('/orders');
        }, 1500);
      } catch (err) {
        setSnackbarMsg('Failed to place order. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.error(err);
      } finally {
        setLoading(false); // But don't reset `submitted` so button stays disabled on success
      }
    };




  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>

      <Stack spacing={2}>
        <TextField
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
        />
        <TextField
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
        />

        <Divider />

        <Typography variant="h6">Payment Method</Typography>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="online"
            control={<Radio />}
            label="Pay Online via UPI"
            disabled={!websocketConnected}
          />
          <FormControlLabel
            value="cafe"
            control={<Radio />}
            label="Pay at Cafe"
          />
        </RadioGroup>

        {!websocketConnected && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 1, ml: 2 }}
          >
            Cafe cannot accept online payments at this time. Please pay at the cafe.
          </Typography>
        )}


        {paymentMethod === 'online' && (
          <Paper elevation={3} sx={{ p: 2, mt: 1 }}>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>Scan the QR Code to pay ₹{totalPrice}</Typography>
            <Box
                component="img"
                src={qrCodeUrl}
                alt="Payment QR Code"
                sx={{
                    width: { xs: 150, sm: 180, md: 200 },  // xs = mobile, sm = tablet/small laptop, md = laptop/desktop
                    height: 'auto',                        // keeps aspect ratio
                    objectFit: 'contain',
                    mt: 2,
                    display: 'block',                      // removes any inline gaps below image
                    mx: 'auto',                           // centers image horizontally
                }}
            />

            <TextField
            label="Enter 12 Digit UPI Transaction ID"
            fullWidth
            value={paymentId}
            onChange={(e) => {
                const val = e.target.value;
                // Allow only alphanumeric characters, max length 10
                if (/^[a-zA-Z0-9]{0,10}$/.test(val)) {
                setPaymentId(val);
                }
            }}
            sx={{ mt: 2 }}
            required
            inputProps={{ maxLength: 12 }}
            helperText="Exactly 12 alphanumeric characters"
            />

          </Paper>
        )}

        {paymentMethod === 'cafe' && (
<Paper
  elevation={1}
  sx={{
    p: 3,
    mt: 2,
    borderRadius: 2,
    bgcolor: '#1e1e1e', // dark gray background
    color: '#e0e0e0', // light gray text for contrast
    width: '100%',
    mx: 'auto',
    boxShadow: '0 1px 4px rgba(0,0,0,0.7)',
    textAlign: 'center',

  }}
>
  <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', color: '#fff' }}>
    Please confirm your order
  </Typography>
  <Typography variant="body2" sx={{ mb: 2, color: '#a0a0a0' }}>
    Pay when you arrive at the cafe.
  </Typography>
  <Box sx={{ lineHeight: 1.6 }}>
    <Typography variant="body1" sx={{ mb: 0.5 }}>
      <strong>Name:</strong> {name}
    </Typography>
    <Typography variant="body1" sx={{ mb: 0.5 }}>
      <strong>Phone:</strong> {phone}
    </Typography>
    <Typography variant="body1" sx={{ mt: 1, fontWeight: '600', color: '#fff' }}>
      Total: ₹{totalPrice.toFixed(2)}
    </Typography>
  </Box>
</Paper>

        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={submitted || loading || !name || !phone || (paymentMethod === 'online' && !paymentId)}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Placing Order...' : 'Confirm Order'}
        </Button>

      </Stack>
    <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMsg}
        </Alert>
    </Snackbar>

    </Box>
  );
}
