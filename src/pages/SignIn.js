import React from 'react';
import { Box, TextField, Button, Typography, Link } from '@mui/material';

export default function SignIn() {
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
        Sign In
      </Typography>

      <TextField
        label="Email"
        type="email"
        required
        fullWidth
        InputLabelProps={{ style: { color: '#ccc' } }}
        InputProps={{ style: { color: '#fff' } }}
      />

      <TextField
        label="Password"
        type="password"
        required
        fullWidth
        InputLabelProps={{ style: { color: '#ccc' } }}
        InputProps={{ style: { color: '#fff' } }}
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
        Sign In
      </Button>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 1,
          fontSize: '0.875rem',
        }}
      >
        <Link href="#" underline="hover" color="#ccc">
          Forgot password?
        </Link>
        <Link href="/signup" underline="hover" color="#ccc">
          New user? Sign Up
        </Link>
      </Box>
    </Box>
  );
}
