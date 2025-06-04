import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#1a7f37', fontWeight: 'bold' }}>
          FundRise
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" component={Link} to="/" sx={{ color: '#333', mx: 1 }}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/explore" sx={{ color: '#333', mx: 1 }}>
            Explore
          </Button>
          <Button color="inherit" component={Link} to="/create" sx={{ color: '#333', mx: 1 }}>
            Create
          </Button>
        </Box>

        {/* Icons and Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <IconButton color="inherit" sx={{ color: '#333' }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit" sx={{ p: 0, ml: 2 }}>
            <Avatar alt="User Profile" src="/static/images/avatar/1.jpg" /> {/* Replace with actual avatar source */}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 