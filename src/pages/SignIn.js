import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function SignIn() {
  return (
    <Box
      component="form"
      sx={{ maxWidth: 400, mx: 'auto', mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h5" component="h2" align="center">
        Sign In
      </Typography>
      <TextField label="Email" type="email" required />
      <TextField label="Password" type="password" required />
      <Button variant="contained" type="submit">
        Sign In
      </Button>
    </Box>
  );
}
