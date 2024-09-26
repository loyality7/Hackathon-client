import React, { useState, useContext } from 'react';
import { Typography, TextField, Button, Box, Paper, Container, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const SubmissionForm = ({ hackathon }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [description, setDescription] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenDialog(true); // Open the dialog instead of submitting directly
  };

  const handleConfirmSubmit = async () => {
    try {
      const response = await axios.post('/api/users/submit-project', {
        hackathonId: hackathon._id, // Make sure this is the correct ObjectId
        name: user.name, // Use the user's name from context
        email: user.email, // Use the user's email from context
        mobile,
        projectLink,
        description
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status === 201) {
        toast.success('Project submitted successfully!');
        // Clear form fields after successful submission
        setMobile('');
        setProjectLink('');
        setDescription('');
      setTimeout(() => {
        navigate('/');
      }, 5000);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      console.error('Error response:', error.response?.data);
      toast.error(`Failed to submit project. Error: ${error.response?.data?.message || error.message}`);
    }
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Submit Your Project
        </Typography>
        <Typography variant="h5" gutterBottom align="center">
          {hackathon.title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" paragraph align="center">
          {hackathon.description}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={user.name}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={user.email}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project Link"
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ 
                px: 4, 
                py: 1.5, 
                borderRadius: '50px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                },
              }}
            >
              Submit Project
            </Button>
          </Box>
        </form>
      </StyledPaper>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            borderRadius: '20px',
            padding: '24px',
            background: 'linear-gradient(145deg, #f6f7f9, #ffffff)',
            // boxShadow: '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff'
          },
        }}
      >
        <DialogTitle 
          id="alert-dialog-title"
          sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'primary.main',
            textAlign: 'center',
            mb: 2,
          }}
        >
          Are you sure you want to submit your project?
        </DialogTitle>
        <DialogContent>
          <DialogContentText 
            id="alert-dialog-description"
            sx={{
              fontSize: '16px',
              color: 'text.secondary',
              textAlign: 'center',
              mb: 3,
            }}
          >
            This action cannot be undone. Please make sure you have completed all the necessary steps and are ready to submit your project.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            color="secondary"
            sx={{
              borderRadius: '20px',
              px: 3,
              py: 1,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            color="primary"
            autoFocus
            sx={{
              borderRadius: '20px',
              px: 3,
              py: 1,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Container>
  );
};

export default SubmissionForm;
