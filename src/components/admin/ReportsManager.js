import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';

const ReportsManager = () => {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [submissions, setSubmissions] = useState({
    projectSubmissions: [],
    mcqSubmissions: [],
    codingSubmissions: []
  });

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await axios.get('/api/admin/hackathons');
        setHackathons(response.data);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      }
    };

    fetchHackathons();
  }, []);

  const fetchSubmissions = async (hackathonId) => {
    try {
      const response = await axios.get(`/api/admin/hackathons/${hackathonId}/submissions`);
      setSubmissions(response.data);
      setSelectedHackathon(hackathons.find(h => h._id === hackathonId));
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const groupSubmissionsByUser = () => {
    const userSubmissions = {};

    submissions.projectSubmissions.forEach(sub => {
      const username = sub.user?.username || 'N/A';
      if (!userSubmissions[username]) {
        userSubmissions[username] = { projects: [], mcqs: [], codings: [] };
      }
      userSubmissions[username].projects.push(sub);
    });

    submissions.mcqSubmissions.forEach(sub => {
      const username = sub.user?.username || 'N/A';
      if (!userSubmissions[username]) {
        userSubmissions[username] = { projects: [], mcqs: [], codings: [] };
      }
      userSubmissions[username].mcqs.push(sub);
    });

    submissions.codingSubmissions.forEach(sub => {
      const username = sub.user?.username || 'N/A';
      if (!userSubmissions[username]) {
        userSubmissions[username] = { projects: [], mcqs: [], codings: [] };
      }
      userSubmissions[username].codings.push(sub);
    });

    return Object.entries(userSubmissions);
  };

  const renderUserSubmissions = () => (
    <div>
      {groupSubmissionsByUser().map(([username, submissions]) => (
        <Accordion key={username}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{username}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6">Projects</Typography>
            {submissions.projects && submissions.projects.length > 0 ? (
              <List>
                {submissions.projects.map((project, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Project ${index + 1}`}
                      secondary={`Link: ${project.projectLink}, Description: ${project.description}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No project submissions</Typography>
            )}

            <Typography variant="h6">MCQ Submissions</Typography>
            {submissions.mcqs && submissions.mcqs.length > 0 ? (
              <List>
                {submissions.mcqs.map((mcq, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`MCQ ${index + 1}`}
                      secondary={`Score: ${mcq.score}, Answers: ${JSON.stringify(mcq.answers)}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No MCQ submissions</Typography>
            )}

            <Typography variant="h6">Coding Submissions</Typography>
            {submissions.codings && submissions.codings.length > 0 ? (
              <List>
                {submissions.codings.map((coding, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Coding ${index + 1}`}
                      secondary={`Passed: ${coding.passed ? 'Yes' : 'No'}, Code: ${coding.code}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No coding submissions</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );

  const downloadCSV = () => {
    if (!selectedHackathon) return;

    const csvRows = [];
    // Fixed header
    csvRows.push(['Username', 'MCQ', 'Coding', 'Project']);

    groupSubmissionsByUser().forEach(([username, submissions]) => {
      const maxSubmissions = Math.max(
        submissions.mcqs?.length || 0,
        submissions.codings?.length || 0,
        submissions.projects?.length || 0
      );

      for (let i = 0; i < maxSubmissions; i++) {
        const mcq = submissions.mcqs[i] || {};
        const coding = submissions.codings[i] || {};
        const project = submissions.projects[i] || {};

        csvRows.push([
          username, 
          mcq.score !== undefined ? `Score: ${mcq.score}` : '',
          coding.passed !== undefined ? `Passed: ${coding.passed ? 'Yes' : 'No'}` : '',
          project.projectLink ? `Link: ${project.projectLink}` : ''
        ]);
      }
    });

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedHackathon.title}_submissions.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Hackathon Reports</Typography>

      {!selectedHackathon ? (
        <List>
          {hackathons.map((hackathon) => (
            <ListItem 
              button 
              key={hackathon._id} 
              onClick={() => fetchSubmissions(hackathon._id)}
            >
              <ListItemText primary={hackathon.title} secondary={`Start Date: ${new Date(hackathon.startDate).toLocaleDateString()}`} />
            </ListItem>
          ))}
        </List>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>{selectedHackathon.title} Reports</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={downloadCSV}
            style={{ marginBottom: '20px' }}
          >
            Download Detailed CSV
          </Button>

          {renderUserSubmissions()}
        </>
      )}
    </div>
  );
};

export default ReportsManager;