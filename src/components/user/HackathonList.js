import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Box, Chip, Tab, Tabs, LinearProgress, Snackbar, Button } from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Tag } from 'lucide-react';
import './css/HackathonList.css';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await axios.get('/api/hackathons', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setHackathons(response.data);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
        setError(`Failed to fetch hackathons. Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  const handleHackathonClick = (hackathon) => {
    navigate(`/hackathon/${hackathon._id}`, { state: { hackathon } });
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getHackathonStatus = (hackathon) => {
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);

    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'past';
    return 'present';
  };

  const filteredHackathons = hackathons.filter(hackathon => {
    const status = getHackathonStatus(hackathon);
    return (tabValue === 0 && status === 'upcoming') ||
           (tabValue === 1 && status === 'present') ||
           (tabValue === 2 && status === 'past');
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'primary';
      case 'present': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ flexGrow: 1, display: 'flex', marginTop: 13, justifyContent: 'center', alignItems: 'flex-start', padding: 2 }}>
        <Box sx={{ maxWidth: 600, width: '100%' }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
            Hackathon Events
          </Typography>
          
          {loading && <LinearProgress />}
          {error && (
            <Snackbar
              open={Boolean(error)}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              message={error}
              action={
                <Button color="inherit" onClick={handleCloseSnackbar}>
                  Close
                </Button>
              }
            />
          )}

          {!loading && !error && (
            <>
              <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
                <Tab label="Upcoming" />
                <Tab label="Present" />
                <Tab label="Past" />
              </Tabs>

              {filteredHackathons.length === 0 ? (
                <Typography variant="body1" align="center">
                  No hackathons available for this category at the moment.
                </Typography>
              ) : (
                <List>
                  <TransitionGroup>
                    {filteredHackathons.map((hackathon) => (
                      <CSSTransition
                        key={hackathon._id}
                        timeout={300}
                        classNames="item"
                      >
                        <ListItem
                          button
                          onClick={() => handleHackathonClick(hackathon)}
                          sx={{
                            mb: 2,
                            borderRadius: 2,
                            boxShadow: 2,
                            '&:hover': { backgroundColor: 'action.hover', transform: 'scale(1.02)' },
                            transition: 'all 0.3s ease-in-out',
                          }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              {hackathon.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Calendar size={16} />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Tag size={16} />
                                <Chip 
                                  label={hackathon.skillLevel} 
                                  size="small" 
                                  sx={{ ml: 1 }} 
                                />
                              </Box>
                              <Chip
                                label={getHackathonStatus(hackathon)}
                                size="small"
                                color={getStatusColor(getHackathonStatus(hackathon))}
                              />
                            </Box>
                          </Box>
                        </ListItem>
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                </List>
              )}
            </>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default HackathonList;