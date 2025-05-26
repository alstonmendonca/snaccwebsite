import React from "react";
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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Must be a valid 10-digit number")
    .required("Phone number is required"),
});

export default function SignUp() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "error",
  });
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/users/signup`,
          {
            name: values.name,
            email: values.email,
            password: values.password,
            mobile: `+91${values.phone}`
          },
          { timeout: 10000 }
        );

        setSnackbar({
          open: true,
          message: "Account created successfully! Redirecting to login...",
          severity: "success",
        });

        setTimeout(() => {
          navigate("/signin");
        }, 2000);

      } catch (err) {
        const errorMessage = err.response?.data?.error || "Sign up failed. Please try again.";
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      }
    },
  });

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
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), url('https://images.unsplash.com/photo-1553025934-296397db4010?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
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
            Create Account
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 3, color: "rgba(255,255,255,0.7)" }}
          >
            Join our community to get started
          </Typography>

          <TextField
            label="Full Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
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

          <TextField
            label="Phone Number"
            name="phone"
            value={formik.values.phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              formik.setFieldValue('phone', val);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            fullWidth
            InputLabelProps={{
              style: { color: "#ccc" },
              shrink: true,
            }}
            InputProps={{
              style: { color: "#fff" },
              startAdornment: (
                <InputAdornment position="start" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  +91
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

          <Button
            variant="contained"
            type="submit"
            disabled={formik.isSubmitting}
            startIcon={formik.isSubmitting ? <CircularProgress size={20} /> : null}
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
            {formik.isSubmitting ? "Creating Account..." : "Sign Up"}
          </Button>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, color: "rgba(255,255,255,0.7)" }}
          >
            Already have an account?{" "}
            <Link
              href="/signin"
              underline="hover"
              sx={{ color: "#fff", fontWeight: 500 }}
            >
              Sign In
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