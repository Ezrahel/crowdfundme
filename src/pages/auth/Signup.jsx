import React from 'react';
import { SignUp, SignedOut, SignedIn, UserButton, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const Signup = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up to start your fundraising journey</p>
        </div>
        <SignedOut>
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'auth-button',
                card: 'auth-card',
                headerTitle: 'auth-header',
                headerSubtitle: 'auth-header',
                socialButtonsBlockButton: 'social-button',
                formFieldInput: 'input-group input',
                formFieldLabel: 'form-group label',
                footerActionLink: 'auth-switch a'
              }
            }}
            afterSignUpUrl="/dashboard"
          />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Signup;