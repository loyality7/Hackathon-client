import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, Grid, Chip, MenuItem, Select, FormControl, InputLabel, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';
import CodeIcon from '@mui/icons-material/Code';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { addDays, isAfter } from 'date-fns';

const DarkContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#121212',
  color: '#fff',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: '15px',
    '& fieldset': {
      borderColor: '#333',
    },
    '&:hover fieldset': {
      borderColor: '#555',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#888',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#888',
  },
  '& .MuiInputBase-input': {
    color: '#fff',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '15px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#333',
    borderRadius: '15px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#555',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#888',
  },
  '& .MuiSelect-icon': {
    color: '#888',
  },
  '& .MuiInputBase-input': {
    color: '#fff',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '15px',
  padding: theme.spacing(1, 3),
}));

const ResetButton = styled(Button)(({ theme }) => ({
  borderRadius: '15px',
  padding: theme.spacing(1, 3),
  backgroundColor: '#fff',
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main,
  },
}));

const HackathonRegistrationForm = ({ hackathon, onRegister }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userStartDate, setUserStartDate] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    currentLocation: '',
    contactNumber: '',
    university: '',
    degree: '',
    stream: '',
    graduationYear: ''
  });

  useEffect(() => {
    checkRegistrationStatus();
  }, [hackathon._id]);

  const checkRegistrationStatus = async () => {
    try {
      const response = await axios.get(`/api/hackathons/${hackathon._id}/registration-status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsRegistered(response.data.isRegistered);
      if (response.data.startDate) {
        setUserStartDate(new Date(response.data.startDate));
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startDate = new Date();
      const endDate = addDays(startDate, 7);
      const response = await axios.post(`/api/hackathons/${hackathon._id}/register`, 
        { ...formData, startDate, endDate },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      if (response.data.success) {
        setIsRegistered(true);
        setUserStartDate(startDate);
        onRegister(response.data);
        navigate(`/hackathons`);
      } else {
        console.error('Registration failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const renderIntroPage = () => (
   
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3, color: 'primary.main' }}>
        {hackathon.title}
      </Typography>
      <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
        {hackathon.description}
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography><strong>Start Date:</strong> {new Date(hackathon.startDate).toLocaleDateString()}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography><strong>End Date:</strong> {new Date(hackathon.endDate).toLocaleDateString()}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography><strong>Location:</strong> {hackathon.location}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography><strong>Prize Money:</strong> ${hackathon.prizeMoney}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography><strong>Max Participants:</strong> {hackathon.maxParticipants}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography><strong>Skill Level:</strong> {hackathon.skillLevel}</Typography>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4, justifyContent: 'center' }}>
        {hackathon.tags.map((tag, index) => (
          <Chip key={index} label={tag} color="primary" variant="outlined" />
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setShowForm(true)}
        >
          Register Now
        </Button>
      </Box>
    </Paper>
  );

  const renderRegistrationForm = () => (
   
    <DarkContainer maxWidth="sm" style={{ marginTop: '50px', marginBottom: '50px'}}>
      <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
        Registration Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <StyledTextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel sx={{ color: '#888' }}>Gender</InputLabel>
          <StyledSelect
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            label="Gender"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </StyledSelect>
        </FormControl>
        <StyledTextField
          fullWidth
          label="Current Location"
          name="currentLocation"
          value={formData.currentLocation}
          onChange={handleChange}
          margin="normal"
          required
        />
        <StyledTextField
          fullWidth
          label="Contact Number"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 1 }}>Education Details</Typography>
        <StyledTextField
          fullWidth
          label="University"
          name="university"
          value={formData.university}
          onChange={handleChange}
          margin="normal"
          required
        />
        <StyledTextField
          fullWidth
          label="Degree"
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          margin="normal"
          required
        />
        <StyledTextField
          fullWidth
          label="Stream"
          name="stream"
          value={formData.stream}
          onChange={handleChange}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel sx={{ color: '#888' }}>Graduation Year</InputLabel>
          <StyledSelect
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            label="Graduation Year"
          >
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
            <MenuItem value="2026">2026</MenuItem>
            <MenuItem value="2027">2027</MenuItem>
            <MenuItem value="2028">2028</MenuItem>
          </StyledSelect>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <StyledButton type="submit" variant="contained" color="primary">
            Submit Registration
          </StyledButton>
          <ResetButton
            variant="outlined"
            onClick={() => setShowForm(false)}
            sx={{ ml: 2 }}
          >
            Reset
          </ResetButton>
        </Box>
      </form>
    </DarkContainer>
  
  );

  const renderContent = () => {
    if (isRegistered) {
      const userEndDate = userStartDate ? addDays(userStartDate, 7) : null;
      const isExpired = userEndDate && isAfter(new Date(), userEndDate);

      if (isExpired) {
        return (
          <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom align="center">
              Your hackathon period has expired. Please register again to continue.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowForm(true)}
              >
                Register Again
              </Button>
            </Box>
          </Paper>
        );
      } else {
        return (
          <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom align="center">
              You are registered for this hackathon!
            </Typography>
            <Typography variant="body1" align="center">
              Your hackathon ends on: {userEndDate?.toLocaleDateString()}
            </Typography>
          </Paper>
        );
      }
    } else if (showForm) {
      return renderRegistrationForm();
    } else {
      return renderIntroPage();
    }
  };

  return (
    
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', p: 3, backgroundColor: '#f5f5f5' }}>
      {renderContent()}
    </Box>
   
  );
};

export default HackathonRegistrationForm;
