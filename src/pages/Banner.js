import React, { useState, useEffect, useContext } from 'react';
import { Container, Box, Typography, Button, styled, useTheme } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import { AuthContext } from '../contexts/AuthContext';

const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const bannerStyles = (theme) => ({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',  
    overflow: 'hidden',   
    textAlign: 'center',
    background: 'linear-gradient(to bottom, #000000 70%, #146EF5)',
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1),
    },
});

const shineAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

const AnimatedShinyButton = styled(Button)(({ theme }) => ({
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.main} 100%)`,
    backgroundSize: '200% auto',
    color: theme.palette.common.white,
    transition: 'all 0.3s ease',
    animation: `${shineAnimation} 3s linear infinite`,
    borderRadius: '25px',
    padding: theme.spacing(1, 3),
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5, 2),
        fontSize: '0.875rem',
    },
    '&:hover': {
        backgroundPosition: 'right center',
        color: theme.palette.common.white,
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));

const TypingAnimation = ({ text, delay = 100 }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const theme = useTheme();  
    useEffect(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText((prevText) => prevText + text[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, delay);

        return () => clearTimeout(timer);
      }
    }, [currentIndex, delay, text]);

    return (
      <Typography variant="h2" component="h2" gutterBottom
        sx={{
          [theme.breakpoints.down('sm')]: {
              fontSize: '2rem',
              lineHeight: '2.5rem',
          },
          [theme.breakpoints.down('md')]: {
              fontSize: '3rem',
              lineHeight: '3.5rem',
          },
        }}
      >
        <Typography component="span" variant="h2" color="white" sx={{ fontWeight: 'bold', fontSize: { xs: '36px', sm: '48px', md: '100px' }, fontFamily: 'Quadrangle', lineHeight: { xs: '40px', sm: '50px', md: '120px' } }}>
          {displayText}
        </Typography>
      </Typography>
    );
};

const LetterPullup = ({ text, delay = 0.05 }) => {
    const theme = useTheme();
    return (
      <Typography variant="h5" component="h2" className="letter-pullup"
        sx={{
          fontWeight: 'bold',
          fontFamily: 'Quadrangle',
          lineHeight: '30px',
          [theme.breakpoints.down('sm')]: {
              fontSize: '18px',
              lineHeight: '22px',
          },
          [theme.breakpoints.down('md')]: {
              fontSize: '24px',
              lineHeight: '28px',
          },
        }}
      >
        {text.split('').map((char, index) => (
          <span
            key={index}
            style={{ 
                animationDelay: `${index * delay}s`, 
                color: '#686868',
                fontSize: '30px',
            }}
          >
            {char}
          </span>
        ))}
      </Typography>
    );
};

const Banner = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const theme = useTheme();

    const handleStartClick = () => {
        // Replace this with your actual user check logic
        const isUserLoggedIn = user; // or true, depending on your auth state
        console.log(isUserLoggedIn);
        if (isUserLoggedIn) {
          navigate('/hackathons');
        } else {
          navigate('/login');
        }
    };

    return (
        <Container component="section" maxWidth={false} sx={bannerStyles(theme)}>
          
          <Box className="banner-text-wrapper">
            <TypingAnimation  text="Hack- A-Thon" delay={150} />
            <LetterPullup  text="Hack the Planet, One Algorithm at a Time" delay={0.1} />
            <Box sx={{ width: { xs: '30px', sm: '40px' }, height: '2px', backgroundColor: 'primary.main', margin: { xs: '16px auto', sm: '20px auto' } }} />
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
              <Button variant="contained" color="primary" onClick={handleStartClick}
                sx={{
                    padding: { xs: '6px 12px', sm: '8px 16px' },
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                }}
              >
                Start
              </Button>
              <Button variant="outlined" color="primary" sx={{ color:'white', border:'2px solid white',
                padding: { xs: '6px 12px', sm: '8px 16px' },
                fontSize: { xs: '0.8rem', sm: '1rem' },
              }}>
                Learn More
              </Button>
            </Box>
            <Box sx={{ mt: { xs: 1, sm: 2 } }}>
              <AnimatedShinyButton
                startIcon={<img src="https://res.cloudinary.com/dfdtxogcl/images/c_scale,w_248,h_180,dpr_1.25/f_auto,q_auto/v1706606519/Picture1_215dc6b/Picture1_215dc6b.png" alt="Hysterchat" style={{ width: '24px', height: '24px', marginRight: '6px' }} />}
                href="https://nexterchat.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Be A Member on NexterChat
              </AnimatedShinyButton>
            </Box>
          </Box>
          <ArrowDownwardIcon
            sx={{
              fontSize: { xs: 16, sm: 20 },
              mt: { xs: 2, sm: 4 },
              color: 'white',
              border: '2px solid white',
              borderRadius: '50%',
              padding: '5px',
              animation: `${bounceAnimation} 2s infinite`
            }}
          />
        </Container>
    );
};

export default Banner;
