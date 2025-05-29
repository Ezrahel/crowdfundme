import React from 'react';
import { FundraisingProvider } from './contexts/FundraisingContext';
import FundraisingForm from './components/fundraising/FundraisingForm';

function App() {
  return (
    <FundraisingProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Start Your Fundraiser</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <FundraisingForm />
          </div>
        </main>
      </div>
    </FundraisingProvider>
  );
}

export default App; 