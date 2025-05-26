import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
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
  styled,
  alpha,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useAuth } from "../context/AuthContext";

// Throttle scroll handler
function throttle(fn, wait) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall < wait) return;
    lastCall = now;
    return fn(...args);
  };
}

const focusVisible = {
  outline: "2px solid #fff",
  outlineOffset: 2,
};

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
  "&:focus-visible": focusVisible,
}));

const DrawerNavItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: "capitalize",
  fontFamily: "'Inter', sans-serif",
  minHeight: 48,
  alignItems: "center",
  "&.active, &:hover": {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  "&:focus-visible": focusVisible,
}));

function Navbar() {
  const { isLoggedIn, logout, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  // eslint-disable-next-line
  const open = Boolean(anchorEl);

  const navLinks = useMemo(() => [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    ...(isLoggedIn ? [{ to: "/cart", label: "View Cart" }] : []),
    { to: "/about", label: "About" },
  ], [isLoggedIn]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrolled(window.scrollY > 50);
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const MobileAuthMenu = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 3 }}>
      {isLoggedIn ? (
        <>
          <DrawerNavItem
            component={Link}
            to="/profile"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="View Profile" />
          </DrawerNavItem>
          <DrawerNavItem
            component={Link}
            to="/orders"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="View Orders" />
          </DrawerNavItem>
          <Button variant="outlined" fullWidth onClick={handleLogout}>
            Log Out
          </Button>
        </>
      ) : (
        <>
          <Button
            component={Link}
            to="/signin"
            variant="outlined"
            fullWidth
            onClick={toggleDrawer(false)}
          >
            Sign In
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            fullWidth
            onClick={toggleDrawer(false)}
          >
            Sign Up
          </Button>
        </>
      )}
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={scrolled ? 4 : 0}
      sx={{
        backgroundColor: scrolled ? alpha("#000", 0.95) : "transparent",
        backdropFilter: scrolled ? `blur(${isMobile ? 4 : 8}px)` : "none",
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
      component="nav"
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
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            color: "primary.main",
            textDecoration: "none",
            fontWeight: 700,
            letterSpacing: "0.15em",
            "&:hover, &:focus-visible": { opacity: 0.85 },
            flexShrink: 0,
          }}
          tabIndex={0}
        >
          LASSI CORNER
        </Typography>

        {!isMobile ? (
          <>
            <Box sx={{ display: "flex", gap: 5, flexGrow: 1, justifyContent: "center" }}>
              {navLinks.map(({ to, label }) => (
                <StyledNavLink key={to} to={to} end>
                  {label}
                </StyledNavLink>
              ))}
            </Box>
            <DesktopAuthMenu 
              isLoggedIn={isLoggedIn}
              user={user}
              handleLogout={handleLogout}
              handleMenuOpen={() => setAnchorEl}
              handleMenuClose={() => setAnchorEl(null)}
              handleNavigate={navigate}
            />
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={toggleDrawer(true)}
              sx={{ ml: 1, "&:focus-visible": focusVisible }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              ModalProps={{ keepMounted: false }}
              PaperProps={{
                sx: {
                  backgroundColor: "background.paper",
                  width: 260,
                  p: 2,
                },
              }}
            >
              <List sx={{ flexGrow: 1 }}>
                {navLinks.map(({ to, label }) => (
                  <DrawerNavItem
                    key={to}
                    component={Link}
                    to={to}
                    onClick={toggleDrawer(false)}
                    end
                  >
                    <ListItemText primary={label} />
                  </DrawerNavItem>
                ))}
              </List>
              <MobileAuthMenu />
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

const DesktopAuthMenu = React.memo(({ 
  isLoggedIn, 
  user, 
  handleLogout, 
  handleMenuOpen, 
  handleMenuClose, 
  handleNavigate 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return isLoggedIn ? (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Button
        id="user-button"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        variant="text"
        sx={{
          color: "text.primary",
          textTransform: "none",
          fontWeight: 600,
          px: 1,
          gap: 0.5,
          "&:hover": { backgroundColor: alpha("#fff", 0.1) },
          "&:focus-visible": focusVisible,
        }}
        endIcon={<ArrowDropDownIcon />}
      >
        {user?.email || "User"}
      </Button>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "user-button",
          sx: {
            bgcolor: "#000",
            color: "#fff",
            borderRadius: 1,
            minWidth: 160,
            boxShadow: "0 4px 8px rgba(255, 255, 255, 0.15)",
          },
        }}
        PaperProps={{
          sx: {
            bgcolor: "#000",
            border: "1px solid #fff",
          },
        }}
      >
        <MenuItem
          onClick={() => handleNavigate("/profile")}
          sx={{ "&:hover": { backgroundColor: alpha("#fff", 0.15) } }}
        >
          View Profile
        </MenuItem>
        <MenuItem
          onClick={() => handleNavigate("/orders")}
          sx={{ "&:hover": { backgroundColor: alpha("#fff", 0.15) } }}
        >
          View Orders
        </MenuItem>
      </Menu>

      <Button
        onClick={handleLogout}
        variant="outlined"
        sx={{
          borderColor: "rgba(255,255,255,0.3)",
          color: "text.primary",
          px: 4,
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: alpha("#fff", 0.1),
          },
          "&:focus-visible": focusVisible,
        }}
      >
        Log Out
      </Button>
    </Box>
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
            boxShadow: "0 4px 12px rgba(255, 255, 255, 0.4)",
          },
          "&:focus-visible": focusVisible,
        }}
      >
        Sign Up
      </Button>
    </Box>
  );
});

export default Navbar;