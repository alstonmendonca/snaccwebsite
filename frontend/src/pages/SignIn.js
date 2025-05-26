import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Fade,
} from "@mui/material";
import { Visibility, VisibilityOff, Login } from "@mui/icons-material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";

// Form validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Initialize formik for form handling and validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleSignIn(values);
    },
  });

  // Check for redirect state (e.g., after signup)
  useEffect(() => {
    if (location.state?.fromSignUp) {
      setSnackbar({
        open: true,
        message: "Sign up successful! Please sign in.",
        severity: "success",
      });
    }
  }, [location.state]);

  const handleSignIn = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/signin`,
        { email, password },
        { timeout: 10000 } // Add timeout to prevent hanging
      );

      const { token, user } = res.data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update auth context
      login(token, user);

      // Show success message
      setSnackbar({
        open: true,
        message: "Sign in successful! Redirecting...",
        severity: "success",
      });

      // Redirect after short delay for better UX
      setTimeout(() => {
        navigate(location.state?.from || "/");
      }, 1500);
    } catch (err) {
      let errorMessage = "Sign in failed. Please try again.";
      
      if (err.response) {
        errorMessage = err.response.data.error || errorMessage;
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.7), url('https://images.unsplash.com/photo-1553025934-296397db4010?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            maxWidth: 400,
            width: "100%",
            mx: "auto",
            px: { xs: 3, sm: 4 },
            py: 5,
            backgroundColor: "rgba(17, 17, 17, 0.9)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            color: "#fff",
            backdropFilter: "blur(8px)",
          }}
          noValidate
          autoComplete="off"
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 3, color: "rgba(255,255,255,0.7)" }}
          >
            Sign in to continue to your account
          </Typography>

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
            InputLabelProps={{
              style: { color: "#ccc" },
              shrink: true,
            }}
            InputProps={{
              style: { color: "#fff" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,255,255,0.4)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fff",
                },
              },
            }}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            InputLabelProps={{
              style: { color: "#ccc" },
              shrink: true,
            }}
            InputProps={{
              style: { color: "#fff" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,255,255,0.4)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fff",
                },
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Link
              href="/forgot-password"
              underline="hover"
              sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem" }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            variant="contained"
            type="submit"
            disabled={loading || !formik.isValid}
            startIcon={loading ? <CircularProgress size={20} /> : <Login />}
            sx={{
              mt: 2,
              py: 1.5,
              color: "#000",
              backgroundColor: "#fff",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(255,255,255,0.5)",
                color: "rgba(0,0,0,0.5)",
              },
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, color: "rgba(255,255,255,0.7)" }}
          >
            Don't have an account?{" "}
            <Link
              href="/signup"
              underline="hover"
              sx={{ color: "#fff", fontWeight: 500 }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}