import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Box, List, ListItem, ListItemText, CircularProgress, IconButton, Drawer } from '@mui/material';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';

import HackathonManager from './HackathonManager';
import UserManager from './UserManager';
import ReportsManager from './ReportsManager';
import { AuthContext } from '../../contexts/AuthContext';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';

const SidebarLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.common.white,
  marginBottom: '12px',
  padding: '12px 16px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(5px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
}));

const IconWrapper = styled(Box)({
  marginRight: '12px',
});

const AdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await axios.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUserData(userResponse.data);

        const hackathonsResponse = await axios.get('/api/hackathons', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setHackathons(hackathonsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Paper 
      sx={{ 
        height: '100%',
        p: 2, 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#333',
        color: 'white',
      }}
    >
      <Typography variant="h6" gutterBottom component="div" sx={{ mb: 2 }}>
        Quick Links
      </Typography>
      <SidebarLink to="/nexterchatadmin" onClick={() => setMobileOpen(false)}>
        <IconWrapper><HomeIcon /></IconWrapper>
        <Typography>Home</Typography>
      </SidebarLink>
      <SidebarLink to="/nexterchatadmin/hackathons" onClick={() => setMobileOpen(false)}>
        <IconWrapper><CodeIcon /></IconWrapper>
        <Typography>Hackathons</Typography>
      </SidebarLink>
      <SidebarLink to="/nexterchatadmin/users" onClick={() => setMobileOpen(false)}>
        <IconWrapper><PeopleIcon /></IconWrapper>
        <Typography>Users</Typography>
        </SidebarLink>
        <SidebarLink to="/nexterchatadmin/reports" onClick={() => setMobileOpen(false)}>
        <IconWrapper><AssessmentIcon /></IconWrapper>
        <Typography>Reports</Typography>
      </SidebarLink>
    </Paper>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <>
    <Header />
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, minHeight: 'calc(100vh - 64px - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
      </Box>
      {userData && (
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Welcome, {userData.name} ({userData.role})
        </Typography>
      )}
      <Grid container spacing={3} sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Grid item xs={12} md={3}>
          <Box
            component="nav"
            sx={{ width: { md: '100%' }, flexShrink: { md: 0 } }}
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,  
              }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
              }}
            >
              {drawer}
            </Drawer>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {drawer}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={9} sx={{ height: '100%', overflow: 'auto' }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={
                <>
                  {userData && (
                    <Box>
                      <Typography variant="h6" gutterBottom>User Details:</Typography>
                      <Typography variant="body1">
                        <strong>Name:</strong> {userData.name}<br />
                        <strong>Email:</strong> {userData.email}<br />
                        <strong>Role:</strong> {userData.role}<br />
                        <strong>User ID:</strong> {userData.userId}
                      </Typography>
                    </Box>
                  )}
                </>
              } />
              <Route path="/hackathons" element={<HackathonManager />} />
              <Route path="/users" element={<UserManager />} />
              <Route path="/reports" element={<ReportsManager />} />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    <Footer />
    </>
  );
};

export default AdminDashboard;