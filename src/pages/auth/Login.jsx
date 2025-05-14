import React from 'react';
import { SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/clerk-react';
import './Auth.css';

const Login = () => (
  <div className="auth-container">
    <div className="auth-card">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignIn />
    </div>
  </div>
);

export default Login; 