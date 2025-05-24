import React, { useState, useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  keyframes,
  styled,
  alpha,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const focusVisible = {
  outline: "2px solid #fff",
  outlineOffset: 2,
};

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
      paper: "#111111",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    primary: {
      main: "#FFFFFF", // white as primary highlight
      contrastText: "#000000",
    },
    secondary: {
      main: "rgba(255, 255, 255, 0.12)",
    },
  },
    typography: {
      fontFamily: "'Inter', sans-serif", // 👈 updated here
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 500 },
      body1: { fontWeight: 400 },
      body2: { fontWeight: 400 },
      button: { fontWeight: 600, textTransform: "none" },
    },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          textTransform: "none",
          fontFamily: "'Inter', sans-serif",
        },
      },
    },
  },
});

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  position: "relative",
  textDecoration: "none",
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: "1rem",
  paddingBottom: 4,
  transition: "color 0.3s ease",
  fontFamily: "'Inter', sans-serif",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 0,
    height: 2,
    backgroundColor: theme.palette.primary.main,
    transition: "width 0.3s ease",
    borderRadius: 2,
  },
  "&:hover::after": {
    width: "100%",
  },
  "&.active": {
    color: theme.palette.primary.main,
    fontWeight: 700,
    "&::after": {
      width: "100%",
    },
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

const DrawerNavItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: "capitalize",
  fontFamily: "'Inter', sans-serif",
  "&.active, &:hover": {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/about", label: "About" },
  ];

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: scrolled ? alpha("#000", 0.85) : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          transition: "background-color 0.3s ease",
        }}
        component="nav"
        aria-label="Primary navigation"
      >
        <Toolbar
          sx={{
            maxWidth: 1400,
            mx: "auto",
            width: "100%",
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo left */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              userSelect: "none",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.15em",
              "&:hover, &:focus-visible": { opacity: 0.85 },
              flexShrink: 0,
            }}
            tabIndex={0}
          >
            LASSI CORNER
          </Typography>

          {/* Center nav links (desktop) */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                gap: 5,
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              {navLinks.map(({ to, label }) => (
                <StyledNavLink key={to} to={to} end>
                  {label}
                </StyledNavLink>
              ))}
            </Box>
          )}

          {/* Right buttons or hamburger menu */}
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                aria-label="Open menu"
                onClick={toggleDrawer(true)}
                size="large"
                sx={{ ml: 1, "&:focus-visible": focusVisible }}
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                ModalProps={{ keepMounted: true }}
                PaperProps={{
                  sx: { backgroundColor: "background.paper", width: 260, p: 2 },
                }}
                aria-label="Mobile menu"
              >
                <List
                  component="nav"
                  aria-label="Mobile primary navigation"
                  sx={{ flexGrow: 1 }}
                >
                  {navLinks.map(({ to, label }) => (
                    <DrawerNavItem
                      key={to}
                      component={Link}
                      to={to}
                      onClick={toggleDrawer(false)}
                      end
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <ListItemText primary={label} />
                    </DrawerNavItem>
                  ))}
                </List>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 3 }}>
                  <Button
                    component={Link}
                    to="/signin"
                    variant="outlined"
                    fullWidth
                    onClick={toggleDrawer(false)}
                    sx={{
                      borderColor: "rgba(255,255,255,0.3)",
                      color: "text.primary",
                      "&:hover": {
                        borderColor: "primary.main",
                        backgroundColor: alpha("#fff", 0.1),
                      },
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    fullWidth
                    onClick={toggleDrawer(false)}
                    sx={{
                      backgroundColor: "#fff",
                      color: "#000",
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                        boxShadow: "0 4px 12px rgba(255, 255, 255, 0.4)",
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                component={Link}
                to="/signin"
                variant="outlined"
                sx={{
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "text.primary",
                  px: 4,
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: alpha("#fff", 0.1),
                    transform: "translateY(-2px)",
                  },
                  "&:focus-visible": focusVisible,
                }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                sx={{
                  backgroundColor: "#fff",
                  color: "#000",
                  px: 4,
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(255, 255, 255, 0.4)",
                  },
                  "&:focus-visible": focusVisible,
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default function App() {
  const appTheme = useMemo(() => theme, []);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      {/* Import Inter font in your index.html or _document.js if Next.js */}
      <Router>
        <Navbar />
        <Box
          component="main"
          sx={{
            minHeight: "calc(100vh - 64px)", // account for AppBar height
            background: `linear-gradient(180deg, #111111 0%, #000000 100%)`,
            px: { xs: 2, sm: 4, md: 6 },
            py: 4,
            animation: `${fadeIn} 0.5s ease`,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
