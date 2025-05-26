import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import your auth hook

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // get login function from context

const handleSignIn = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("Email and password are required.");
    return;
  }

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/signin`, {
      email,
      password,
    });

    // Destructure token and user from backend response
    const { token, user } = res.data;

    // Save JWT and user info in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Call login with token and user data to update context
    login(token, user);

    navigate("/");
  } catch (err) {
    setError(err.response?.data?.error || "Sign in failed");
  }
};


  return (
    <Box
      component="form"
      onSubmit={handleSignIn}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        px: 4,
        py: 5,
        backgroundColor: "#111",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(255,255,255,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        color: "#fff",
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h5" align="center" sx={{ fontWeight: 600 }}>
        Sign In
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        InputLabelProps={{ style: { color: "#ccc" } }}
        InputProps={{ style: { color: "#fff" } }}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        InputLabelProps={{ style: { color: "#ccc" } }}
        InputProps={{ style: { color: "#fff" } }}
      />

      <Button
        variant="outlined"
        type="submit"
        sx={{
          mt: 2,
          color: "#fff",
          borderColor: "#fff",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#fff",
            color: "#000",
          },
        }}
      >
        Sign In
      </Button>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 1,
          fontSize: "0.875rem",
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
