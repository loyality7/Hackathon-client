import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Grid, Paper } from '@mui/material';
import MCQSection from './MCQSection';
import CodingChallengeSection from './CodingChallengeSection';

const HackathonDetails = () => {
  const [hackathon, setHackathon] = useState(null);
  const [showMCQ, setShowMCQ] = useState(false);
  const [showCodingChallenge, setShowCodingChallenge] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    // Fetch specific hackathon data
    fetch(`/api/hackathons/${id}`)
      .then(response => response.json())
      .then(data => setHackathon(data))
      .catch(error => console.error('Error fetching hackathon:', error));
  }, [id]);

  if (!hackathon) return <div>Loading...</div>;

  return (
    <div>
      <Typography variant="h5" gutterBottom>{hackathon.title}</Typography>
      <Typography variant="body1" paragraph>{hackathon.description}</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => setShowMCQ(!showMCQ)}>
            {showMCQ ? 'Hide MCQs' : 'Show MCQs'}
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => setShowCodingChallenge(!showCodingChallenge)}>
            {showCodingChallenge ? 'Hide Coding Challenge' : 'Show Coding Challenge'}
          </Button>
        </Grid>
      </Grid>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {showMCQ && <MCQSection hackathonId={hackathon.id} />}
        {showCodingChallenge && <CodingChallengeSection hackathonId={hackathon.id} />}
      </Paper>
    </div>
  );
};

export default HackathonDetails;