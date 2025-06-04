import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import Signup from './pages/auth/Signup';
import FundraisingSetup from './pages/fundraising/FundraisingSetup';
import NextFundRaise from './pages/fundraising/fundraisingSetup2';
import FundraisingSetupGoal from './pages/fundraising/fundraisingSetupGoal';
import FundraisingSetupNextDetails from './pages/fundraising/fundraisingSetupNextDetails';
import FundraisingSetupAccountDetails from './pages/fundraising/fundraisingSetupAccountDetails';
import FundraisingSetupReviewPublish from './pages/fundraising/fundraisingSetupReviewPublish';
import UserDashboard from './components/dashboard/UserDashboard';
import AboutUs from './pages/about/AboutUs';
import LandingPage from './pages/landingPage/landingPage';
import Login from './pages/auth/Login';
import WithdrawalPage from './components/dashboard/WithdrawalPage';
import { FundraisingProvider } from './context/FundraisingContext';
import PaymentForm from '../client/src/components/payment/PaymentForm';
import CampaignPage from '../client/src/components/campaign/CampaignWithdrawals';
// import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from '../client/src/components/user/UserProfile';
import NewCampaignDashboard from '../client/src/components/campaign/NewCampaignDashboard';
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

function App() {
  return (
    <FundraisingProvider>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/donations" element={<FundraisingSetup />} />
            <Route path="/donations-2" element={<NextFundRaise/>}/>
            <Route path="/donations-3" element={<FundraisingSetupGoal/>}/>
            <Route path="/donations-4" element={<FundraisingSetupNextDetails/>}/>
            <Route path="/donations-5" element={<FundraisingSetupAccountDetails/>}/>
            <Route path="/donations-6" element={<FundraisingSetupReviewPublish/>}/>
            <Route path="/dashboard" element={<UserDashboard/>}/>
            <Route path="/about" element={<AboutUs/>}/>
            <Route path="/withdrawal" element={<WithdrawalPage/>}/>
            <Route path="/payments/initiate" element={<PaymentForm/>}/>
            <Route path="/campaign/1" element={<CampaignPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/newdashboard" element={<NewCampaignDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ClerkProvider>
    </FundraisingProvider>
  );
}

export default App;
