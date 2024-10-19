import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Button, Box, LinearProgress, Stepper, Step, StepLabel, Card, CardContent, Grid, Paper, Chip, Avatar } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import MCQSection from './MCQSection';
import CodingChallengeSection from './CodingChallengeSection';
import axios from 'axios';
import SubmissionForm from './SubmissionForm';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';
import CodeIcon from '@mui/icons-material/Code';
import HackathonRegistrationForm from './HackathonRegistrationForm';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { addDays, isAfter } from 'date-fns';

// Styled components
const GradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  textAlign: 'center',
  marginBottom: theme.spacing(3),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 25,
  padding: theme.spacing(1, 4),
}));

const DetailTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  animation: `${fadeIn} 0.5s ease-out`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
  },
}));

const AnimatedTypography = styled(Typography)(({ theme }) => ({
  transition: 'color 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const AnimatedChip = styled(Chip)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: theme.shadows[3],
  },
}));

const PulseIcon = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${pulse} 2s infinite`,
}));

const IconTypography = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const HackathonChallenge = () => {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [allChallengesCompleted, setAllChallengesCompleted] = useState(false);
  const [codingChallengesCompleted, setCodingChallengesCompleted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [userStartDate, setUserStartDate] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchHackathonAndCheckRegistration = async () => {
      try {
        const [hackathonResponse, registrationResponse, progressResponse] = await Promise.all([
          axios.get(`/api/hackathons/${id}`),
          axios.get(`/api/hackathons/${id}/registration-status`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`/api/hackathons/${id}/progress`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        setHackathon(hackathonResponse.data);
        setIsRegistered(registrationResponse.data.isRegistered);
        if (registrationResponse.data.startDate) {
          setUserStartDate(new Date(registrationResponse.data.startDate));
        }
        setUserProgress(progressResponse.data);
        // Update this line to set the correct active step based on user progress
        setActiveStep(progressResponse.data.currentStep || 0);
        setCompletedSteps(progressResponse.data.completedSteps || []);
      } catch (error) {
        console.error('Error fetching hackathon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathonAndCheckRegistration();
  }, [id]);

  const isHackathonExpired = () => {
    if (!userStartDate) return false;
    const userEndDate = addDays(userStartDate, 7);
    return isAfter(new Date(), userEndDate);
  };

  const handleRegistration = async (registrationData) => {
    try {
      const response = await axios.post(`/api/hackathons/${id}/register`, registrationData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Error registering for hackathon:', error);
      // Handle registration error (e.g., show error message to user)
    }
  };

  const steps = ['Hackathon Details', 'Test Your Knowledge', 'Solve Coding Challenges', 'Submit Project'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ height: isMobile ? 'auto' : 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <StyledPaper elevation={3}>
              <AnimatedTypography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
                {hackathon.title}
              </AnimatedTypography>
              <Typography variant="body1" paragraph sx={{ color: 'text.secondary', textAlign: 'center', mb: 4, width: isMobile ? '100%' : isTablet ? '75%' : '50%', margin: isMobile ? '0' : isTablet ? '0 auto' : '0 25%' }}>
                {hackathon.description}
              </Typography>
              <Grid container spacing={3} sx={{ width: isMobile ? '100%' : isTablet ? '75%' : '50%', margin: isMobile ? '0' : isTablet ? '0 auto' : '0 25%' }}>
                <Grid item xs={12} md={6}>
                  <IconTypography variant="body1">
                    <PulseIcon><EventIcon color="primary" /></PulseIcon>
                    <AnimatedTypography><strong>Start Date:</strong> {new Date(hackathon.startDate).toLocaleDateString()}</AnimatedTypography>
                  </IconTypography>
                  <IconTypography variant="body1">
                    <PulseIcon><EventIcon color="primary" /></PulseIcon>
                    <AnimatedTypography><strong>End Date:</strong> {new Date(hackathon.endDate).toLocaleDateString()}</AnimatedTypography>
                  </IconTypography>
                  <IconTypography variant="body1">
                    <PulseIcon><EventIcon color="primary" /></PulseIcon>
                    <AnimatedTypography><strong>Registration Deadline:</strong> {new Date(hackathon.registrationDeadline).toLocaleDateString()}</AnimatedTypography>
                  </IconTypography>
                  <IconTypography variant="body1">
                    <PulseIcon><GroupIcon color="primary" /></PulseIcon>
                    <AnimatedTypography><strong>Max Participants:</strong> {hackathon.maxParticipants}</AnimatedTypography>
                  </IconTypography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <IconTypography variant="body1">
                    <PulseIcon><AttachMoneyIcon color="primary" /></PulseIcon>
                    <AnimatedTypography><strong>Prize Money:</strong> ${hackathon.prizeMoney}</AnimatedTypography>
                  </IconTypography>
                  <IconTypography variant="body1">
                    <PulseIcon><AttachMoneyIcon color="primary" /></PulseIcon>
                    <AnimatedTypography><strong>Registration Fee:</strong> ${hackathon.registrationFee}</AnimatedTypography>
                  </IconTypography>
                  <IconTypography variant="body1">
                    <PulseIcon><LocationOnIcon color="primary" /></PulseIcon>
                    <AnimatedTypography><strong>Location:</strong> {hackathon.location}</AnimatedTypography>
                  </IconTypography>
                  <IconTypography variant="body1">
                    <PulseIcon><CodeIcon color="primary" /></PulseIcon>
                    <AnimatedTypography><strong>Skill Level:</strong> {hackathon.skillLevel}</AnimatedTypography>
                  </IconTypography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1, width: isMobile ? '100%' : isTablet ? '75%' : '50%', margin: isMobile ? '0' : isTablet ? '0 auto' : '0 25%' }}>
                {hackathon.tags.map((tag, index) => (
                  <AnimatedChip key={index} label={tag} color="primary" variant="outlined" />
                ))}
              </Box>
            </StyledPaper>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ height: 'calc(100vh - 200px)' }}>
            {completedSteps.includes(1) ? (
              <Typography>You have already completed the MCQ section. Please proceed to the next step.</Typography>
            ) : (
              <MCQSection 
                hackathonId={hackathon._id} 
                mcqs={hackathon.mcqs} 
                onComplete={() => updateUserProgress(activeStep, 1)}
              />
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ height: 'calc(100vh - 200px)' }}>
            {hackathon.codingChallenges && hackathon.codingChallenges.length > 0 ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Total Coding Challenges: {hackathon.codingChallenges.length}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Current Score: {totalScore}
                </Typography>
                <CodingChallengeSection 
                  hackathonId={hackathon._id} 
                  challenges={hackathon.codingChallenges} 
                  onAllChallengesCompleted={handleAllChallengesCompleted}
                />
              </>
            ) : (
              <Typography>No coding challenges available for this hackathon.</Typography>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ height: 'calc(100vh - 200px)' }}>
            <SubmissionForm hackathon={hackathon} />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleNext = () => {
    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    updateUserProgress(nextStep, activeStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAllChallengesCompleted = (completed, score) => {
    setAllChallengesCompleted(completed);
    setCodingChallengesCompleted(completed);
    setTotalScore(prevScore => prevScore + score);
  };

  const updateUserProgress = async (newStep, completedStep) => {
    try {
      const updatedCompletedSteps = [...completedSteps];
      if (completedStep && !updatedCompletedSteps.includes(completedStep)) {
        updatedCompletedSteps.push(completedStep);
      }
      const response = await axios.post(`/api/hackathons/${id}/progress`, 
        { 
          currentStep: newStep, 
          completedSteps: updatedCompletedSteps,
          totalScore: totalScore
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUserProgress(response.data);
      setCompletedSteps(response.data.completedSteps);
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  };

  if (loading) return <LinearProgress />;

  // Add this check
  if (!hackathon) return <Typography>Loading hackathon details...</Typography>;

  if (!isRegistered || isHackathonExpired()) {
    return (
      <>
      <Header />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', p: 3, backgroundColor: '#f5f5f5' }}>
        <HackathonRegistrationForm hackathon={hackathon} onRegister={handleRegistration} />
      </Box>
      <Footer />
      </>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      p: isMobile ? 1 : 3,
      backgroundColor: '#f5f5f5',
    }}>
      <GradientBox>
        <Typography variant={isMobile ? "h4" : "h3"} gutterBottom>
          Hackathon Challenge
        </Typography>
        <Typography variant={isMobile ? "body2" : "subtitle1"}>
          Unleash your creativity and coding skills!
        </Typography>
      </GradientBox>

      <LinearProgress 
        variant="determinate" 
        value={(activeStep / 3) * 100} 
        sx={{ 
          mb: 3, 
          height: isMobile ? 6 : 10, 
          borderRadius: 5,
          backgroundColor: 'rgba(255,255,255,0.3)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
          },
        }} 
      />
      
      {isMobile ? (
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: 'primary.main' }}>
          Step {activeStep + 1}: {steps[activeStep]}
        </Typography>
      ) : (
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 3 }}>
        {getStepContent(activeStep)}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', mt: 2, gap: isMobile ? 2 : 0 }}>
        <StyledButton
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
          fullWidth={isMobile}
        >
          Back
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1 || (activeStep === 2 && !codingChallengesCompleted)}
          fullWidth={isMobile}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </StyledButton>
      </Box>
    </Box>
  );
};

export default HackathonChallenge;
