import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#000000',
        padding: '1rem',
        color: 'white',
        textAlign: 'center',
        borderTop: '3px solid #333',
        // position: 'fixed',
        // bottom: 0,
        // left: 0,
        // right: 0,
      }}
    >
      <Typography variant="body2" align="center">
        &copy; {new Date().getFullYear()} Hyster Hackathon. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
