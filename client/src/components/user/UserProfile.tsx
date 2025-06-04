import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import UserDashboardLayout from '../layout/UserDashboardLayout';
import { Box, Typography, Avatar, Button, Tabs, Tab, Card, CardContent } from '@mui/material';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'backed'>('campaigns');

  if (!user) {
    return <UserDashboardLayout><div>Loading...</div></UserDashboardLayout>;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'overview' | 'campaigns' | 'backed') => {
    setActiveTab(newValue);
  };

  const handleStartCampaignClick = () => {
    navigate('/');
  };

  const handleExploreProjectsClick = () => {
    console.log('Navigate to explore projects');
  };

  return (
    <UserDashboardLayout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1a7f37', fontWeight: 'bold' }}>
          Profile
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar src={user.imageUrl} alt={user.fullName || 'User'} sx={{ width: 80, height: 80, mr: 3 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {user.fullName || user.primaryEmailAddress?.emailAddress || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Joined in {user.createdAt ? new Date(user.createdAt).getFullYear() : ''}
            </Typography>
          </Box>
          <Button variant="outlined" sx={{ color: '#1a7f37', borderColor: '#1a7f37', '&:hover': { borderColor: '#1a7f37', backgroundColor: 'rgba(26, 127, 55, 0.04)' } }}>
            Edit profile
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="profile sections tabs"
            TabIndicatorProps={{ sx: { backgroundColor: '#1a7f37' } }}
          >
            <Tab label="Overview" value="overview" sx={{ '&.Mui-selected': { color: '#1a7f37' } }} />
            <Tab label="Campaigns" value="campaigns" sx={{ '&.Mui-selected': { color: '#1a7f37' } }} />
            <Tab label="Backed" value="backed" sx={{ '&.Mui-selected': { color: '#1a7f37' } }} />
          </Tabs>
        </Box>

        <Box>
          {activeTab === 'overview' && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Overview</Typography>
              <Typography>User overview information goes here.</Typography>
            </Box>
          )}

          {activeTab === 'campaigns' && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Campaigns</Typography>
              <Card variant="outlined" sx={{ border: '2px dashed #e0e0e0' }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="body1" gutterBottom>No campaigns yet</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Start a campaign to share your ideas with the world.
                  </Typography>
                  <Button variant="contained" sx={{ backgroundColor: '#1a7f37', '&:hover': { backgroundColor: '#15652d' } }} onClick={handleStartCampaignClick}>
                    Start a campaign
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}

          {activeTab === 'backed' && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Backed</Typography>
              <Card variant="outlined" sx={{ border: '2px dashed #e0e0e0' }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="body1" gutterBottom>No backed projects yet</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Explore projects and back the ones you love.
                  </Typography>
                  <Button variant="contained" sx={{ backgroundColor: '#1a7f37', '&:hover': { backgroundColor: '#15652d' } }} onClick={handleExploreProjectsClick}>
                    Explore projects
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </UserDashboardLayout>
  );
};

export default UserProfile; 