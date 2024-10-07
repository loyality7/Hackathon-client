import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea, 
  Snackbar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Group, Code, EmojiEvents } from '@mui/icons-material'; // Removed unused CardAction
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Banner from './Banner';
import { ParallaxProvider, Parallax, ParallaxBanner } from 'react-scroll-parallax';

const dummyHackathons = [
  {
    id: 1,
    name: "AI for Good Hackathon",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS2mgl3VoRjtw_JWRZJK4tyuoSBISp2rFmzg&s",
    description: "Develop AI solutions to address global challenges.",
    applyUrl: "https://example.com/apply/ai-for-good"
  },
  {
    id: 2,
    name: "Green Tech Innovation",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5UGC__RbI9nYINCtVLDXefz9Mmrj5H2QrCw&s",
    description: "Create sustainable tech solutions for a greener future.",
    applyUrl: "https://example.com/apply/green-tech"
  },
  {
    id: 3,
    name: "FinTech Revolution",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWMpCiXe7a-26ylCGJu8bwzXCdYStGPuSitg&s",
    description: "Innovate in the world of financial technology.",
    applyUrl: "https://example.com/apply/fintech-revolution"
  },
  {
    id: 4,
    name: "Health Tech Breakthroughs",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfuXTISY2NlJL3XuL106dRFjLt2a1qI4yrIg&s",
    description: "Develop cutting-edge solutions for healthcare.",
    applyUrl: "https://example.com/apply/health-tech"
  }
];
const features = [
  { title: 'Collaborate', description: 'Work with talented developers', icon: <Group /> },
  { title: 'Code', description: 'Build innovative projects', icon: <Code /> },
  { title: 'Win', description: 'Compete for amazing prizes', icon: <EmojiEvents /> },
];


function Home() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const handleUrlParams = () => {
      const searchParams = new URLSearchParams(location.search);
      const data = {
        name: searchParams.get('name'),
        email: searchParams.get('email'),
        userId: searchParams.get('user_id'),
        userRole: searchParams.get('user_role'),
        userPassword: searchParams.get('password'),
        fullName: searchParams.get('full_name'),
        avatarUrl: searchParams.get('avatar_url')
      };

      if (data.name && data.email && data.userId && data.userRole && data.userPassword) {
        handleSignupAndLogin(data);
        // Immediately remove URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleUrlParams();
  }, [location]);

  const handleSignupAndLogin = async (data) => {
    try {
      console.log('Attempting signup with data:', data);
      
      // Try to sign up the user
      const signupResponse = await axios.post('/api/users/signup', {
        username: data.name,
        email: data.email,
        password: data.userPassword,
        name: data.fullName, // Use fullName instead of name
        userId: data.userId,
        avatarUrl: data.avatarUrl // Add this line
      });

      console.log('Signup response:', signupResponse.data);
    } catch (signupError) {
      console.log('Signup failed, attempting login:', signupError.response?.data);
    }

    // Proceed with login attempt
    try {
      const loginResponse = await axios.post('/api/users/login', {
        usernameOrEmail: data.email,
        password: data.userPassword
      });

      if (loginResponse.data.token) {
        login(loginResponse.data.token, loginResponse.data.user);
        navigate('/');
      } else {
        throw new Error('Login response did not include a token');
      }
    } catch (loginError) {
      console.error('Login error:', loginError.response?.data || loginError.message);
      setSnackbarMessage('Login error: ' + (loginError.response?.data?.message || loginError.message));
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor:'#000000' }}>
      <Header />
      <Banner />
      <Container sx={{ flexGrow: 1, mt: 0 }}>
        <Typography 
          variant={isMobile ? "h4" : "h2"} 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: '#ffff', 
            textAlign: 'center', 
            fontFamily:'6809 Chargen', 
            my: 4 
          }}
        >
          You'll Get To
        </Typography>
        <Grid 
          container 
          spacing={isMobile ? 2 : 5} 
          sx={{ mt:3 }} 
          style={{ 
            display: 'flex',  
            justifyContent: 'center', 
            background:'linear-gradient(to right, #000000, #1057C0 30%, #000000, #1057C0)' 
          }}
        >
          {features.map((feature, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={index} 
              style={{ padding:'20px' }} 
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  boxShadow: 3, 
                  backgroundColor:'transparent', 
                  borderRadius: 2,
                  border:'2px solid #ffff'
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, color:'#ffff' }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    component="div" 
                    gutterBottom 
                    align="center" 
                    style={{color:'#ffff'}}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    style={{color:'#ffff'}} 
                    align="center"
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <Button 
                    size="small" 
                    style={{color:'#ffff'}}
                    sx={{ fontSize: isMobile ? '0.8rem' : '1rem' }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            textAlign: 'center', 
            mt: 6, 
            color: '#FFFFFF', 
            fontFamily: '6809 Chargen' 
          }}
        >
          Join the next generation of problem solvers in our
        </Typography>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            textAlign: 'center', 
            color: '#FFFFFF',
            mb:3, 
            fontFamily: '6809 Chargen' 
          }}
        >
          global hackathon <Box component="span" sx={{ color: '#1057C0' }}>community...</Box>
        </Typography>

        {user ? (
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            {/* <Typography variant="h4" gutterBottom sx={{ color: '#444' }}>
              Welcome back, {user.name || user.email}!
            </Typography> */}
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                color:'#ffff',
                fontSize: isMobile ? '1rem' : '1.25rem'
              }}
            >
              Ready to tackle the next challenge? Explore our upcoming hackathons!
            </Typography>
            <Button 
              onClick={() => navigate('/hackathons')}
              sx={{ 
                fontSize: isMobile ? '0.9rem' : '1.1rem', 
                padding: isMobile ? '10px 20px' : '12px 24px',
                backgroundColor:'#0F52B7', 
                color:'#ffff', 
                borderRadius: '10px',
                border:'1px solid #ffff',
                '&:hover': {
                  backgroundColor: '#0D4A99',
                }
              }}
            >
              Explore Hackathons
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              gutterBottom 
              sx={{ color: '#444' }}
            >
              Join Our Innovative Community
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Collaborate with brilliant minds and turn your ideas into reality!
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/login')}
              sx={{ 
                fontSize: isMobile ? '0.9rem' : '1.1rem', 
                padding: isMobile ? '10px 20px' : '12px 24px', 
                borderRadius: '50px',
                minWidth: isMobile ? '150px' : '200px',
                '&:hover': {
                  backgroundColor: '#0D4A99',
                }
              }}
            >
              Get Started
            </Button>
          </Box>
        )}

        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            mb: 4, 
            color: '#ffffff', 
            textAlign: 'center' 
          }}
        >
          Featured Hackathons
        </Typography>

        <Grid 
          container 
          spacing={isMobile ? 2 : 8} 
          sx={{ 
            maxWidth: '80%', 
            margin: '0 auto', 
            marginBottom:'20px' 
          }}
        >
          {dummyHackathons.map((hackathon) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={6} 
              key={hackathon.id}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  border:'1px solid #ffff', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  boxShadow: 3, 
                  borderRadius: 2,
                  backgroundColor: '#000000'
                }}
              >
                <CardActionArea>
                {/* onClick={() => navigate(`/hackathon/${hackathon.id}`)} */}
                  <CardMedia
                    component="img"
                    height={isMobile ? "100" : "140"}
                    image={hackathon.image}
                    alt={hackathon.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent 
                    sx={{ 
                      flexGrow: 1,
                      backgroundColor:'#000000',
                      color:'#ffff'
                    }}
                  >
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="div"
                      sx={{ fontSize: isMobile ? '1rem' : 'h6.fontSize' }}
                    >
                      {hackathon.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={'#ffff'} 
                      sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
                    >
                      {hackathon.description}
                    </Typography>
                    {/* <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        href={hackathon.applyUrl} 
                        target="_blank" 
                        sx={{ 
                          fontSize: isMobile ? '0.8rem' : '1rem', 
                          height: isMobile ? '30px' : '35px', 
                          width: '80%', 
                          padding: '8px 16px', 
                          borderRadius: '9px', 
                          marginTop:'10px',
                          '&:hover': {
                            backgroundColor: '#0D4A99',
                          }
                        }}
                      >
                        Apply now
                      </Button>
                    </Box> */}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Container>
      <Footer />
    </Box>
  );
}

export default Home;
