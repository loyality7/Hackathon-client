import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box } from '@mui/material';
import axios from 'axios';

const HackathonMetrics = ({ hackathonId }) => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`/api/users/hackathons/${hackathonId}/metrics`);
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching hackathon metrics:', error);
      }
    };

    fetchMetrics();
  }, [hackathonId]);

  if (!metrics) return <Typography>Loading metrics...</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>Hackathon Metrics</Typography>
      <Box>
        <Typography>Participants: {metrics.participants}</Typography>
        <Typography>Total Submissions: {metrics.totalSubmissions}</Typography>
        <Typography>MCQ Completion Rate: {metrics.mcqCompletionRate.toFixed(2)}%</Typography>
        <Typography>Average MCQ Score: {metrics.averageMcqScore.toFixed(2)}%</Typography>
        <Typography>Coding Challenges Attempted: {metrics.codingChallengesAttempted}</Typography>
        <Typography>Coding Challenges Solved: {metrics.codingChallengesSolved}</Typography>
        <Typography>Average Coding Challenge Score: {metrics.averageCodingScore.toFixed(2)}%</Typography>
        <Typography>Top Performer: {metrics.topPerformer}</Typography>
      </Box>
    </Paper>
  );
};

export default HackathonMetrics;
