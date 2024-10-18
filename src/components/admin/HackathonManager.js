import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MCQManager from './MCQManager';
import CodingChallengeManager from './CodingChallengeManager';

const HackathonManager = () => {
  const [hackathons, setHackathons] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hackathon, setHackathon] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxParticipants: '',
    prizeMoney: '',
    registrationFee: '',
    location: '',
    mode: 'online',
    skillLevel: 'all',
    tags: '',
    mcqs: [],
    codingChallenges: []
  });
  const [editingHackathonId, setEditingHackathonId] = useState(null);
  const [editingMCQs, setEditingMCQs] = useState([]);
  const [editingCodingChallenges, setEditingCodingChallenges] = useState([]);
  const [showCodingChallengeForm, setShowCodingChallengeForm] = useState(false);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);  
      const response = await axios.get('/api/hackathons', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHackathons(response.data);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); 
      const response = await fetch(`/api/admin/hackathons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const hackathonData = await response.json();
        setHackathon({
          ...hackathonData,
          tags: hackathonData.tags.join(', '),
          startDate: hackathonData.startDate.split('T')[0],
          endDate: hackathonData.endDate.split('T')[0],
          registrationDeadline: hackathonData.registrationDeadline.split('T')[0],
        });
        setEditingMCQs(hackathonData.mcqs || []);
        setEditingCodingChallenges(hackathonData.codingChallenges || []);
        setEditingHackathonId(id);
        setShowAddForm(true);
        window.scrollTo(0, 0);
      } else {
        console.error('Failed to fetch hackathon details');
      }
    } catch (error) {
      console.error('Error fetching hackathon details:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hackathon?')) {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Log the token
        const response = await fetch(`/api/admin/hackathons/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          fetchHackathons();
          toast.success('Hackathon deleted successfully');
        } else {
          const errorData = await response.json();
          console.error('Failed to delete hackathon:', errorData.message);
        }
      } catch (error) {
        console.error('Error deleting hackathon:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    setHackathon({ ...hackathon, [e.target.name]: e.target.value });
  };

  const handleMCQSubmit = (mcqs) => {
    setHackathon(prev => ({
      ...prev,
      mcqs: mcqs
    }));
  };

  const handleCodingChallengeSubmit = (challenge) => {
    setHackathon(prev => ({
      ...prev,
      codingChallenges: [...prev.codingChallenges, challenge]
    }));
    setShowCodingChallengeForm(false);
  };
  
  const handleRemoveCodingChallenge = (index) => {
    setHackathon(prev => ({
      ...prev,
      codingChallenges: prev.codingChallenges.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Log the token
      const hackathonData = {
        ...hackathon,
        tags: hackathon.tags.split(',').map(tag => tag.trim()),
        mcqs: hackathon.mcqs.filter(mcq => 
          mcq.question.trim() !== '' && 
          mcq.options.length >= 2 && 
          mcq.options.every(option => option.trim() !== '') && 
          mcq.correctAnswers.length > 0
        ),
      };

      console.log('Sending hackathon data:', JSON.stringify(hackathonData, null, 2));
      
      const url = editingHackathonId 
        ? `/api/admin/hackathons/${editingHackathonId}`
        : '/api/admin/hackathons';
      
      const method = editingHackathonId ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Ensure token is included
        },
        body: JSON.stringify(hackathonData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(editingHackathonId ? 'Hackathon updated successfully:' : 'Hackathon created successfully:', result);

        if (hackathon.codingChallenges.length > 0) {
          const challengePromises = hackathon.codingChallenges.map(challenge => 
            fetch(`http://localhost:5000/api/admin/coding-challenges`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                ...challenge,
                hackathon: result._id 
              }),
            })
          );

          await Promise.all(challengePromises);
        }
        // Save MCQs separately
        if (hackathonData.mcqs && hackathonData.mcqs.length > 0) {
          const mcqResponse = await fetch('/api/admin/mcqs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mcqs: hackathonData.mcqs.map(mcq => ({ ...mcq, hackathon: result._id })) }),
          });
          if (mcqResponse.ok) {
            console.log('MCQs saved successfully');
          } else {
            const mcqErrorData = await mcqResponse.json();
            console.error('Failed to save MCQs:', mcqErrorData.message);
          }
        }

        toast.success(editingHackathonId ? 'Hackathon updated successfully!' : 'Hackathon created successfully!');
        setEditingHackathonId(null);
        setShowAddForm(false);
        fetchHackathons(); // Refresh the list
        // Reset the form
        setHackathon({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          registrationDeadline: '',
          maxParticipants: '',
          prizeMoney: '',
          registrationFee: '',
          location: '',
          mode: 'online',
          skillLevel: 'all',
          tags: '',
          mcqs: [],
          codingChallenges: []
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create hackathon');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error creating hackathon: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom>Manage Hackathons</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setShowAddForm(true)}
        style={{ marginBottom: '20px' }}
      >
        ADD HACKATHON
      </Button>

      {showAddForm ? (
        <div style={{ maxHeight: 'calc(100% - 48px)', overflow: 'auto' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="title"
                  label="Hackathon Title"
                  value={hackathon.title}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  value={hackathon.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="startDate"
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={hackathon.startDate}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="endDate"
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={hackathon.endDate}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="registrationDeadline"
                  label="Registration Deadline"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={hackathon.registrationDeadline}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="maxParticipants"
                  label="Max Participants"
                  type="number"
                  value={hackathon.maxParticipants}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="prizeMoney"
                  label="Prize Money"
                  type="number"
                  value={hackathon.prizeMoney}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="registrationFee"
                  label="Registration Fee"
                  type="number"
                  value={hackathon.registrationFee}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="location"
                  label="Location"
                  value={hackathon.location}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Mode</InputLabel>
                  <Select
                    name="mode"
                    value={hackathon.mode}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="offline">Offline</MenuItem>
                    <MenuItem value="hybrid">Hybrid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Skill Level</InputLabel>
                  <Select
                    name="skillLevel"
                    value={hackathon.skillLevel}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="all">All Levels</MenuItem>
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="tags"
                  label="Tags (comma-separated)"
                  value={hackathon.tags}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  {editingHackathonId ? 'Update Hackathon' : 'Save Hackathon'}
                </Button>
              </Grid>
            </Grid>
          </form>
          <Typography variant="h6" gutterBottom>Coding Challenges</Typography>
          {hackathon.codingChallenges.map((challenge, index) => (
            <div key={index}>
              <Typography variant="subtitle1">{challenge.name}</Typography>
              <Button onClick={() => handleRemoveCodingChallenge(index)}>Remove</Button>
            </div>
          ))}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setShowCodingChallengeForm(true)}
            style={{ marginTop: '10px' }}
          >
            Add Coding Challenge
          </Button>
          <MCQManager 
            onSubmit={handleMCQSubmit} 
            initialMCQs={editingHackathonId ? editingMCQs : []}
          />
          {showCodingChallengeForm && (
            <CodingChallengeManager 
              onSubmit={handleCodingChallengeSubmit} 
              initialChallenges={editingHackathonId ? editingCodingChallenges : []}
            />
          )}
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hackathons.map((hackathon) => (
                <TableRow key={hackathon._id}>
                  <TableCell>{hackathon.title}</TableCell>
                  <TableCell>{new Date(hackathon.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(hackathon.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(hackathon._id)}>Edit</Button>
                    <Button onClick={() => handleDelete(hackathon._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default HackathonManager;
