import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Button, IconButton, Box, Avatar, Badge, InputBase, Tooltip, Menu, MenuItem, ListItemIcon, Grow, Drawer, List, ListItem, ListItemText
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Menu as MenuIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // New import for mobile menu
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

// Import additional icons
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    '&::placeholder': {
      color: '#3FBDCE',  
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null); // State for mobile menu
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Hackathon', path: '/hackathons', icon: <WorkIcon /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <LeaderboardIcon /> },
    // { name: 'Scoreboard', path: '/scoreboard', icon: <ScoreboardIcon /> },
    // { name: 'Resources', path: '/resources' }
  ];

  const handleLogin = () => {
    navigate('/login');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login', { state: { from: path } });
    }
    handleProfileMenuClose();
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    // Clear user context or perform any necessary cleanup
    // For example, if using a context:
    // setUser(null);

    // Redirect to login page
    navigate('/login');
    handleProfileMenuClose();
    handleMobileMenuClose();
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' && 
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navLinks.map((link) => (
          <ListItem button key={link.name} component={Link} to={link.path}>
            <ListItemIcon>
              {link.icon}
            </ListItemIcon>
            <ListItemText primary={link.name} />
          </ListItem>
        ))}
        {/* User-specific menu items for mobile */}
        {user && (
          <>
            {/* <ListItem button onClick={() => handleMenuClick('/dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem> */}
            <ListItem button onClick={() => handleMenuClick('/settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
        {!user && (
          <ListItem button onClick={handleLogin}>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  const mobileMenuId = 'primary-mobile-menu';

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleMobileMenuClose}
      TransitionComponent={Grow}
      PaperProps={{
        sx: {
          bgcolor: '#2e2e2e',
          color: 'white',
          '& .MuiMenuItem-root': {
            '&:hover': {
              bgcolor: '#3e3e3e',
            },
          },
        },
      }}
    >
      {user ? (
        <>
          <MenuItem onClick={() => handleMenuClick('/dashboard')}>
            <ListItemIcon>
              <DashboardIcon fontSize="small" sx={{ color: 'white' }} />
            </ListItemIcon>
            Dashboard
          </MenuItem>
          <MenuItem onClick={() => handleMenuClick('/settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" sx={{ color: 'white' }} />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: 'white' }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </>
      ) : (
        <MenuItem onClick={handleLogin}>
          <ListItemIcon>
            <LoginIcon fontSize="small" sx={{ color: 'white' }} />
          </ListItemIcon>
          Login
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: '#1e2124' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dfdtxogcl/images/c_scale,w_248,h_180,dpr_1.25/f_auto,q_auto/v1706606519/Picture1_215dc6b/Picture1_215dc6b.png?_i=AA"
              alt="Logo"
              style={{ height: '50px', marginRight: isMobile ? '0' : '16px', marginLeft: isMobile ? '0' : '76px' }}
            />
          </Link>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navLinks.map((link) => (
                <Button 
                  key={link.name} 
                  component={Link} 
                  to={link.path}
                  color="inherit" 
                  sx={{ textTransform: 'none', fontWeight: '400', display: 'flex', alignItems: 'center' }}
                >
                  {link.icon}
                  <span style={{ marginLeft: '8px' }}>{link.name}</span>
                </Button>
              ))}
            </Box>
          )}
        </Box>

        {/* Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile && (
            <Search sx={{ bgcolor: 'transparent', borderRadius: '18px', border: '1.56px solid #3FBDCE' }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search for Competitions"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          )}

          {!isMobile && (
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <Badge badgeContent={0} color="error">
                {/* <NotificationsIcon /> */}
              </Badge>
            </IconButton>
          )}

          {/* Mobile Menu Button - Moved to the right */}
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Desktop User Avatar or Login */}
          {!isMobile && user ? (
            <>
              <Tooltip title={user.name}>
                <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                TransitionComponent={Grow}
                PaperProps={{
                  sx: {
                    bgcolor: '#2e2e2e',
                    color: 'white',
                    '& .MuiMenuItem-root': {
                      '&:hover': {
                        bgcolor: '#3e3e3e',
                      },
                    },
                  },
                }}
              >
                <MenuItem onClick={() => handleMenuClick('/dashboard')}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" sx={{ color: 'white' }} />
                  </ListItemIcon>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick('/settings')}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" sx={{ color: 'white' }} />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: 'white' }} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : !isMobile && (
            <Tooltip title="Login">
              <IconButton color="inherit" onClick={handleLogin} sx={{ ml: 1 }}>
                <LoginIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Drawer for Mobile Navigation - Changed anchor to 'right' */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          {drawerList}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;