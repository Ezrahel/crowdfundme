import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' }, // Adjust paths as needed
    { text: 'Explore', icon: <SearchIcon />, path: '/explore' },
    { text: 'Create', icon: <AddBoxIcon />, path: '/create' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{
        width: 240,
        flexShrink: 0,
        [theme.breakpoints.up('md')]: {
          height: 'calc(100vh - 64px)', // Adjust for header height if necessary
          position: 'sticky',
          top: 64, // Adjust for header height if necessary
        },
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        paddingTop: theme.spacing(2),
      }}>
        {/* User Info Placeholder (will be in UserProfile) */}
        <Box sx={{ textAlign: 'center', p: 2 }}>
           {/* Avatar and Name will go here */}
           <Typography variant="h6">Sophia Bennett</Typography> {/* Placeholder Name */}
           <Typography variant="body2" color="text.secondary">Joined in 2021</Typography> {/* Placeholder Join Date */}
        </Box>
        <Divider sx={{ my: 2 }} />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#e8f5e9', // Light green background for active
                    color: '#1a7f37', // Green color for active
                    ' .MuiListItemIcon-root': {
                        color: '#1a7f37', // Green color for active icon
                    },
                  },
                   '&:hover': {
                       backgroundColor: '#f0f0f0', // Light gray on hover
                   }
                }}
              >
                <ListItemIcon sx={{ color: '#666' }}> {/* Default icon color */}
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default UserDashboardLayout; 