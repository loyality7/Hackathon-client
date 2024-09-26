import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, Box, List, ListItem, ListItemText, ListItemIcon, IconButton, useMediaQuery, Drawer, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../../contexts/AuthContext';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

// Define the gradient animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
    position: 'static',
    background: 'black',
    animation: `${gradientAnimation} 15s ease infinite`,
    backgroundSize: '400% 400%',
    color: 'white',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(10px)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
  },
  '& .MuiListItemIcon-root': {
    color: 'white', 
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const SmallSidebar = styled(Box)(({ theme }) => ({
  width: 60,
  backgroundColor: 'black',
  height: 'calc(100vh - 54px - 86px)', 
  position: 'fixed',
  left: 0,
  top: 54, 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  zIndex: 1200,
}));

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        fetchUserSubmissions();
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchUserSubmissions = async () => {
    try {
      const response = await axios.get('/api/users/submissions/by/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUserSubmissions(response.data);
      
      // Extract unique hackathons using a Map to ensure uniqueness by _id
      const hackathonMap = new Map();
      [...response.data.projectSubmissions,
       ...response.data.mcqSubmissions,
       ...response.data.codingSubmissions].forEach(submission => {
        if (!hackathonMap.has(submission.hackathon._id)) {
          hackathonMap.set(submission.hackathon._id, submission.hackathon);
        }
      });
      
      setHackathons(Array.from(hackathonMap.values()));
    } catch (error) {
      console.error('Error fetching user submissions:', error);
    }
  };

  const handleHackathonClick = (hackathon) => {
    setSelectedHackathon(hackathon);
  };

  const renderSubmissionDetails = () => {
    if (!selectedHackathon) return null;

    const projectSub = userSubmissions.projectSubmissions.find(s => s.hackathon._id === selectedHackathon._id);
    const mcqSub = userSubmissions.mcqSubmissions.find(s => s.hackathon._id === selectedHackathon._id);
    const codingSubs = userSubmissions.codingSubmissions.filter(s => s.hackathon._id === selectedHackathon._id);

    return (
      <Box>
        <Typography variant="h6" gutterBottom>{selectedHackathon.title} Submissions</Typography>
        {projectSub && (
          <Box mb={2}>
            <Typography variant="subtitle1">Project Submission</Typography>
            <Typography>Link: {projectSub.projectLink}</Typography>
            <Typography>Description: {projectSub.description}</Typography>
          </Box>
        )}
        {mcqSub && (
          <Box mb={2}>
            <Typography variant="subtitle1">MCQ Submission</Typography>
            <Typography>Score: {mcqSub.score}/{mcqSub.totalQuestions}</Typography>
          </Box>
        )}
        {codingSubs.length > 0 && (
          <Box mb={2}>
            <Typography variant="subtitle1">Coding Submissions</Typography>
            <Typography>Test Cases Passed: {codingSubs.filter(s => s.passed).length}/{codingSubs.length}</Typography>
          </Box>
        )}
      </Box>
    );
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarItems = [
    { text: 'Dashboard', icon: <HomeIcon />, onClick: () => setActiveSection('dashboard') },
    { text: 'User Details', icon: <PersonIcon />, onClick: () => setActiveSection('userDetails') },
    { text: 'Completed Hackathons', icon: <EmojiEventsIcon />, onClick: () => setActiveSection('completedHackathons') },
    { text: 'Upcoming Hackathons', icon: <EventIcon />, onClick: () => setActiveSection('upcomingHackathons') },
    { text: 'On Going Hackathons', icon: <EventIcon />, onClick: () => setActiveSection('presentHackathons') },
    { text: 'Submissions', icon: <AssignmentIcon />, onClick: () => setActiveSection('submissions') },
    { text: 'Logout', icon: <LogoutIcon />, onClick: () => { logout(); navigate('/login'); } },
  ];

  const renderSmallSidebar = () => (
    <SmallSidebar>
      {sidebarItems.map((item) => (
        <Tooltip key={item.text} title={item.text} placement="right">
          <IconButton
            onClick={() => {
              item.onClick();
              handleDrawerToggle();
            }}
            sx={{ 
              color: 'white', 
              my: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {item.icon}
          </IconButton>
        </Tooltip>
      ))}
    </SmallSidebar>
  );

  const drawer = (
    <div>
      <List>
        {sidebarItems.map((item) => (
          <StyledListItem button key={item.text} onClick={item.onClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </StyledListItem>
        ))}
      </List>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <StyledPaper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Dashboard</Typography>
            <Typography>Welcome to your dashboard, {user?.name}!</Typography>
          </StyledPaper>
        );
      case 'userDetails':
        return (
          <StyledPaper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>User Details</Typography>
            <Typography>Name: {user?.name}</Typography>
            <Typography>Email: {user?.email}</Typography>
          </StyledPaper>
        );
      case 'completedHackathons':
        return (
          <StyledPaper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Completed Hackathons</Typography>
            <List>
              {hackathons.map((hackathon) => (
                <ListItem key={hackathon._id}>
                  <ListItemText primary={hackathon.title} />
                </ListItem>
              ))}
            </List>
          </StyledPaper>
        );
      case 'submissions':
        return (
          <StyledPaper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Submissions</Typography>
            <Typography>Total Hackathons Submitted: {hackathons.length}</Typography>
            <List>
              {hackathons.map((hackathon) => (
                <ListItem 
                  button 
                  key={hackathon._id} 
                  onClick={() => handleHackathonClick(hackathon)}
                  selected={selectedHackathon && selectedHackathon._id === hackathon._id}
                >
                  <ListItemText primary={hackathon.title} />
                </ListItem>
              ))}
            </List>
            {renderSubmissionDetails()}
          </StyledPaper>
        );
      // Add cases for 'upcomingHackathons' and 'presentHackathons'
      default:
        return <Typography>Select an option from the sidebar NO data is there in seletcted Option</Typography>;
    }
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {isMobile ? (
          <>
            {renderSmallSidebar()}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
              style={{ position: 'absolute', top: 70, left: 10 }}
            >
              <MenuIcon />
            </IconButton>
          </>
        ) : (
          <StyledDrawer variant="permanent" open>
            {drawer}
          </StyledDrawer>
        )}
        <Box component="main" sx={{ flexGrow: 1, p: 3, ml: isMobile ? '60px' : '240px' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome, {user.name}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {renderContent()}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default UserDashboard;
 