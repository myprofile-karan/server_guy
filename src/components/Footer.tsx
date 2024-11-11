import React from 'react';
import { Box } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{
      backgroundColor: 'black',
      color: 'white',
      paddingx: '20px',
      paddingY: '50px',
      textAlign: 'center',
      width: '100%',

    }}>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ul style={{ display: 'flex', gap: '20px', listStyle: 'none' }}>
          <li style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>• About</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>• Settings</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>• Help</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>• Api Documentation</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>• Hacker News</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>• Frok/Contribute</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>• Frok/Cool Apps</a>
          </li>
        </ul>
      </Box>
    </Box>
  );
};

export default Footer;
