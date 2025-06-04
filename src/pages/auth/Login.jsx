import React from 'react';
import { SignIn, SignedOut, SignedIn, UserButton, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
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
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>
        <SignedOut>
          <SignIn 
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
            afterSignInUrl="/dashboard"
          />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Login; 