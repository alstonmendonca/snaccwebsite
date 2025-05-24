import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link } from '@mui/material';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function SignUp() {
  const [phone, setPhone] = useState('');

  return (
    <Box
      component="form"
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

      <TextField label="Name" required fullWidth InputLabelProps={{ style: { color: '#ccc' } }} InputProps={{ style: { color: '#fff' } }} />
      <TextField label="Email" type="email" required fullWidth InputLabelProps={{ style: { color: '#ccc' } }} InputProps={{ style: { color: '#fff' } }} />
      <TextField label="Password" type="password" required fullWidth InputLabelProps={{ style: { color: '#ccc' } }} InputProps={{ style: { color: '#fff' } }} />

      <Box sx={{ '& .PhoneInputInput': { backgroundColor: '#000', color: '#fff', border: '1px solid #555', borderRadius: 4, padding: '10px', width: '100%' } }}>
        <PhoneInput
          placeholder="Enter phone number"
          defaultCountry="IN"
          value={phone}
          onChange={setPhone}
          international
        />
      </Box>

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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, fontSize: '0.875rem' }}>
        <Link href="/signin" underline="hover" color="#ccc">
          Existing user? Login
        </Link>
      </Box>
    </Box>
  );
}
