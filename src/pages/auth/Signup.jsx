import React from 'react';
import { SignUp, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
const Signup = () => (
  <div className="auth-container">
    <div className="auth-card">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignUp />
    </div>
  </div>
);

export default Signup;