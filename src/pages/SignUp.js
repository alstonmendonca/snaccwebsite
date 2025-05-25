import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link, InputAdornment } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { keyframes } from '@mui/system';

// Keyframe for the gray sweep animation
const sweep = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Simple email regex for basic validation
  const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Phone number validation: only digits, length exactly 10
  const phoneIsValid = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailIsValid(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!phoneIsValid(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/users/signup', {
        name,
        email,
        password,
        mobile: `+91${phone}`,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Sign up failed');
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 10,
          px: 4,
          py: 8,
          backgroundColor: '#111',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(255,255,255,0.1)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            display: 'inline-block',
            fontWeight: 700,
            fontSize: '2.5rem',
            marginBottom: '24px',
            background: 'linear-gradient(90deg, #fff 30%, #888 50%, #fff 70%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: `${sweep} 3s linear infinite`,
          }}
        >
          Account Created Successfully!
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            href="/signin"
            variant="contained"
            sx={{
              backgroundColor: '#000000',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.2rem',
              px: 5,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#5A5A5A',
              },
            }}
          >
            Login Now
          </Button>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 10,
        px: 4,
        py: 5,
        backgroundColor: '#111',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        color: '#fff',
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h5" align="center" sx={{ fontWeight: 600 }}>
        Sign Up
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        InputLabelProps={{ style: { color: '#ccc' } }}
        InputProps={{ style: { color: '#fff' } }}
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        InputLabelProps={{ style: { color: '#ccc' } }}
        InputProps={{ style: { color: '#fff' } }}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        InputLabelProps={{ style: { color: '#ccc' } }}
        InputProps={{ style: { color: '#fff' } }}
      />

      {/* Phone input with fixed +91 prefix */}
      <TextField
        label="Mobile Number"
        value={phone}
        onChange={(e) => {
          // Allow only digits, max length 10
          const val = e.target.value;
          if (/^\d{0,10}$/.test(val)) {
            setPhone(val);
          }
        }}
        required
        fullWidth
        placeholder="Enter mobile number"
        InputLabelProps={{ style: { color: '#ccc' } }}
        InputProps={{
          style: { color: '#fff' },
          startAdornment: (
            <InputAdornment position="start" sx={{ color: 'gray', userSelect: 'none' }}>
              +91
            </InputAdornment>
          ),
          inputProps: { maxLength: 10 },
        }}
      />

      <Button
        variant="outlined"
        type="submit"
        sx={{
          mt: 2,
          color: '#fff',
          borderColor: '#fff',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#fff',
            color: '#000',
          },
        }}
      >
        Sign Up
      </Button>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 1,
          fontSize: '0.875rem',
        }}
      >
        <Link href="/signin" underline="hover" color="#ccc">
          Existing user? Login
        </Link>
      </Box>
    </Box>
  );
}
