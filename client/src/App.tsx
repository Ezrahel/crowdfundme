import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FundraisingProvider } from './contexts/FundraisingContext';
import FundraisingForm from './components/fundraising/FundraisingForm';
import CampaignPage from './components/campaign/CampaignPage';
import UserProfile from './components/user/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Login from '../../src/pages/auth/Login.jsx';
import Signup from '../../src/pages/auth/Signup.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import NewCampaignDashboard from './components/campaign/NewCampaignDashboard';
import Header from './components/layout/Header';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const theme = createTheme();

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/login">
      <Router>
        <FundraisingProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="min-h-screen bg-gray-50">
              <Header />
              <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  <h1 className="text-3xl font-bold text-gray-900">CrowdFundMe</h1>
                </div>
              </header>
              <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <Routes>
                    <Route path="/" element={<FundraisingForm />} />
                    {/* <Route path="/campaign/1" element={<CampaignPage />} /> */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                      {/* Add protected routes here */}
                    </Route>
                    {/* Public Routes */}
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/newdashboard" element={<NewCampaignDashboard />} />
                  </Routes>
                </div>
              </main>
            </div>
          </ThemeProvider>
        </FundraisingProvider>
      </Router>
    </ClerkProvider>
  );
}

export default App; 