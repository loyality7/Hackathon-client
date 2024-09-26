import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Code, 
  Group, 
  EmojiEvents, 
  Home, 
  Event, 
  Person, 
  Add 
} from '@mui/icons-material';

const HackathonPlatform = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Homepage />;
      case 'events':
        return <EventsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'submit':
        return <SubmitProjectPage />;
      default:
        return <Homepage />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HackHub
          </Typography>
          <Button color="inherit" onClick={() => setCurrentPage('home')}>
            <Home />
          </Button>
          <Button color="inherit" onClick={() => setCurrentPage('events')}>
            <Event />
          </Button>
          <Button color="inherit" onClick={() => setCurrentPage('profile')}>
            <Person />
          </Button>
          <Button color="inherit" onClick={() => setCurrentPage('submit')}>
            <Add />
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {renderPage()}
      </Container>
    </Box>
  );
};

const Homepage = () => {
  const features = [
    { title: 'Collaborate', description: 'Work with talented developers', icon: <Group /> },
    { title: 'Code', description: 'Build innovative projects', icon: <Code /> },
    { title: 'Win', description: 'Compete for amazing prizes', icon: <EmojiEvents /> },
  ];

  return (
    <>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to HackHub
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          Join the next generation of innovators and problem solvers
        </Typography>
        <Button variant="contained" size="large" sx={{ mt: 2 }}>
          Join a Hackathon
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="div" gutterBottom align="center">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h3" gutterBottom>
          Upcoming Hackathons
        </Typography>
        <Button variant="outlined" size="large">
          View All Events
        </Button>
      </Box>
    </>
  );
};

const EventsPage = () => {
  const events = [
    { name: 'AI Innovation Hackathon', date: '2024-10-15', participants: 500 },
    { name: 'Green Tech Challenge', date: '2024-11-01', participants: 300 },
    { name: 'Blockchain Revolution', date: '2024-11-20', participants: 400 },
  ];

  return (
    <>
      <Typography variant="h3" component="h2" gutterBottom>
        Upcoming Events
      </Typography>
      <List>
        {events.map((event, index) => (
          <ListItem key={index}>
            <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">{event.name}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body1">Date: {event.date}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Chip label={`${event.participants} participants`} color="primary" />
                </Grid>
              </Grid>
            </Paper>
          </ListItem>
        ))}
      </List>
    </>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ width: 100, height: 100, mr: 2 }}>JD</Avatar>
        <Box>
          <Typography variant="h4">John Doe</Typography>
          <Typography variant="subtitle1" color="text.secondary">Full Stack Developer</Typography>
        </Box>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="About" />
          <Tab label="Skills" />
          <Tab label="Projects" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && (
          <Typography variant="body1">
            Passionate developer with 5 years of experience in web and mobile applications.
            Love participating in hackathons and building innovative solutions.
          </Typography>
        )}
        {activeTab === 1 && (
          <Box>
            <Chip label="JavaScript" sx={{ m: 0.5 }} />
            <Chip label="React" sx={{ m: 0.5 }} />
            <Chip label="Node.js" sx={{ m: 0.5 }} />
            <Chip label="Python" sx={{ m: 0.5 }} />
          </Box>
        )}
        {activeTab === 2 && (
          <List>
            <ListItem>
              <ListItemText 
                primary="EcoTrack" 
                secondary="A mobile app for tracking personal carbon footprint" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="BlockVote" 
                secondary="Secure voting system using blockchain technology" 
              />
            </ListItem>
          </List>
        )}
      </Box>
    </>
  );
};

const SubmitProjectPage = () => {
  return (
    <>
      <Typography variant="h3" component="h2" gutterBottom>
        Submit Your Project
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Project Name"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Project Description"
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          label="Technologies Used"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="GitHub Repository URL"
          variant="outlined"
          margin="normal"
        />
        <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
          Submit Project
        </Button>
      </Box>
    </>
  );
};

export default HackathonPlatform;