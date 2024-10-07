import React, { useState, useEffect } from 'react';
import { Typography, Box, Chip, Grid, Card, CardContent, LinearProgress, Snackbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tag } from 'lucide-react';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const truncateDescription = (description) => {
    return description.length > 20 ? description.substring(0, 20) + '...' : description;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ flexGrow: 1, display: 'flex', marginTop: 13, justifyContent: 'center', alignItems: 'flex-start', padding: 2 }}>
        <Box sx={{ maxWidth: 1200, width: '100%' }}>
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
            <Grid container spacing={3}>
              {hackathons.map((hackathon) => (
                <Grid item xs={12} sm={6} md={4} key={hackathon._id}>
                  <Card 
                    onClick={() => handleHackathonClick(hackathon)}
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': { transform: 'scale(1.02)' },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {hackathon.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {truncateDescription(hackathon.description || 'No description available')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                        <Tag size={16} />
                        <Chip 
                          label={hackathon.skillLevel} 
                          size="small" 
                          sx={{ ml: 1 }} 
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default HackathonList;
